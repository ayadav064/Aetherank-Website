import { Router, type IRouter, type Request, type Response } from "express";
import { Readable } from "stream";
import { existsSync, createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { db } from "@workspace/db";
import { mediaTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { ObjectStorageService, ObjectNotFoundError, getUploadDir } from "../lib/objectStorage";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

/**
 * GET /storage/public-objects/*
 *
 * Serve public assets from R2 bucket root (R2 mode only).
 */
router.get("/storage/public-objects/*filePath", async (req: Request, res: Response) => {
  if (!ObjectStorageService.isR2Mode()) {
    res.status(404).json({ error: "Not configured" });
    return;
  }
  try {
    const raw = req.params.filePath;
    const filePath = Array.isArray(raw) ? raw.join("/") : raw;
    const obj = await objectStorageService.searchPublicObject(filePath);
    if (!obj) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    const response = await objectStorageService.downloadObject(obj);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    req.log.error({ err: error }, "Error serving public object");
    res.status(500).json({ error: "Failed to serve public object" });
  }
});

/**
 * GET /storage/objects/*
 *
 * Serve uploaded media objects.
 *
 * R2 mode  → proxy / redirect to Cloudflare.
 * Local mode → serve the file directly from the uploads/ folder on disk,
 *              looking up content-type from the media table.
 */
router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;

    // ── Local storage mode ──────────────────────────────────────────────────
    if (!ObjectStorageService.isR2Mode()) {
      const uuid = path.basename(wildcardPath);
      const filePath = path.join(getUploadDir(), uuid);

      if (!existsSync(filePath)) {
        res.status(404).json({ error: "File not found" });
        return;
      }

      // Look up content-type from the media table (best-effort)
      let contentType = "application/octet-stream";
      try {
        const rows = await db
          .select({ contentType: mediaTable.contentType })
          .from(mediaTable)
          .where(eq(mediaTable.objectPath, objectPath))
          .limit(1);
        if (rows[0]?.contentType) contentType = rows[0].contentType;
      } catch {
        // Fallback to generic type — still serves the file
      }

      const fileStat = await stat(filePath);
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Length", String(fileStat.size));
      res.setHeader("Cache-Control", "public, max-age=3600");
      createReadStream(filePath).pipe(res);
      return;
    }

    // ── R2 mode ─────────────────────────────────────────────────────────────
    const obj = await objectStorageService.getObjectEntityFile(objectPath);

    // If a public R2 URL is configured, redirect instead of proxying
    const publicUrl = objectStorageService.getPublicUrl(objectPath);
    if (publicUrl) {
      res.redirect(302, publicUrl);
      return;
    }

    const response = await objectStorageService.downloadObject(obj);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      req.log.warn({ err: error }, "Object not found");
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error }, "Error serving object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

export default router;
