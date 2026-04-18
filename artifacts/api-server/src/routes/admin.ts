import { Router } from "express";
import { db } from "@workspace/db";
import { settingsTable, newsletterSubscribersTable, mediaTable } from "@workspace/db/schema";
import { authMiddleware, getAdminToken } from "../lib/auth";
import { desc, eq } from "drizzle-orm";
import { ObjectStorageService } from "../lib/objectStorage";

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
    // Never cache settings — admin changes must reflect immediately on the public site
    res.setHeader("Cache-Control", "no-store");
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

// ── Media Library ─────────────────────────────────────────────────────────

const objectStorageService = new ObjectStorageService();

// Track pending upload tokens: uuid → expiry timestamp (ms)
// Tokens are issued by request-url (authenticated) and consumed on PUT.
const pendingUploads = new Map<string, number>();
const UPLOAD_TOKEN_TTL_MS = 5 * 60 * 1000; // 5 minutes

function isValidUploadToken(uuid: string): boolean {
  const expiry = pendingUploads.get(uuid);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    pendingUploads.delete(uuid);
    return false;
  }
  return true;
}

router.post("/admin/storage/request-url", authMiddleware, async (req, res) => {
  const { name, size, contentType } = req.body as { name: string; size: number; contentType: string };
  if (!name || !size || !contentType) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    // Extract the uuid from the upload URL and register it as a valid token
    const uuidMatch = uploadURL.match(/\/upload\/([a-f0-9-]+)$/);
    if (uuidMatch) {
      pendingUploads.set(uuidMatch[1], Date.now() + UPLOAD_TOKEN_TTL_MS);
    }
    const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
    res.json({ uploadURL, objectPath, metadata: { name, size, contentType } });
  } catch {
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

/**
 * PUT /admin/storage/upload/:uuid
 *
 * Unified upload endpoint for both R2 and local-disk modes.
 * Auth: the uuid was issued by request-url (which requires auth), so it acts
 * as a one-time upload token — no Bearer header required on the PUT itself.
 * This avoids XHR header issues and browser-to-R2 CORS problems.
 */
router.put("/admin/storage/upload/:uuid", async (req, res) => {
  const { uuid } = req.params as { uuid: string };
  if (!uuid || uuid.includes("..") || uuid.includes("/")) {
    res.status(400).json({ error: "Invalid upload id" });
    return;
  }
  if (!isValidUploadToken(uuid)) {
    res.status(401).json({ error: "Upload token invalid or expired" });
    return;
  }
  // Consume the token (one-time use)
  pendingUploads.delete(uuid);

  const contentType = req.headers["content-type"] ?? "application/octet-stream";
  const contentLength = req.headers["content-length"]
    ? Number(req.headers["content-length"])
    : undefined;

  try {
    await objectStorageService.uploadStream(uuid, req, contentType, contentLength);
    res.status(200).json({ ok: true });
  } catch (err) {
    req.log?.error({ err }, "Upload error");
    if (!res.headersSent) res.status(500).json({ error: "Upload failed" });
  }
});

router.post("/admin/media", authMiddleware, async (req, res) => {
  const { name, objectPath, contentType, size } = req.body as {
    name: string;
    objectPath: string;
    contentType: string;
    size: number;
  };
  if (!name || !objectPath || !contentType || !size) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    const [row] = await db.insert(mediaTable).values({ name, objectPath, contentType, size }).returning();
    res.json(row);
  } catch {
    res.status(500).json({ error: "Failed to record media" });
  }
});

router.get("/admin/media", authMiddleware, async (_req, res) => {
  try {
    const rows = await db.select().from(mediaTable).orderBy(desc(mediaTable.createdAt));
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

router.delete("/admin/media/:id", authMiddleware, async (req, res) => {
  try {
    await db.delete(mediaTable).where(eq(mediaTable.id, parseInt(req.params["id"]!)));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete media" });
  }
});

export default router;
