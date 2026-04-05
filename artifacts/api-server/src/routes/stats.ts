import { Router } from "express";
import { db } from "@workspace/db";
import { blogPostsTable, submissionsTable, pageViewsTable } from "@workspace/db/schema";
import { eq, count, gte, desc, sql } from "drizzle-orm";
import { authMiddleware } from "../lib/auth";

const router = Router();

// ── GET /api/admin/stats ─ dashboard overview ─────────────────────────────

router.get("/admin/stats", authMiddleware, async (_req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [[totalPosts], [publishedPosts], [draftPosts]] = await Promise.all([
      db.select({ count: count() }).from(blogPostsTable),
      db.select({ count: count() }).from(blogPostsTable).where(eq(blogPostsTable.status, "published")),
      db.select({ count: count() }).from(blogPostsTable).where(eq(blogPostsTable.status, "draft")),
    ]);

    const [[totalSubs], [unreadSubs], [recentSubs]] = await Promise.all([
      db.select({ count: count() }).from(submissionsTable),
      db.select({ count: count() }).from(submissionsTable).where(eq(submissionsTable.read, false)),
      db.select({ count: count() }).from(submissionsTable).where(gte(submissionsTable.createdAt, thirtyDaysAgo)),
    ]);

    const [[totalViews], [recentViews]] = await Promise.all([
      db.select({ count: count() }).from(pageViewsTable),
      db.select({ count: count() }).from(pageViewsTable).where(gte(pageViewsTable.createdAt, thirtyDaysAgo)),
    ]);

    const topPages = await db
      .select({ path: pageViewsTable.path, views: count() })
      .from(pageViewsTable)
      .groupBy(pageViewsTable.path)
      .orderBy(desc(count()))
      .limit(10);

    const subsByType = await db
      .select({ type: submissionsTable.type, count: count() })
      .from(submissionsTable)
      .groupBy(submissionsTable.type);

    const recentSubmissions = await db
      .select()
      .from(submissionsTable)
      .orderBy(desc(submissionsTable.createdAt))
      .limit(5);

    res.json({
      blog: {
        total: totalPosts?.count ?? 0,
        published: publishedPosts?.count ?? 0,
        draft: draftPosts?.count ?? 0,
      },
      submissions: {
        total: totalSubs?.count ?? 0,
        unread: unreadSubs?.count ?? 0,
        last30Days: recentSubs?.count ?? 0,
        byType: subsByType,
        recent: recentSubmissions,
      },
      analytics: {
        totalViews: totalViews?.count ?? 0,
        last30Days: recentViews?.count ?? 0,
        topPages,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
