import { useState, useEffect, useRef, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import { getToken } from "@/lib/cmsApi";
import { Image, Upload, Trash2, Copy, Check, AlertCircle, Loader2, X, Plus } from "lucide-react";

interface MediaItem {
  id: number;
  name: string;
  objectPath: string;
  contentType: string;
  size: number;
  createdAt: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getObjectUrl(objectPath: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const clean = objectPath.replace(/^\/objects\//, "");
  return `${base}/api/storage/objects/${clean}`;
}

interface UploadState {
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  error?: string;
}

export default function AdminMediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = getToken();

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/admin/media`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch media");
      setMedia(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  async function uploadFile(file: File, idx: number) {
    setUploads((prev) =>
      prev.map((u, i) => (i === idx ? { ...u, status: "uploading", progress: 0 } : u)),
    );

    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const urlRes = await fetch(`${base}/api/admin/storage/request-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!urlRes.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await urlRes.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadURL);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setUploads((prev) =>
              prev.map((u, i) => (i === idx ? { ...u, progress: pct } : u)),
            );
          }
        };
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`)));
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(file);
      });

      const recordRes = await fetch(`${base}/api/admin/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: file.name, objectPath, contentType: file.type, size: file.size }),
      });
      if (!recordRes.ok) throw new Error("Failed to record media");

      setUploads((prev) =>
        prev.map((u, i) => (i === idx ? { ...u, status: "done", progress: 100 } : u)),
      );
      await fetchMedia();
    } catch (e: unknown) {
      setUploads((prev) =>
        prev.map((u, i) =>
          i === idx ? { ...u, status: "error", error: e instanceof Error ? e.message : "Upload failed" } : u,
        ),
      );
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const accepted = Array.from(files).filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/") || f.type === "application/pdf");
    const newUploads: UploadState[] = accepted.map((file) => ({
      file,
      status: "pending",
      progress: 0,
    }));
    const startIdx = uploads.length;
    setUploads((prev) => [...prev, ...newUploads]);
    newUploads.forEach((_, i) => uploadFile(accepted[i], startIdx + i));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  async function handleDelete(id: number) {
    setDeleteId(id);
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      await fetch(`${base}/api/admin/media/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedia((prev) => prev.filter((m) => m.id !== id));
    } finally {
      setDeleteId(null);
    }
  }

  function copyUrl(item: MediaItem) {
    const url = window.location.origin + getObjectUrl(item.objectPath);
    navigator.clipboard.writeText(url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const images = media.filter((m) => m.contentType.startsWith("image/"));
  const others = media.filter((m) => !m.contentType.startsWith("image/"));

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
            <p className="text-slate-500 text-sm mt-0.5">{media.length} file{media.length !== 1 ? "s" : ""} stored</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Upload Files
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 cursor-pointer transition-colors ${
            isDragging
              ? "border-emerald-500 bg-emerald-50"
              : "border-slate-200 hover:border-emerald-400 hover:bg-slate-50"
          }`}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-medium text-slate-600">Drop files here or click to browse</p>
          <p className="text-xs text-slate-400 mt-1">Images, videos, PDFs — max 50 MB each</p>
        </div>

        {/* Upload Progress */}
        {uploads.length > 0 && (
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-700">Uploads</h2>
              <button
                onClick={() => setUploads((prev) => prev.filter((u) => u.status !== "done"))}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear done
              </button>
            </div>
            {uploads.map((u, i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0">
                  {u.status === "uploading" && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
                  {u.status === "done" && <Check className="w-4 h-4 text-emerald-500" />}
                  {u.status === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}
                  {u.status === "pending" && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 truncate">{u.file.name}</p>
                  {u.status === "error" && <p className="text-xs text-red-500">{u.error}</p>}
                  {u.status === "uploading" && (
                    <div className="mt-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${u.progress}%` }}
                      />
                    </div>
                  )}
                  {u.status === "done" && <p className="text-xs text-emerald-600">Upload complete</p>}
                </div>
                {u.status !== "uploading" && (
                  <button
                    onClick={() => setUploads((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading media...
          </div>
        )}

        {/* Images Grid */}
        {!loading && images.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Images ({images.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {images.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-slate-50 overflow-hidden">
                    <img
                      src={getObjectUrl(item.objectPath)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-slate-700 truncate font-medium">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatBytes(item.size)}</p>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => copyUrl(item)}
                      title="Copy URL"
                      className="p-2 bg-white rounded-lg shadow hover:bg-emerald-50 transition-colors"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-700" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete"
                      disabled={deleteId === item.id}
                      className="p-2 bg-white rounded-lg shadow hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {deleteId === item.id ? (
                        <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-red-500" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Files List */}
        {!loading && others.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Other Files ({others.length})
            </h2>
            <div className="space-y-2">
              {others.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Image className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 font-medium truncate">{item.name}</p>
                    <p className="text-xs text-slate-400">{formatBytes(item.size)} · {item.contentType}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyUrl(item)}
                      title="Copy URL"
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete"
                      disabled={deleteId === item.id}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {deleteId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && media.length === 0 && uploads.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-slate-500">No media yet</p>
            <p className="text-sm mt-1">Upload images, videos, or PDFs to get started</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
