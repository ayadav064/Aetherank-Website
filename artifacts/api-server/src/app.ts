/**
 * app.ts — Vite SSR + SEO injection
 *
 * Serves the React app with true server-side rendering:
 * 1. Loads the compiled entry-server.mjs (Vite SSR build)
 * 2. Pre-fetches CMS settings from the DB
 * 3. Calls render(url, cmsData) → full HTML string
 * 4. Injects per-page SEO tags (schema, meta, canonical, OG)
 * 5. Returns a complete, crawler-readable HTML document
 *
 * Admin routes (/admin/*) skip SSR and are served as a plain SPA
 * since they require auth and are not indexed by search engines.
 *
 * DEPLOY TO: artifacts/api-server/src/app.ts
 */

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
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sitemap & robots at root
app.use(sitemapRouter);
app.use("/api", router);

const isProduction = process.env.NODE_ENV === "production";
const SITE_ORIGIN = "https://aetherank.in";

// ── CMS settings cache (60s TTL) ─────────────────────────────────────────────

interface SeoPageSettings {
  title?: string;
  description?: string;
  keywords?: string;
  schema?: string;
  faq_schema?: string;
}

let cachedSettings: Record<string, unknown> | null = null;
let cacheTs = 0;
const CMS_CACHE_TTL = 60_000;

async function getCmsSettings(): Promise<Record<string, unknown>> {
  const now = Date.now();
  if (cachedSettings && now - cacheTs < CMS_CACHE_TTL) return cachedSettings;
  try {
    const rows = await db.select().from(settingsTable);
    const main = rows.find((r) => r.key === "main");
    cachedSettings = (main?.value as Record<string, unknown>) ?? {};
    cacheTs = now;
  } catch {
    // DB error — keep previous cache or return empty
    if (!cachedSettings) cachedSettings = {};
  }
  return cachedSettings;
}

function getSeoForPath(
  cmsData: Record<string, unknown>,
  pagePath: string
): SeoPageSettings | undefined {
  const seo = (cmsData["seo"] ?? {}) as Record<string, SeoPageSettings>;
  return seo[pagePath];
}

// ── HTML helpers ─────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHeadTags(
  pageSeo: SeoPageSettings | undefined,
  pagePath: string,
  existingHeadTags: string
): string {
  const canonicalUrl = `${SITE_ORIGIN}${pagePath === "/" ? "" : pagePath}`;
  const tags: string[] = [existingHeadTags];

  if (!pageSeo) {
    tags.push(`<link rel="canonical" href="${canonicalUrl}" />`);
    tags.push(`<meta property="og:url" content="${canonicalUrl}" />`);
    return tags.join("\n  ");
  }

  // Schema (JSON-LD)
  if (pageSeo.schema) {
    try {
      JSON.parse(pageSeo.schema);
      tags.push(
        `<script type="application/ld+json" id="aetherank-schema-ld">${pageSeo.schema}</script>`
      );
    } catch {
      logger.warn({ pagePath }, "Invalid JSON-LD — skipped");
    }
  }
  if (pageSeo.faq_schema) {
    try {
      JSON.parse(pageSeo.faq_schema);
      tags.push(
        `<script type="application/ld+json" id="aetherank-faq-schema-ld">${pageSeo.faq_schema}</script>`
      );
    } catch {
      logger.warn({ pagePath }, "Invalid FAQ JSON-LD — skipped");
    }
  }

  if (pageSeo.title) {
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
  tags.push(`<link rel="canonical" href="${canonicalUrl}" />`);
  tags.push(`<meta property="og:url" content="${canonicalUrl}" />`);

  return tags.join("\n  ");
}

function assembleHtml(
  template: string,
  appHtml: string,
  headInjection: string,
  pageSeo: SeoPageSettings | undefined
): string {
  let html = template;

  // Replace default title if CMS has a page-specific one
  if (pageSeo?.title) {
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeHtml(pageSeo.title)}</title>`
    );
  }

  // Remove duplicate/stale meta tags that will be re-injected
  html = html.replace(/<meta\s+name="description"[^>]*>/gi, "");
  html = html.replace(/<meta\s+name="keywords"[^>]*>/gi, "");
  html = html.replace(/<meta\s+property="og:title"[^>]*>/gi, "");
  html = html.replace(/<meta\s+property="og:description"[^>]*>/gi, "");
  html = html.replace(/<meta\s+property="og:url"[^>]*>/gi, "");
  html = html.replace(/<meta\s+name="twitter:title"[^>]*>/gi, "");
  html = html.replace(/<meta\s+name="twitter:description"[^>]*>/gi, "");
  html = html.replace(/<link\s+rel="canonical"[^>]*>/gi, "");
  // Remove hardcoded JSON-LD from index.html (CMS version wins)
  html = html.replace(
    /<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi,
    ""
  );

  // Inject SSR head tags
  html = html.replace("<!--ssr-head-->", headInjection);
  // Inject SSR body HTML
  html = html.replace("<!--ssr-body-->", appHtml);

  return html;
}

// ── SSR renderer (loaded lazily in production) ───────────────────────────────

type RenderFn = (
  url: string,
  initialCmsData?: Record<string, unknown>
) => Promise<{ html: string; headTags: string }>;

let ssrRender: RenderFn | null = null;
let ssrLoadError: Error | null = null;

async function loadSsrRenderer(distDir: string): Promise<RenderFn | null> {
  if (ssrRender) return ssrRender;
  if (ssrLoadError) return null;

  // The Vite SSR build outputs to dist/server/entry-server.mjs
  const ssrEntry = path.join(
    path.dirname(distDir), // parent of dist/public → dist
    "server",
    "entry-server.mjs"
  );

  if (!existsSync(ssrEntry)) {
    logger.warn(
      { ssrEntry },
      "SSR entry not found — falling back to meta-only injection (run `BUILD_SSR=1 vite build` to enable full SSR)"
    );
    return null;
  }

  try {
    const mod = await import(ssrEntry);
    ssrRender = mod.render as RenderFn;
    logger.info({ ssrEntry }, "✅ Vite SSR renderer loaded");
    return ssrRender;
  } catch (err) {
    ssrLoadError = err as Error;
    logger.error({ err }, "Failed to load SSR renderer — falling back");
    return null;
  }
}

// ── Frontend serving ─────────────────────────────────────────────────────────

if (isProduction) {
  const distDir = existsSync(path.resolve(__dirname, "public"))
    ? path.resolve(__dirname, "public")
    : path.resolve(process.cwd(), "../aetherank-website/dist/public");

  if (existsSync(distDir)) {
    // Serve static assets (JS, CSS, images, fonts)
    app.use(
      express.static(distDir, {
        // Cache assets aggressively (they have content-hashed filenames)
        maxAge: "1y",
        immutable: true,
        // Don't serve index.html for unknown paths — let SSR handle it
        index: false,
      })
    );

    const baseHtml = readFileSync(path.join(distDir, "index.html"), "utf-8");

    // Pre-load the SSR renderer
    loadSsrRenderer(distDir).catch(() => {});

    app.use(async (req, res) => {
      // Normalise path
      let pagePath = req.path.split("?")[0];
      if (pagePath !== "/" && pagePath.endsWith("/"))
        pagePath = pagePath.slice(0, -1);

      // Admin routes — always plain SPA (no SSR, no indexing)
      if (pagePath.startsWith("/admin")) {
        res.setHeader("X-Robots-Tag", "noindex, nofollow");
        res.setHeader("Cache-Control", "no-store");
        return res.type("html").send(baseHtml);
      }

      try {
        const cmsData = await getCmsSettings();
        const pageSeo = getSeoForPath(cmsData, pagePath);
        const renderer = await loadSsrRenderer(distDir);

        let appHtml = "";
        let serverHeadTags = "";

        if (renderer) {
          // ── Full SSR path ────────────────────────────────────────────────
          const result = await renderer(pagePath, cmsData);
          appHtml = result.html;
          serverHeadTags = result.headTags; // includes window.__INITIAL_CMS__ script
        }
        // else: fall through with empty appHtml — client hydrates as SPA
        // (meta/schema is still injected via buildHeadTags below)

        const headInjection = buildHeadTags(pageSeo, pagePath, serverHeadTags);
        const html = assembleHtml(baseHtml, appHtml, headInjection, pageSeo);

        res.setHeader("Cache-Control", "no-store");
        res.setHeader("X-SSR", renderer ? "full" : "meta-only");
        return res.type("html").send(html);
      } catch (err) {
        logger.error({ err, pagePath }, "SSR render error — sending base HTML");
        return res.type("html").send(baseHtml);
      }
    });

    logger.info({ distDir }, "✅ Serving frontend with SSR");
  } else {
    logger.warn({ distDir }, "Frontend dist not found — only API routes active");
  }
}

runSeed().catch((err) => logger.error({ err }, "[seed] Startup seed failed"));

export default app;
