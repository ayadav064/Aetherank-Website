import { Router } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db/schema";
import { authMiddleware, getAdminToken } from "../lib/auth";

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
