import { Router } from "express";
import { db } from "@workspace/db";
import { settingsTable, newsletterSubscribersTable } from "@workspace/db/schema";
import { authMiddleware, getAdminToken } from "../lib/auth";
import { desc, eq } from "drizzle-orm";

const router = Router();

// ── Login ─────────────────────────────────────────────────────────────────

router.post("/admin/login", (req, res) => {
  const { password } = req.body as { password?: string };
  if (!password) {
    res.status(400).json({ ok: false, error: "Password required" });
    return;
  }
  const expected = process.env["ADMIN_PASSWORD"] ?? "aetherank2026";
  if (password !== expected) {
    res.status(401).json({ ok: false, error: "Invalid password" });
    return;
  }
  res.json({ ok: true, token: getAdminToken() });
});

// ── Verify token ──────────────────────────────────────────────────────────

router.get("/admin/verify", authMiddleware, (_req, res) => {
  res.json({ ok: true });
});

// ── Public Settings (no auth) ──────────────────────────────────────────────

router.get("/settings", async (_req, res) => {
  try {
    const rows = await db.select().from(settingsTable);
    const main = rows.find((r) => r.key === "main");
    res.json(main?.value ?? {});
  } catch {
    res.status(500).json({ ok: false, error: "Failed to load settings" });
  }
});

// ── CMS Settings ──────────────────────────────────────────────────────────

router.get("/admin/settings", authMiddleware, async (_req, res) => {
  try {
    const rows = await db.select().from(settingsTable);
    const main = rows.find((r) => r.key === "main");
    res.json(main?.value ?? {});
  } catch {
    res.status(500).json({ ok: false, error: "Failed to load settings" });
  }
});

router.put("/admin/settings", authMiddleware, async (req, res) => {
  const body = req.body as Record<string, unknown>;
  if (!body || typeof body !== "object") {
    res.status(400).json({ ok: false, error: "Invalid body" });
    return;
  }
  try {
    await db
      .insert(settingsTable)
      .values({ key: "main", value: body, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: settingsTable.key,
        set: { value: body, updatedAt: new Date() },
      });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to save settings" });
  }
});

// ── Newsletter Subscribers ────────────────────────────────────────────────

router.get("/admin/subscribers", authMiddleware, async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(newsletterSubscribersTable)
      .orderBy(desc(newsletterSubscribersTable.createdAt));
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch subscribers" });
  }
});

router.delete("/admin/subscribers/:id", authMiddleware, async (req, res) => {
  try {
    await db
      .delete(newsletterSubscribersTable)
      .where(eq(newsletterSubscribersTable.id, req.params["id"]!));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete subscriber" });
  }
});

// ── Email / SMTP Status ───────────────────────────────────────────────────

router.get("/admin/mail-status", authMiddleware, (_req, res) => {
  const configured = !!(process.env["SMTP_HOST"] && process.env["SMTP_USER"] && process.env["SMTP_PASS"]);
  res.json({
    configured,
    smtp_host: process.env["SMTP_HOST"] ?? null,
    smtp_user: process.env["SMTP_USER"] ?? null,
    smtp_from: process.env["SMTP_FROM"] ?? null,
  });
});

export default router;
