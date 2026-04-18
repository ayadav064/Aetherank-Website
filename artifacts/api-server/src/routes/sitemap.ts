import { Router } from "express";
import { db } from "@workspace/db";
import { blogPostsTable, settingsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

const DEFAULT_SITE_URL = process.env["SITE_URL"] ?? "https://aetherank.in";

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/services", priority: "0.9", changefreq: "monthly" },
  { path: "/services/seo", priority: "0.9", changefreq: "monthly" },
  { path: "/services/ppc", priority: "0.9", changefreq: "monthly" },
  { path: "/services/social-media", priority: "0.9", changefreq: "monthly" },
  { path: "/services/web-design-development", priority: "0.8", changefreq: "monthly" },
  { path: "/services/content-marketing", priority: "0.8", changefreq: "monthly" },
  { path: "/services/orm", priority: "0.8", changefreq: "monthly" },
  { path: "/services/meta-ads", priority: "0.8", changefreq: "monthly" },
  { path: "/about-us", priority: "0.7", changefreq: "monthly" },
  { path: "/case-studies", priority: "0.7", changefreq: "monthly" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
  { path: "/contact", priority: "0.7", changefreq: "yearly" },
  { path: "/free-audit", priority: "0.8", changefreq: "monthly" },
  { path: "/request-proposal", priority: "0.8", changefreq: "monthly" },
  { path: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms-of-service", priority: "0.3", changefreq: "yearly" },
];

const DEFAULT_ROBOTS = (siteUrl: string) =>
`User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/admin

# Allow beneficial AI search agents
User-agent: OAI-SearchBot
Allow: /

# Block OpenAI training crawler
User-agent: GPTBot
Disallow: /

# Block Google AI training crawler
User-agent: Google-Extended
Disallow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

function xmlEscape(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function getTechnicalSettings(): Promise<{ robots_txt?: string; sitemap_site_url?: string }> {
  try {
    const rows = await db.select().from(settingsTable).where(eq(settingsTable.key, "main")).limit(1);
    const val = rows[0]?.value as Record<string, unknown> | undefined;
    return (val?.technical as { robots_txt?: string; sitemap_site_url?: string }) ?? {};
  } catch {
    return {};
  }
}

// ── GET /sitemap.xml ──────────────────────────────────────────────────────

router.get("/sitemap.xml", async (_req, res) => {
  try {
    const [posts, tech] = await Promise.all([
      db
        .select({ slug: blogPostsTable.slug, updatedAt: blogPostsTable.updatedAt })
        .from(blogPostsTable)
        .where(eq(blogPostsTable.status, "published")),
      getTechnicalSettings(),
    ]);

    const SITE_URL = tech.sitemap_site_url?.trim() || DEFAULT_SITE_URL;
    const now = new Date().toISOString().split("T")[0];

    const staticUrls = STATIC_PAGES.map(
      (p) => `
  <url>
    <loc>${xmlEscape(SITE_URL)}${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <lastmod>${now}</lastmod>
  </url>`
    ).join("");

    const blogUrls = posts
      .map(
        (p) => `
  <url>
    <loc>${xmlEscape(SITE_URL)}/blog/${xmlEscape(p.slug)}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <lastmod>${p.updatedAt ? p.updatedAt.toISOString().split("T")[0] : now}</lastmod>
  </url>`
      )
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${blogUrls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch {
    res.status(500).send("Failed to generate sitemap");
  }
});

// ── GET /robots.txt ───────────────────────────────────────────────────────

router.get("/robots.txt", async (_req, res) => {
  const tech = await getTechnicalSettings();
  const SITE_URL = tech.sitemap_site_url?.trim() || DEFAULT_SITE_URL;
  const content = tech.robots_txt ?? DEFAULT_ROBOTS(SITE_URL);
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(content);
});

export default router;
