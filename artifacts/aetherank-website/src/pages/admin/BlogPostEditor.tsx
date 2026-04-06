import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "wouter";
import {
  fetchBlogPost,
  createBlogPost,
  updateBlogPost,
  getToken,
  type BlogPost,
} from "@/lib/cmsApi";
import AdminLayout from "./AdminLayout";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  Save,
  Loader2,
  ArrowLeft,
  FileText,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

type Tab = "content" | "seo";

const CATEGORIES = [
  "SEO, GEO",
  "PPC",
  "Meta Ads",
  "Google Ads",
  "Social Media",
  "Content Marketing",
  "Web Design",
  "ORM",
  "AI & Marketing",
  "AI Marketing",
  "Local Business",
  "Case Study",
  "General",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function wordCount(html: string) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.split(" ").length : 0;
}

function estimateReadTime(html: string) {
  return `${Math.max(1, Math.round(wordCount(html) / 200))} min read`;
}

const EMPTY_POST: Omit<BlogPost, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "General",
  tags: [],
  author: "Aetherank Team",
  date: new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  image: "",
  status: "draft",
  readTime: "",
  seo: { title: "", description: "", keywords: "", schema: "" },
};

const inputCls =
  "w-full bg-white border border-[#8c8f94] text-[#1d2327] placeholder-[#a7aaad] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] transition-shadow";

export default function BlogPostEditor() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const isNew = !id || id === "new";

  const [tab, setTab] = useState<Tab>("content");
  const [post, setPost] = useState(EMPTY_POST);
  const [tagsInput, setTagsInput] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) { navigate("/admin"); return; }
    if (!isNew && id) {
      fetchBlogPost(id).then((p) => {
        if (p) {
          setPost({
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            content: p.content,
            category: p.category,
            tags: p.tags,
            author: p.author,
            date: p.date,
            image: p.image,
            status: p.status,
            readTime: p.readTime,
            seo: p.seo ?? { title: "", description: "", keywords: "", schema: "" },
          });
          setTagsInput(p.tags?.join(", ") ?? "");
          setSlugEdited(true);
        }
        setLoading(false);
      });
    }
  }, [id, isNew, navigate]);

  function set<K extends keyof typeof post>(key: K, value: (typeof post)[K]) {
    setPost((prev) => ({ ...prev, [key]: value }));
  }

  function setSeo<K extends keyof BlogPost["seo"]>(key: K, value: string) {
    setPost((prev) => ({ ...prev, seo: { ...prev.seo, [key]: value } }));
  }

  function handleTitleChange(value: string) {
    set("title", value);
    if (!slugEdited) set("slug", slugify(value));
  }

  async function handleSave(publish?: boolean) {
    setSaving(true);
    setError("");
    setSavedMsg("");
    try {
      const newStatus =
        publish != null ? (publish ? "published" : "draft") : post.status;
      const payload = {
        ...post,
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        readTime: estimateReadTime(post.content || ""),
        status: newStatus,
      } as Omit<BlogPost, "id" | "createdAt" | "updatedAt">;
      if (publish != null) set("status", newStatus);

      if (isNew) {
        const created = await createBlogPost(payload);
        setSavedMsg("Post created!");
        setTimeout(() => navigate(`/admin/blog/edit/${created.id}`), 800);
      } else {
        await updateBlogPost(id!, payload);
        setSavedMsg("Saved!");
        setTimeout(() => setSavedMsg(""), 3000);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 text-[#2271b1] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const titleLen = post.seo.title.length;
  const descLen = post.seo.description.length;

  return (
    <AdminLayout>
      <div className="bg-[#f0f0f1] min-h-full">
        {/* Page header */}
        <div className="bg-white border-b border-[#c3c4c7] px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin/blog">
              <button className="text-[#2271b1] hover:text-[#135e96] text-sm flex items-center gap-1 shrink-0">
                <ArrowLeft className="w-3.5 h-3.5" /> Posts
              </button>
            </Link>
            <span className="text-[#c3c4c7]">/</span>
            <h1 className="text-[#1d2327] text-base font-semibold truncate">
              {isNew ? "Add New Post" : post.title || "Edit Post"}
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {savedMsg && (
              <span className="text-emerald-600 text-sm flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {savedMsg}
              </span>
            )}
            {error && (
              <span className="text-red-600 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {error}
              </span>
            )}
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-3 py-1.5 text-sm border border-[#8c8f94] text-[#1d2327] rounded hover:bg-[#f6f7f7] transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-2 bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded text-sm transition-colors"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {post.status === "published" ? "Update" : "Publish"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#c3c4c7] bg-white px-6">
          <div className="flex gap-0">
            {(
              [
                { key: "content", label: "Content", icon: FileText },
                { key: "seo", label: "SEO", icon: Search },
              ] as { key: Tab; label: string; icon: React.FC<{ className?: string }> }[]
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  tab === key
                    ? "border-[#2271b1] text-[#2271b1]"
                    : "border-transparent text-[#646970] hover:text-[#1d2327]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 max-w-[1000px]">
          {/* ── Content Tab ── */}
          {tab === "content" && (
            <div className="space-y-4">
              {/* Title + slug */}
              <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
                <div className="p-5 space-y-3">
                  <div>
                    <label className="block text-[#1d2327] text-sm font-medium mb-1">
                      Post Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={post.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter post title…"
                      className="w-full bg-white border border-[#8c8f94] text-[#1d2327] placeholder-[#a7aaad] rounded px-3 py-2.5 text-lg font-medium focus:outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] transition-shadow"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#646970] text-xs">Slug:</span>
                    <span className="text-[#646970] text-xs">/blog/</span>
                    <input
                      type="text"
                      value={post.slug}
                      onChange={(e) => {
                        setSlugEdited(true);
                        set("slug", e.target.value);
                      }}
                      className="text-xs border border-[#c3c4c7] rounded px-2 py-0.5 text-[#1d2327] focus:outline-none focus:border-[#2271b1] flex-1 max-w-xs"
                      placeholder="auto-generated-from-title"
                    />
                  </div>
                </div>
              </div>

              {/* Visual editor */}
              <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
                  <h3 className="text-[#1d2327] text-sm font-semibold">Post Content</h3>
                  <p className="text-[#646970] text-xs mt-0.5">
                    Use the toolbar to format your content — headings, bold, lists, links, images and more.
                  </p>
                </div>
                <div className="p-4">
                  <RichTextEditor
                    value={post.content}
                    onChange={(html) => set("content", html)}
                    placeholder="Start writing your post…"
                    minHeight={420}
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
                  <h3 className="text-[#1d2327] text-sm font-semibold">Excerpt</h3>
                  <p className="text-[#646970] text-xs mt-0.5">
                    Short summary shown in post listings. 1–2 sentences.
                  </p>
                </div>
                <div className="p-4">
                  <textarea
                    value={post.excerpt}
                    onChange={(e) => set("excerpt", e.target.value)}
                    rows={3}
                    placeholder="Write a short excerpt for this post…"
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>

              {/* Cover image */}
              <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
                  <h3 className="text-[#1d2327] text-sm font-semibold">Cover Image</h3>
                </div>
                <div className="p-4 space-y-3">
                  <input
                    type="url"
                    value={post.image}
                    onChange={(e) => set("image", e.target.value)}
                    placeholder="https://images.unsplash.com/…?w=1200&q=80"
                    className={inputCls}
                  />
                  {post.image && (
                    <div className="rounded overflow-hidden border border-[#c3c4c7] max-h-48">
                      <img
                        src={post.image}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Meta fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status */}
                <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
                    <h3 className="text-[#1d2327] text-sm font-semibold">
                      Status & Visibility
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-[#1d2327] text-sm font-medium mb-1">
                        Status
                      </label>
                      <select
                        value={post.status}
                        onChange={(e) =>
                          set("status", e.target.value as "draft" | "published")
                        }
                        className={inputCls}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    {!isNew && post.status === "published" && post.slug && (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[#2271b1] hover:text-[#135e96] text-sm transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" /> View live post
                      </a>
                    )}
                  </div>
                </div>

                {/* Author & Date */}
                <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
                    <h3 className="text-[#1d2327] text-sm font-semibold">
                      Author & Date
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-[#1d2327] text-sm font-medium mb-1">
                        Author
                      </label>
                      <input
                        type="text"
                        value={post.author}
                        onChange={(e) => set("author", e.target.value)}
                        placeholder="Aetherank Team"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-[#1d2327] text-sm font-medium mb-1">
                        Publish Date
                      </label>
                      <input
                        type="text"
                        value={post.date}
                        onChange={(e) => set("date", e.target.value)}
                        placeholder="April 1, 2026"
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
                    <h3 className="text-[#1d2327] text-sm font-semibold">Category</h3>
                  </div>
                  <div className="p-4">
                    <select
                      value={post.category}
                      onChange={(e) => set("category", e.target.value)}
                      className={inputCls}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
                    <h3 className="text-[#1d2327] text-sm font-semibold">Tags</h3>
                  </div>
                  <div className="p-4">
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="seo, google, india (comma-separated)"
                      className={inputCls}
                    />
                    {tagsInput && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {tagsInput
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-[#f0f0f1] text-[#646970] rounded text-xs border border-[#c3c4c7]"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SEO Tab ── */}
          {tab === "seo" && (
            <div className="space-y-4">
              <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
                  <h3 className="text-[#1d2327] text-sm font-semibold">SEO Settings</h3>
                  <p className="text-[#646970] text-xs mt-0.5">
                    Controls how this post appears in Google search results.
                  </p>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[#1d2327] text-sm font-medium">
                        Meta Title
                      </label>
                      <span
                        className={`text-xs ${
                          titleLen > 60
                            ? "text-red-500"
                            : titleLen > 50
                            ? "text-amber-500"
                            : "text-[#646970]"
                        }`}
                      >
                        {titleLen}/60
                      </span>
                    </div>
                    <input
                      type="text"
                      value={post.seo.title}
                      onChange={(e) => setSeo("title", e.target.value)}
                      placeholder={post.title || "Post title for Google…"}
                      className={inputCls}
                    />
                    <p className="text-[#646970] text-xs mt-1">
                      Ideal: 50–60 characters. Leave blank to use post title.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[#1d2327] text-sm font-medium">
                        Meta Description
                      </label>
                      <span
                        className={`text-xs ${
                          descLen > 160
                            ? "text-red-500"
                            : descLen > 140
                            ? "text-amber-500"
                            : "text-[#646970]"
                        }`}
                      >
                        {descLen}/160
                      </span>
                    </div>
                    <textarea
                      value={post.seo.description}
                      onChange={(e) => setSeo("description", e.target.value)}
                      rows={3}
                      placeholder={
                        post.excerpt || "Describe this post for Google…"
                      }
                      className={`${inputCls} resize-none`}
                    />
                    <p className="text-[#646970] text-xs mt-1">
                      Ideal: 140–160 characters. Shown in Google search results.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[#1d2327] text-sm font-medium mb-1">
                      Keywords
                    </label>
                    <input
                      type="text"
                      value={post.seo.keywords}
                      onChange={(e) => setSeo("keywords", e.target.value)}
                      placeholder="seo india, digital marketing, google ranking"
                      className={inputCls}
                    />
                    <p className="text-[#646970] text-xs mt-1">
                      Comma-separated keywords for the meta keywords tag.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[#1d2327] text-sm font-medium">
                        JSON-LD Schema
                      </label>
                      <span className="text-[#646970] text-xs">
                        Optional — structured data for rich results
                      </span>
                    </div>
                    <textarea
                      value={post.seo.schema}
                      onChange={(e) => setSeo("schema", e.target.value)}
                      rows={6}
                      placeholder={
                        '{ "@context": "https://schema.org", "@type": "BlogPosting", ... }'
                      }
                      className={`${inputCls} resize-y font-mono text-xs`}
                    />
                  </div>
                </div>
              </div>

              {/* SERP Preview */}
              {(post.seo.title || post.title) && (
                <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
                    <h3 className="text-[#1d2327] text-sm font-semibold flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4" /> Google SERP Preview
                    </h3>
                  </div>
                  <div className="p-5">
                    <div className="max-w-xl">
                      <p className="text-[#1a0dab] text-base font-medium truncate">
                        {post.seo.title || post.title}
                      </p>
                      <p className="text-[#006621] text-sm mt-0.5">
                        https://aetherank.com/blog/
                        {post.slug || "post-slug"}
                      </p>
                      <p className="text-[#545454] text-sm mt-1 line-clamp-2">
                        {post.seo.description ||
                          post.excerpt ||
                          "No description set."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom save */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2 text-sm border border-[#8c8f94] text-[#1d2327] rounded hover:bg-[#f6f7f7] transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-2 bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white font-medium px-5 py-2 rounded text-sm transition-colors"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {post.status === "published" ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
