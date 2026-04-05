import { Router } from "express";
import { randomUUID } from "crypto";
import { db } from "@workspace/db";
import { submissionsTable } from "@workspace/db/schema";
import { eq, desc, count, sql } from "drizzle-orm";
import { authMiddleware, getClientIp } from "../lib/auth";
import { sendMail, buildSubmissionEmail } from "../lib/mailer";

const router = Router();

// ── Rate limiter (in-memory, per IP) ─────────────────────────────────────

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string, type: string): boolean {
  const key = `${ip}:${type}`;
  const now = Date.now();
  const timestamps = (rateLimitMap.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  rateLimitMap.set(key, timestamps);
  return false;
}

// ── Validation helpers ────────────────────────────────────────────────────

function sanitize(val: unknown): string {
  return typeof val === "string" ? val.trim().slice(0, 5000) : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^[+\d\s\-().]{7,20}$/.test(phone);
}

interface FieldErrors { [field: string]: string }

function validateContact(data: Record<string, unknown>): FieldErrors {
  const errors: FieldErrors = {};
  const name = sanitize(data["name"]);
  if (!name) errors["name"] = "Full name is required.";
  else if (name.length < 2) errors["name"] = "Name must be at least 2 characters.";
  else if (name.length > 100) errors["name"] = "Name is too long.";
  const email = sanitize(data["email"]);
  if (!email) errors["email"] = "Email address is required.";
  else if (!isValidEmail(email)) errors["email"] = "Please enter a valid email address.";
  const phone = sanitize(data["phone"]);
  if (phone && !isValidPhone(phone)) errors["phone"] = "Please enter a valid phone number.";
  const message = sanitize(data["message"]);
  if (!message) errors["message"] = "Message is required.";
  else if (message.length < 3) errors["message"] = "Message must be at least 3 characters.";
  else if (message.length > 3000) errors["message"] = "Message is too long (max 3000 characters).";
  return errors;
}

function validateAudit(data: Record<string, unknown>): FieldErrors {
  const errors: FieldErrors = {};
  const name = sanitize(data["name"]);
  if (!name) errors["name"] = "Full name is required.";
  else if (name.length < 2) errors["name"] = "Name must be at least 2 characters.";
  const email = sanitize(data["email"]);
  if (!email) errors["email"] = "Email address is required.";
  else if (!isValidEmail(email)) errors["email"] = "Please enter a valid email address.";
  const website = sanitize(data["website"]);
  if (!website) errors["website"] = "Website URL is required.";
  else if (!/^https?:\/\/.+\..+/.test(website)) errors["website"] = "Please enter a valid URL (include http:// or https://).";
  const phone = sanitize(data["phone"]);
  if (phone && !isValidPhone(phone)) errors["phone"] = "Please enter a valid phone number.";
  return errors;
}

function validateProposal(data: Record<string, unknown>): FieldErrors {
  const errors: FieldErrors = {};
  const name = sanitize(data["name"]);
  if (!name) errors["name"] = "Full name is required.";
  const email = sanitize(data["email"]);
  if (!email) errors["email"] = "Email address is required.";
  else if (!isValidEmail(email)) errors["email"] = "Please enter a valid email address.";
  const website = sanitize(data["website"]);
  if (!website) errors["website"] = "Website URL is required.";
  else if (!/^https?:\/\/.+\..+/.test(website)) errors["website"] = "Please enter a valid URL.";
  const phone = sanitize(data["phone"]);
  if (phone && !isValidPhone(phone)) errors["phone"] = "Please enter a valid phone number.";
  const services = data["services"];
  if (!Array.isArray(services) || services.length === 0)
    errors["services"] = "Please select at least one service.";
  return errors;
}

// ── POST /api/submissions ─ public, rate-limited ─────────────────────────

router.post("/submissions", async (req, res) => {
  const body = req.body as Record<string, unknown>;
  const type = sanitize(body["type"]);

  if (!["contact", "audit", "proposal"].includes(type)) {
    res.status(400).json({ ok: false, error: "Invalid submission type." });
    return;
  }

  // Honeypot
  if (sanitize(body["_hp"]) !== "") {
    res.json({ ok: true, id: "bot" });
    return;
  }

  // Rate limit
  const ip = getClientIp(req);
  if (isRateLimited(ip, type)) {
    res.status(429).json({ ok: false, error: "Too many submissions. Please wait a few minutes." });
    return;
  }

  // Validate
  const { type: _t, _hp: _h, ...rawData } = body;
  let fieldErrors: FieldErrors = {};
  if (type === "contact") fieldErrors = validateContact(rawData);
  else if (type === "audit") fieldErrors = validateAudit(rawData);
  else if (type === "proposal") fieldErrors = validateProposal(rawData);

  if (Object.keys(fieldErrors).length > 0) {
    res.status(422).json({ ok: false, errors: fieldErrors });
    return;
  }

  // Sanitize all string fields
  const cleanData: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rawData)) {
    cleanData[k] = typeof v === "string" ? sanitize(v) : v;
  }

  try {
    const [submission] = await db
      .insert(submissionsTable)
      .values({
        id: randomUUID(),
        type: type as "contact" | "audit" | "proposal",
        data: cleanData,
        read: false,
        ip,
        createdAt: new Date(),
      })
      .returning();

    // Send email notification (non-blocking)
    const adminEmail = process.env["ADMIN_EMAIL"] ?? process.env["SMTP_USER"];
    if (adminEmail) {
      void sendMail({
        to: adminEmail,
        subject: `[Aetherank] New ${type} submission from ${sanitize(rawData["name"])}`,
        html: buildSubmissionEmail(type, cleanData),
      });
    }

    res.json({ ok: true, id: submission!.id });
  } catch {
    res.status(500).json({ ok: false, error: "Failed to save submission. Please try again." });
  }
});

// ── GET /api/admin/submissions ─ all ─────────────────────────────────────

router.get("/admin/submissions", authMiddleware, async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(submissionsTable)
      .orderBy(desc(submissionsTable.createdAt));
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// ── GET /api/admin/submissions/unread-count ───────────────────────────────

router.get("/admin/submissions/unread-count", authMiddleware, async (_req, res) => {
  try {
    const [row] = await db
      .select({ count: count() })
      .from(submissionsTable)
      .where(eq(submissionsTable.read, false));
    res.json({ count: row?.count ?? 0 });
  } catch {
    res.status(500).json({ count: 0 });
  }
});

// ── PATCH /api/admin/submissions/:id/read ────────────────────────────────

router.patch("/admin/submissions/:id/read", authMiddleware, async (req, res) => {
  try {
    const [updated] = await db
      .update(submissionsTable)
      .set({ read: true })
      .where(eq(submissionsTable.id, req.params["id"]!))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Submission not found" });
      return;
    }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to update submission" });
  }
});

// ── DELETE /api/admin/submissions/:id ────────────────────────────────────

router.delete("/admin/submissions/:id", authMiddleware, async (req, res) => {
  try {
    await db.delete(submissionsTable).where(eq(submissionsTable.id, req.params["id"]!));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete submission" });
  }
});

export default router;
