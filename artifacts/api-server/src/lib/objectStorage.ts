import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { Readable } from "stream";

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

function getR2Config() {
  const accountId = process.env["R2_ACCOUNT_ID"];
  const accessKeyId = process.env["R2_ACCESS_KEY_ID"];
  const secretAccessKey = process.env["R2_SECRET_ACCESS_KEY"];
  const bucketName = process.env["R2_BUCKET_NAME"];

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error(
      "Cloudflare R2 not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, " +
        "R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME environment variables."
    );
  }

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

export class ObjectStorageService {
  getBucketName(): string {
    return getR2Config().bucketName;
  }

  getPublicBaseUrl(): string | null {
    return process.env["R2_PUBLIC_URL"] ?? null;
  }

  /**
   * Generate a presigned PUT URL for direct browser → R2 upload.
   * Returns the presigned URL; the object key is embedded in the URL path.
   */
  async getObjectEntityUploadURL(): Promise<string> {
    const { bucketName } = getR2Config();
    const key = `uploads/${randomUUID()}`;
    const client = createR2Client();

    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    // We need a PUT presigned URL — use the put command from s3-request-presigner
    const { PutObjectCommand } = await import("@aws-sdk/client-s3");
    const putCommand = new PutObjectCommand({ Bucket: bucketName, Key: key });
    const signedUrl = await getSignedUrl(client, putCommand, { expiresIn: 900 });
    return signedUrl;
  }

  /**
   * Convert a R2 presigned PUT URL back to an internal `/objects/{key}` path
   * stored in the database.
   */
  normalizeObjectEntityPath(uploadUrl: string): string {
    if (uploadUrl.startsWith("/objects/")) {
      return uploadUrl;
    }

    try {
      const url = new URL(uploadUrl);
      // R2 presigned URL pathname: /{bucket}/{key}?X-Amz-...
      // Strip leading slash, then strip bucket prefix
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
   * Resolve an internal `/objects/{key}` path to an R2ObjectRef.
   */
  async getObjectEntityFile(objectPath: string): Promise<R2ObjectRef> {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }

    const key = objectPath.slice("/objects/".length);
    if (!key) throw new ObjectNotFoundError();

    const { bucketName } = getR2Config();
    const client = createR2Client();

    // Check the object exists
    try {
      const { HeadObjectCommand } = await import("@aws-sdk/client-s3");
      await client.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }));
    } catch {
      throw new ObjectNotFoundError();
    }

    return { key, bucket: bucketName };
  }

  /**
   * Stream an R2 object as a web Response (for proxying to the client).
   */
  async downloadObject(obj: R2ObjectRef, cacheTtlSec: number = 3600): Promise<Response> {
    const client = createR2Client();
    const command = new GetObjectCommand({ Bucket: obj.bucket, Key: obj.key });
    const r2Response = await client.send(command);

    const contentType = r2Response.ContentType ?? "application/octet-stream";
    const contentLength = r2Response.ContentLength;

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": `public, max-age=${cacheTtlSec}`,
    };
    if (contentLength) {
      headers["Content-Length"] = String(contentLength);
    }

    const nodeStream = r2Response.Body as NodeJS.ReadableStream;
    const webStream = Readable.toWeb(nodeStream as Readable) as ReadableStream;

    return new Response(webStream, { headers });
  }

  /**
   * Delete an object from R2 by its internal path.
   */
  async deleteObject(objectPath: string): Promise<void> {
    if (!objectPath.startsWith("/objects/")) return;
    const key = objectPath.slice("/objects/".length);
    if (!key) return;

    const { bucketName } = getR2Config();
    const client = createR2Client();
    await client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
  }

  /**
   * Get a public URL if R2_PUBLIC_URL is configured, otherwise null.
   */
  getPublicUrl(objectPath: string): string | null {
    const base = this.getPublicBaseUrl();
    if (!base) return null;
    const key = objectPath.startsWith("/objects/")
      ? objectPath.slice("/objects/".length)
      : objectPath;
    return `${base.replace(/\/$/, "")}/${key}`;
  }

  // ── Legacy stubs kept for route compatibility ──────────────────────────

  async searchPublicObject(filePath: string): Promise<R2ObjectRef | null> {
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
