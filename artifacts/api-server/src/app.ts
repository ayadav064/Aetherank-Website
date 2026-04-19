import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { existsSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import router, { sitemapRouter } from "./routes";
import { logger } from "./lib/logger";
import { runSeed } from "./seed";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sitemap & robots at root (not under /api)
app.use(sitemapRouter);

app.use("/api", router);

const isProduction = process.env.NODE_ENV === "production";

// ─── Types matching cmsApi.ts ───────────────────────────────────────────────

interface SeoPageSettings {
  title?: string;
  description?: string;
  keywords?: string;
  schema?: string;
  faq_schema?: string;
}

interface CmsSettings {
  seo?: Record<string, SeoPageSettings>;
}

// ─── SEO settings cache (refreshed every 60 s) ───────────────────────────────

let cachedSeo: Record<string, SeoPageSettings> = {};
let cacheTs = 0;
const SEO_CACHE_TTL_MS = 60_000;

async function getSeoSettings(): Promise<Record<string, SeoPageSettings>> {
  const now = Date.now();
  if (now - cacheTs < SEO_CACHE_TTL_MS) return cachedSeo;
  try {
    const rows = await db.select().from(settingsTable);
    const main = rows.find((r) => r.key === "main");
    const parsed = main?.value as CmsSettings | undefined;
    cachedSeo = parsed?.seo ?? {};
    cacheTs = now;
  } catch {
    // on DB error keep the previous cache
  }
  return cachedSeo;
}

// ─── HTML injection helper ───────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Injects SEO tags into the raw index.html string before </head>. */
function injectSeo(html: string, pageSeo: SeoPageSettings, pagePath: string): string {
  const SITE_ORIGIN = "https://aetherank.in";
  const canonicalUrl = `${SITE_ORIGIN}${pagePath === "/" ? "" : pagePath}`;

  const tags: string[] = [];

  // ── Schema markup (JSON-LD) ───────────────────────────────────────────────
  if (pageSeo.schema) {
    try {
      JSON.parse(pageSeo.schema); // validate before injecting
      tags.push(
        `<script type="application/ld+json" id="aetherank-schema-ld">${pageSeo.schema}</script>`,
      );
    } catch {
      logger.warn({ pagePath }, "Invalid JSON-LD schema — skipping SSR injection");
    }
  }

  if (pageSeo.faq_schema) {
    try {
      JSON.parse(pageSeo.faq_schema);
      tags.push(
        `<script type="application/ld+json" id="aetherank-faq-schema-ld">${pageSeo.faq_schema}</script>`,
      );
    } catch {
      logger.warn({ pagePath }, "Invalid FAQ JSON-LD schema — skipping SSR injection");
    }
  }

  // ── Meta tags (title, description, OG, Twitter) ──────────────────────────
  // Only inject what's explicitly saved so we don't stomp the index.html defaults.
  if (pageSeo.title) {
    // Replace existing <title> or append a new one
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(pageSeo.title)}</title>`);
    tags.push(`<meta property="og:title" content="${escapeHtml(pageSeo.title)}" />`);
    tags.push(`<meta name="twitter:title" content="${escapeHtml(pageSeo.title)}" />`);
  }

  if (pageSeo.description) {
    tags.push(`<meta name="description" content="${escapeHtml(pageSeo.description)}" />`);
    tags.push(`<meta property="og:description" content="${escapeHtml(pageSeo.description)}" />`);
    tags.push(`<meta name="twitter:description" content="${escapeHtml(pageSeo.description)}" />`);
  }

  if (pageSeo.keywords) {
    tags.push(`<meta name="keywords" content="${escapeHtml(pageSeo.keywords)}" />`);
  }

  // Canonical + OG URL
  tags.push(`<link rel="canonical" href="${canonicalUrl}" />`);
  tags.push(`<meta property="og:url" content="${canonicalUrl}" />`);

  if (tags.length === 0) return html;

  // Inject all tags just before </head>
  const injection = tags.join("\n  ") + "\n";
  return html.replace("</head>", `  ${injection}</head>`);
}

// ─── Frontend serving ────────────────────────────────────────────────────────

if (isProduction) {
  const distDir =
    existsSync(path.resolve(__dirname, "public"))
      ? path.resolve(__dirname, "public")
      : path.resolve(process.cwd(), "../aetherank-website/dist/public");

  if (existsSync(distDir)) {
    app.use(express.static(distDir));

    // Cache the raw index.html content once at startup
    const indexHtmlPath = path.join(distDir, "index.html");
    const baseHtml = readFileSync(indexHtmlPath, "utf-8");

    /**
     * Catch-all: inject per-page SEO (schema + meta tags) into index.html
     * before sending it to the client/crawler. This makes JSON-LD visible in
     * the initial HTML response — no JavaScript execution required.
     */
    app.use(async (req, res) => {
      try {
        // Normalise path: strip query string, trailing slash (except root)
        let pagePath = req.path.split("?")[0];
        if (pagePath !== "/" && pagePath.endsWith("/")) {
          pagePath = pagePath.slice(0, -1);
        }

        const seoMap = await getSeoSettings();
        const pageSeo = seoMap[pagePath];

        if (!pageSeo) {
          // No CMS data for this path — serve the unmodified index.html
          res.type("html").send(baseHtml);
          return;
        }

        const html = injectSeo(baseHtml, pageSeo, pagePath);
        // Prevent CDN/browser caching of the HTML so schema changes reflect quickly
        res.setHeader("Cache-Control", "no-store");
        res.type("html").send(html);
      } catch (err) {
        logger.error({ err }, "SSR SEO injection error — falling back to base HTML");
        res.type("html").send(baseHtml);
      }
    });

    logger.info({ distDir }, "Serving static frontend with SSR SEO injection");
  } else {
    logger.warn({ distDir }, "Frontend dist not found — only API routes available");
  }
}

// Run data seed on startup (inserts missing blog posts, syncs CMS settings)
runSeed().catch((err) => logger.error({ err }, "[seed] Startup seed failed"));

export default app;
