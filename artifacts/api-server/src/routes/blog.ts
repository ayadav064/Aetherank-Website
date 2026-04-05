import { Router } from "express";
import { randomUUID } from "crypto";
import { db } from "@workspace/db";
import { blogPostsTable } from "@workspace/db/schema";
import { eq, desc, asc, or, sql } from "drizzle-orm";
import { authMiddleware } from "../lib/auth";

const router = Router();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

// ── Public: list all published posts ─────────────────────────────────────

router.get("/blog/posts", async (_req, res) => {
  try {
    const posts = await db
      .select()
      .from(blogPostsTable)
      .orderBy(asc(blogPostsTable.sortOrder), desc(blogPostsTable.createdAt));
    res.json(posts);
  } catch {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// ── Public: single post by id or slug ────────────────────────────────────

router.get("/blog/posts/:idOrSlug", async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const rows = await db
      .select()
      .from(blogPostsTable)
      .where(or(eq(blogPostsTable.id, idOrSlug!), eq(blogPostsTable.slug, idOrSlug!)))
      .limit(1);
    if (!rows[0]) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// ── Admin: reorder posts ──────────────────────────────────────────────────

router.put("/blog/posts/reorder", authMiddleware, async (req, res) => {
  try {
    const { ids } = req.body as { ids: string[] };
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: "ids must be a non-empty array" });
      return;
    }
    for (let i = 0; i < ids.length; i++) {
      await db
        .update(blogPostsTable)
        .set({ sortOrder: i + 1 })
        .where(eq(blogPostsTable.id, ids[i]!));
    }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to reorder posts" });
  }
});

// ── Admin: create post ────────────────────────────────────────────────────

router.post("/blog/posts", authMiddleware, async (req, res) => {
  try {
    const body = req.body as Record<string, unknown>;
    const now = new Date();
    const title = String(body["title"] ?? "Untitled");
    const content = String(body["content"] ?? "");
    const post = {
      id: randomUUID(),
      title,
      slug: String(body["slug"] || slugify(title)),
      excerpt: String(body["excerpt"] ?? ""),
      content,
      category: String(body["category"] ?? "General"),
      tags: (body["tags"] as string[]) ?? [],
      author: String(body["author"] ?? "Aetherank Team"),
      date: String(body["date"] ?? now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })),
      image: String(body["image"] ?? ""),
      status: String(body["status"] ?? "draft") as "draft" | "published",
      readTime: String(body["readTime"] || estimateReadTime(content)),
      seo: (body["seo"] as { title: string; description: string; keywords: string; schema: string }) ?? {
        title: "", description: "", keywords: "", schema: ""
      },
      createdAt: now,
      updatedAt: now,
    };
    const [created] = await db.insert(blogPostsTable).values(post).returning();
    res.status(201).json(created);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create post";
    res.status(500).json({ error: msg });
  }
});

// ── Admin: update post ────────────────────────────────────────────────────

router.put("/blog/posts/:id", authMiddleware, async (req, res) => {
  try {
    const body = req.body as Record<string, unknown>;
    const content = typeof body["content"] === "string" ? body["content"] : undefined;
    const updates: Record<string, unknown> = { ...body, updatedAt: new Date() };
    if (content) updates["readTime"] = estimateReadTime(content);
    delete updates["id"];

    const [updated] = await db
      .update(blogPostsTable)
      .set(updates as Partial<typeof blogPostsTable.$inferInsert>)
      .where(eq(blogPostsTable.id, req.params["id"]!))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update post" });
  }
});

// ── Admin: delete post ────────────────────────────────────────────────────

router.delete("/blog/posts/:id", authMiddleware, async (req, res) => {
  try {
    await db.delete(blogPostsTable).where(eq(blogPostsTable.id, req.params["id"]!));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
