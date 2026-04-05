import { createHash } from "crypto";
import type { Request, Response, NextFunction } from "express";

export function getAdminToken(): string {
  const password = process.env["ADMIN_PASSWORD"] ?? "aetherank2026";
  return createHash("sha256").update(password).digest("hex");
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers["authorization"] ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token !== getAdminToken()) {
    res.status(401).json({ ok: false, error: "Unauthorized" });
    return;
  }
  next();
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0]!.trim();
  return req.socket.remoteAddress ?? "unknown";
}
