import { Router } from "express";
import { db } from "@workspace/db";
import { pageViewsTable } from "@workspace/db/schema";
import { count, desc, gte } from "drizzle-orm";
import { authMiddleware, getClientIp } from "../lib/auth";
import { logger } from "../lib/logger";

const router = Router();

// ── POST /api/track ─ record a page view ─────────────────────────────────

router.post("/track", async (req, res) => {
  try {
    const body = req.body as { path?: string; referrer?: string };
    const path = typeof body.path === "string" ? body.path.slice(0, 500) : "/";
    const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : "";
    const userAgent = String(req.headers["user-agent"] ?? "").slice(0, 500);
    const ip = getClientIp(req);

    await db.insert(pageViewsTable).values({ path, referrer, userAgent, ip, createdAt: new Date() });
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "[track] insert failed");
    res.json({ ok: false });
  }
});

// ── GET /api/admin/analytics ─ analytics report ───────────────────────────

router.get("/admin/analytics", authMiddleware, async (req, res) => {
  try {
    const days = Math.max(1, Math.min(90, parseInt(String(req.query["days"] ?? "30"))));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [topPages, [totalRow]] = await Promise.all([
      db
        .select({ path: pageViewsTable.path, views: count() })
        .from(pageViewsTable)
        .where(gte(pageViewsTable.createdAt, since))
        .groupBy(pageViewsTable.path)
        .orderBy(desc(count()))
        .limit(20),
      db.select({ views: count() }).from(pageViewsTable).where(gte(pageViewsTable.createdAt, since)),
    ]);

    res.json({
      period: `${days} days`,
      totalViews: totalRow?.views ?? 0,
      topPages,
    });
  } catch (err) {
    logger.error({ err }, "[analytics] query failed");
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
