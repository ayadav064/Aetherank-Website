import { Router } from "express";
import { randomUUID } from "crypto";
import { db } from "@workspace/db";
import { newsletterSubscribersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { getClientIp } from "../lib/auth";

const router = Router();

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip: string): boolean {
  const key = `newsletter:${ip}`;
  const now = Date.now();
  const timestamps = (rateLimitMap.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  rateLimitMap.set(key, timestamps);
  return false;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

router.post("/newsletter/subscribe", async (req, res) => {
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    res.status(429).json({ error: "Too many requests. Please try again later." });
    return;
  }

  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";

  if (!email) {
    res.status(400).json({ error: "Email address is required." });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }

  try {
    const existing = await db
      .select()
      .from(newsletterSubscribersTable)
      .where(eq(newsletterSubscribersTable.email, email))
      .limit(1);

    if (existing.length > 0) {
      res.status(200).json({ success: true, message: "You're already subscribed!" });
      return;
    }

    await db.insert(newsletterSubscribersTable).values({
      id: randomUUID(),
      email,
      ip,
      active: true,
    });

    res.status(201).json({ success: true, message: "You've been subscribed successfully!" });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
