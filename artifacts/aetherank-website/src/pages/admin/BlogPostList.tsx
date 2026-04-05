import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "wouter";
import {
  fetchBlogPosts,
  deleteBlogPost,
  reorderBlogPosts,
  getToken,
  type BlogPost,
} from "@/lib/cmsApi";
import AdminLayout from "./AdminLayout";
import {
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  FileText,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  GripVertical,
  ArrowUpDown,
  X,
  Save,
} from "lucide-react";

type Filter = "all" | "published" | "draft";

export default function BlogPostList() {
  const [, navigate] = useLocation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const [reorderMode, setReorderMode] = useState(false);
  const [reorderPosts, setReorderPosts] = useState<BlogPost[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const dragIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!getToken()) { navigate("/admin"); return; }
    fetchBlogPosts().then((p) => { setPosts(p); setLoading(false); });
  }, [navigate]);

  function enterReorderMode() {
    setReorderPosts([...posts]);
    setReorderMode(true);
    setSaveMsg("");
  }

  function cancelReorder() {
    setReorderMode(false);
    setReorderPosts([]);
    setDragOverIndex(null);
    dragIndex.current = null;
  }

  async function saveReorder() {
    setSaving(true);
    setSaveMsg("");
    try {
      await reorderBlogPosts(reorderPosts.map((p) => p.id));
      setPosts(reorderPosts);
      setSaveMsg("Order saved!");
      setTimeout(() => {
        setReorderMode(false);
        setSaveMsg("");
      }, 1200);
    } catch {
      setSaveMsg("Failed to save order. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  }

  function handleDrop(dropIndex: number) {
    const from = dragIndex.current;
    if (from === null || from === dropIndex) {
      setDragOverIndex(null);
      return;
    }
    const arr = [...reorderPosts];
    const [item] = arr.splice(from, 1);
    arr.splice(dropIndex, 0, item!);
    setReorderPosts(arr);
    dragIndex.current = null;
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    dragIndex.current = null;
    setDragOverIndex(null);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteBlogPost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setMsg("Post deleted.");
      setTimeout(() => setMsg(""), 3000);
    } catch {
      alert("Failed to delete post.");
    } finally {
      setDeleting(null);
    }
  }

  const filtered = posts.filter((p) => {
    const matchFilter = filter === "all" || p.status === filter;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const allCount = posts.length;
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  return (
    <AdminLayout>
      <div className="bg-[#f0f0f1] min-h-full">
        {/* Page header */}
        <div className="bg-white border-b border-[#c3c4c7] px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[#1d2327] text-xl font-semibold flex items-center gap-2 shrink-0">
              <FileText className="w-5 h-5 text-slate-400" />
              {reorderMode ? "Reorder Posts" : "Posts"}
            </h1>
            {msg && !reorderMode && (
              <span className="flex items-center gap-1 text-emerald-600 text-sm">
                <CheckCircle2 className="w-4 h-4" /> {msg}
              </span>
            )}
            {saveMsg && reorderMode && (
              <span className={`flex items-center gap-1 text-sm ${saveMsg.startsWith("Failed") ? "text-red-600" : "text-emerald-600"}`}>
                {saveMsg.startsWith("Failed") ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                {saveMsg}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {reorderMode ? (
              <>
                <button
                  onClick={cancelReorder}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-[#646970] hover:text-[#1d2327] border border-[#c3c4c7] bg-white px-3 py-1.5 rounded text-sm transition-colors disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button
                  onClick={saveReorder}
                  disabled={saving}
                  className="flex items-center gap-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white font-medium px-4 py-1.5 rounded text-sm transition-colors disabled:opacity-70"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Order
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={enterReorderMode}
                  disabled={loading || posts.length < 2}
                  className="flex items-center gap-1.5 text-[#646970] hover:text-[#1d2327] border border-[#c3c4c7] bg-white px-3 py-1.5 rounded text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Drag to reorder posts"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" /> Reorder
                </button>
                <Link href="/admin/blog/new">
                  <button className="flex items-center gap-2 bg-[#2271b1] hover:bg-[#135e96] text-white font-medium px-4 py-1.5 rounded text-sm transition-colors">
                    <Plus className="w-4 h-4" /> Add New Post
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Reorder mode hint */}
          {reorderMode && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-2.5 rounded mb-4">
              <GripVertical className="w-4 h-4 shrink-0" />
              Drag the <strong>grip handle</strong> on each row to rearrange posts. Click <strong>Save Order</strong> when done.
            </div>
          )}

          {/* Filter tabs + search (hidden in reorder mode) */}
          {!reorderMode && (
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-1 text-sm">
                {(
                  [
                    { key: "all", label: "All", count: allCount },
                    { key: "published", label: "Published", count: publishedCount },
                    { key: "draft", label: "Drafts", count: draftCount },
                  ] as { key: Filter; label: string; count: number }[]
                ).map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      filter === key
                        ? "text-[#1d2327] font-semibold"
                        : "text-[#2271b1] hover:text-[#1d2327]"
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#a7aaad]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search posts…"
                  className="pl-8 pr-3 py-1.5 text-sm border border-[#8c8f94] rounded bg-white text-[#1d2327] placeholder-[#a7aaad] focus:outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] transition-shadow w-48"
                />
              </div>
            </div>
          )}

          {/* Posts table */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-[#646970]">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading posts…
              </div>
            ) : reorderMode ? (
              /* ── REORDER TABLE ── */
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f0f0f1] bg-[#f6f7f7]">
                    <th className="w-10 px-3 py-2.5" />
                    <th className="text-left text-[#646970] text-xs font-medium px-4 py-2.5">Title</th>
                    <th className="text-left text-[#646970] text-xs font-medium px-4 py-2.5 hidden md:table-cell">Category</th>
                    <th className="text-center text-[#646970] text-xs font-medium px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f1]">
                  {reorderPosts.map((post, i) => (
                    <tr
                      key={post.id}
                      draggable
                      onDragStart={() => handleDragStart(i)}
                      onDragOver={(e) => handleDragOver(e, i)}
                      onDrop={() => handleDrop(i)}
                      onDragEnd={handleDragEnd}
                      className={`transition-colors select-none ${
                        dragIndex.current === i
                          ? "opacity-40 bg-blue-50"
                          : dragOverIndex === i
                          ? "bg-blue-50 border-t-2 border-blue-400"
                          : "hover:bg-[#f6f7f7]"
                      }`}
                    >
                      <td className="px-3 py-3">
                        <div className="cursor-grab active:cursor-grabbing text-[#a7aaad] hover:text-[#646970] flex items-center justify-center">
                          <GripVertical className="w-4 h-4" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#f0f0f1] text-[#646970] text-xs flex items-center justify-center font-medium shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-[#1d2327] font-medium text-sm">
                            {post.title || <em className="text-[#a7aaad]">(no title)</em>}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-[#646970] text-sm">{post.category || "—"}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            post.status === "published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-[#f0f0f1] text-[#646970] border border-[#c3c4c7]"
                          }`}
                        >
                          {post.status === "published" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {post.status === "published" ? "Published" : "Draft"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-10 h-10 text-[#c3c4c7] mx-auto mb-3" />
                <p className="text-[#646970] text-sm mb-4">
                  {search || filter !== "all" ? "No posts match your filters." : "No posts yet."}
                </p>
                <Link href="/admin/blog/new">
                  <button className="flex items-center gap-2 bg-[#2271b1] hover:bg-[#135e96] text-white font-medium px-4 py-2 rounded text-sm transition-colors mx-auto">
                    <Plus className="w-4 h-4" /> Write your first post
                  </button>
                </Link>
              </div>
            ) : (
              /* ── NORMAL TABLE ── */
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f0f0f1] bg-[#f6f7f7]">
                    <th className="text-left text-[#646970] text-xs font-medium px-4 py-2.5">Title</th>
                    <th className="text-left text-[#646970] text-xs font-medium px-4 py-2.5 hidden md:table-cell">Author</th>
                    <th className="text-left text-[#646970] text-xs font-medium px-4 py-2.5 hidden lg:table-cell">Category</th>
                    <th className="text-center text-[#646970] text-xs font-medium px-4 py-2.5">Status</th>
                    <th className="text-left text-[#646970] text-xs font-medium px-4 py-2.5 hidden sm:table-cell">Date</th>
                    <th className="text-center text-[#646970] text-xs font-medium px-4 py-2.5">SEO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f1]">
                  {filtered.map((post) => (
                    <tr key={post.id} className="hover:bg-[#f6f7f7] transition-colors group">
                      <td className="px-4 py-3">
                        <div>
                          <Link href={`/admin/blog/edit/${post.id}`}>
                            <span className="text-[#1d2327] font-medium text-sm hover:text-emerald-700 transition-colors cursor-pointer">
                              {post.title || <em className="text-[#a7aaad]">(no title)</em>}
                            </span>
                          </Link>
                          <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/admin/blog/edit/${post.id}`}>
                              <span className="text-[#2271b1] text-xs hover:text-[#135e96] cursor-pointer flex items-center gap-0.5">
                                <Edit3 className="w-3 h-3" /> Edit
                              </span>
                            </Link>
                            <span className="text-[#c3c4c7]">|</span>
                            <button
                              onClick={() => handleDelete(post.id, post.title)}
                              disabled={deleting === post.id}
                              className="text-red-500 text-xs hover:text-red-700 flex items-center gap-0.5 disabled:opacity-50"
                            >
                              {deleting === post.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                              Trash
                            </button>
                            {post.status === "published" && post.slug && (
                              <>
                                <span className="text-[#c3c4c7]">|</span>
                                <a
                                  href={`/blog/${post.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#646970] text-xs hover:text-[#1d2327] flex items-center gap-0.5"
                                >
                                  <ExternalLink className="w-3 h-3" /> View
                                </a>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-[#646970] text-sm">{post.author || "—"}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-[#646970] text-sm">{post.category || "—"}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            post.status === "published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-[#f0f0f1] text-[#646970] border border-[#c3c4c7]"
                          }`}
                        >
                          {post.status === "published" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {post.status === "published" ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-[#646970] text-xs">{post.date || "—"}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5" title="Title / Description / Keywords">
                          <div className={`w-2 h-2 rounded-full ${post.seo?.title ? "bg-emerald-400" : "bg-[#dcdcde]"}`} />
                          <div className={`w-2 h-2 rounded-full ${post.seo?.description ? "bg-emerald-400" : "bg-[#dcdcde]"}`} />
                          <div className={`w-2 h-2 rounded-full ${post.seo?.keywords ? "bg-emerald-400" : "bg-[#dcdcde]"}`} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
