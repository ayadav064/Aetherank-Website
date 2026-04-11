import { randomUUID } from "crypto";
import { Readable } from "stream";
import { existsSync, mkdirSync, createReadStream, unlinkSync } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export interface R2ObjectRef {
  key: string;
  bucket: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isR2Configured(): boolean {
  return !!(
    process.env["R2_ACCOUNT_ID"] &&
    process.env["R2_ACCESS_KEY_ID"] &&
    process.env["R2_SECRET_ACCESS_KEY"] &&
    process.env["R2_BUCKET_NAME"]
  );
}

export function getUploadDir(): string {
  const dir =
    process.env["UPLOAD_DIR"] ??
    path.resolve(process.cwd(), "uploads");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

// ── R2 helpers ────────────────────────────────────────────────────────────────

function getR2Config() {
  const accountId = process.env["R2_ACCOUNT_ID"]!;
  const accessKeyId = process.env["R2_ACCESS_KEY_ID"]!;
  const secretAccessKey = process.env["R2_SECRET_ACCESS_KEY"]!;
  const bucketName = process.env["R2_BUCKET_NAME"]!;
  return { accountId, accessKeyId, secretAccessKey, bucketName };
}

function createR2Client() {
  const { accountId, accessKeyId, secretAccessKey } = getR2Config();
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

// ── Service ───────────────────────────────────────────────────────────────────

export class ObjectStorageService {
  /**
   * Returns true when Cloudflare R2 is fully configured via env vars.
   * When false, local disk storage is used automatically.
   */
  static isR2Mode(): boolean {
    return isR2Configured();
  }

  getBucketName(): string {
    return getR2Config().bucketName;
  }

  getPublicBaseUrl(): string | null {
    return process.env["R2_PUBLIC_URL"] ?? null;
  }

  /**
   * Generate an upload URL.
   *
   * Always returns a relative API endpoint `/api/admin/storage/upload/{uuid}`.
   * The Express handler proxies the upload to R2 or disk depending on config.
   * This avoids CORS issues that arise when the browser uploads directly to R2.
   */
  async getObjectEntityUploadURL(): Promise<string> {
    const uuid = randomUUID();
    return `/api/admin/storage/upload/${uuid}`;
  }

  /**
   * Upload a Node.js Readable stream to R2 or disk.
   * Called by the Express upload handler after receiving the request body.
   */
  async uploadStream(
    uuid: string,
    stream: NodeJS.ReadableStream,
    contentType: string,
    contentLength?: number,
  ): Promise<void> {
    if (isR2Configured()) {
      const { bucketName } = getR2Config();
      const key = `uploads/${uuid}`;
      const client = createR2Client();
      const { PutObjectCommand } = await import("@aws-sdk/client-s3");
      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: stream as unknown as ReadableStream,
          ContentType: contentType,
          ...(contentLength ? { ContentLength: contentLength } : {}),
        }),
      );
      return;
    }

    // Local disk
    const uploadDir = getUploadDir();
    const filePath = path.join(uploadDir, uuid);
    const { createWriteStream: cws } = await import("fs");
    const ws = cws(filePath);
    await new Promise<void>((resolve, reject) => {
      stream.pipe(ws);
      ws.on("finish", resolve);
      ws.on("error", reject);
    });
  }

  /**
   * Convert an upload URL to the internal `/objects/{key}` path stored in DB.
   *
   * R2 mode  → parses the presigned URL to extract the object key.
   * Local mode → extracts UUID from `/api/admin/storage/upload/{uuid}`.
   */
  normalizeObjectEntityPath(uploadUrl: string): string {
    if (uploadUrl.startsWith("/objects/")) return uploadUrl;

    // Local mode path
    const localMatch = uploadUrl.match(/\/api\/admin\/storage\/upload\/([^?]+)$/);
    if (localMatch) {
      return `/objects/uploads/${localMatch[1]}`;
    }

    // R2 presigned URL
    try {
      const url = new URL(uploadUrl);
      const { bucketName } = getR2Config();
      let pathname = url.pathname;
      if (pathname.startsWith("/")) pathname = pathname.slice(1);
      if (pathname.startsWith(bucketName + "/")) {
        pathname = pathname.slice(bucketName.length + 1);
      }
      return `/objects/${pathname}`;
    } catch {
      return uploadUrl;
    }
  }

  /**
   * Resolve an internal `/objects/{key}` path to a file reference.
   * Throws ObjectNotFoundError if the file doesn't exist.
   */
  async getObjectEntityFile(objectPath: string): Promise<R2ObjectRef> {
    if (!objectPath.startsWith("/objects/")) throw new ObjectNotFoundError();

    const key = objectPath.slice("/objects/".length);
    if (!key) throw new ObjectNotFoundError();

    if (isR2Configured()) {
      const { bucketName } = getR2Config();
      const client = createR2Client();
      try {
        const { HeadObjectCommand } = await import("@aws-sdk/client-s3");
        await client.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }));
      } catch {
        throw new ObjectNotFoundError();
      }
      return { key, bucket: bucketName };
    }

    // Local mode: the key is `uploads/{uuid}`, file lives at getUploadDir()/{uuid}
    const filename = path.basename(key);
    const filePath = path.join(getUploadDir(), filename);
    if (!existsSync(filePath)) throw new ObjectNotFoundError();
    return { key, bucket: "local" };
  }

  /**
   * Stream an object to the client.
   *
   * R2 mode  → proxies from Cloudflare.
   * Local mode → reads from disk.
   */
  async downloadObject(obj: R2ObjectRef, cacheTtlSec: number = 3600): Promise<Response> {
    if (obj.bucket !== "local") {
      const client = createR2Client();
      const command = new GetObjectCommand({ Bucket: obj.bucket, Key: obj.key });
      const r2Response = await client.send(command);

      const contentType = r2Response.ContentType ?? "application/octet-stream";
      const contentLength = r2Response.ContentLength;
      const headers: Record<string, string> = {
        "Content-Type": contentType,
        "Cache-Control": `public, max-age=${cacheTtlSec}`,
      };
      if (contentLength) headers["Content-Length"] = String(contentLength);

      const nodeStream = r2Response.Body as NodeJS.ReadableStream;
      const webStream = Readable.toWeb(nodeStream as Readable) as ReadableStream;
      return new Response(webStream, { headers });
    }

    // Local disk
    const filename = path.basename(obj.key);
    const filePath = path.join(getUploadDir(), filename);
    if (!existsSync(filePath)) throw new ObjectNotFoundError();

    const fileStat = await stat(filePath);
    const nodeStream = createReadStream(filePath);
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    return new Response(webStream, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": String(fileStat.size),
        "Cache-Control": `public, max-age=${cacheTtlSec}`,
      },
    });
  }

  /**
   * Delete an object.
   */
  async deleteObject(objectPath: string): Promise<void> {
    if (!objectPath.startsWith("/objects/")) return;
    const key = objectPath.slice("/objects/".length);
    if (!key) return;

    if (isR2Configured()) {
      const { bucketName } = getR2Config();
      const client = createR2Client();
      await client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
      return;
    }

    // Local: delete the file
    const filename = path.basename(key);
    const filePath = path.join(getUploadDir(), filename);
    if (existsSync(filePath)) unlinkSync(filePath);
  }

  /**
   * Public URL for an object (only applicable in R2 mode with R2_PUBLIC_URL set).
   * Returns null in local mode (file is served through the API).
   */
  getPublicUrl(objectPath: string): string | null {
    if (!isR2Configured()) return null;
    const base = this.getPublicBaseUrl();
    if (!base) return null;
    const key = objectPath.startsWith("/objects/")
      ? objectPath.slice("/objects/".length)
      : objectPath;
    return `${base.replace(/\/$/, "")}/${key}`;
  }

  // ── Legacy stubs ───────────────────────────────────────────────────────────

  async searchPublicObject(filePath: string): Promise<R2ObjectRef | null> {
    if (!isR2Configured()) return null;
    const { bucketName } = getR2Config();
    const client = createR2Client();
    try {
      const { HeadObjectCommand } = await import("@aws-sdk/client-s3");
      await client.send(new HeadObjectCommand({ Bucket: bucketName, Key: filePath }));
      return { key: filePath, bucket: bucketName };
    } catch {
      return null;
    }
  }
}
