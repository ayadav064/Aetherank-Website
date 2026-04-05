import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import {
  fetchSettings,
  saveSettings,
  getToken,
  type CmsSettings,
  type SeoPageSettings,
  DEFAULT_SEO,
  DEFAULT_CONTENT,
} from "@/lib/cmsApi";
import AdminLayout from "./AdminLayout";
import { Search, Save, Loader2, CheckCircle2, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/about-us": "About Us",
  "/services": "Services (Overview)",
  "/services/seo": "Services → SEO & GEO",
  "/services/ppc": "Services → PPC",
  "/services/meta-ads": "Services → Meta Ads",
  "/services/social-media": "Services → Social Media",
  "/services/web-design-development": "Services → Web Design",
  "/services/content-marketing": "Services → Content Marketing",
  "/services/orm": "Services → ORM",
  "/case-studies": "Case Studies",
  "/blog": "Blog",
  "/contact": "Contact",
  "/free-audit": "Free Audit",
  "/request-proposal": "Request Proposal",
};

type SeoMap = Record<string, SeoPageSettings>;

export default function SeoEditor() {
  const [, navigate] = useLocation();
  const [seo, setSeo] = useState<SeoMap>({ ...DEFAULT_SEO });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>("/");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { navigate("/admin"); return; }
    fetchSettings().then((s) => {
      if (s?.seo) setSeo({ ...DEFAULT_SEO, ...s.seo });
      setLoading(false);
    });
  }, [navigate]);

  const togglePage = (page: string) => setExpanded(expanded === page ? null : page);

  const update = useCallback((page: string, field: keyof SeoPageSettings, value: string) => {
    setSeo((prev) => ({
      ...prev,
      [page]: { ...prev[page], [field]: value },
    }));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSavedMsg("");
    try {
      const current = await fetchSettings();
      const merged: CmsSettings = {
        seo,
        content: current?.content ?? DEFAULT_CONTENT,
      };
      await saveSettings(merged);
      setSavedMsg("All SEO settings saved!");
      setTimeout(() => setSavedMsg(""), 3000);
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
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-[#f0f0f1] min-h-full">
        {/* WP-style page header */}
        <div className="bg-white border-b border-[#c3c4c7] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-[#1d2327] text-xl font-semibold flex items-center gap-2">
              <Search className="w-5 h-5 text-slate-400" /> SEO Editor
            </h1>
            <p className="text-[#646970] text-xs mt-0.5">Edit meta title, description, keywords, and JSON-LD schema for each page.</p>
          </div>
          <div className="flex items-center gap-3">
            {savedMsg && (
              <span className="flex items-center gap-1.5 text-emerald-600 text-sm">
                <CheckCircle2 className="w-4 h-4" /> {savedMsg}
              </span>
            )}
            {error && <span className="text-red-600 text-sm">{error}</span>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded text-sm transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </div>

        <div className="p-6 space-y-2 max-w-[900px]">
          {Object.entries(PAGE_LABELS).map(([path, label]) => {
            const isOpen = expanded === path;
            const pageSeo = seo[path] ?? DEFAULT_SEO[path] ?? { title: "", description: "", keywords: "" };
            const titleLen = pageSeo.title?.length ?? 0;
            const descLen = pageSeo.description?.length ?? 0;

            return (
              <div key={path} className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
                <button
                  onClick={() => togglePage(path)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-[#f6f7f7] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#1d2327] font-medium text-sm">{label}</span>
                    <span className="text-[#a7aaad] text-xs font-mono hidden sm:inline">{path}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {pageSeo.title && (
                      <span className="hidden md:inline text-[#646970] text-xs truncate max-w-48">{pageSeo.title}</span>
                    )}
                    <div className="flex gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${pageSeo.title ? "bg-emerald-400" : "bg-[#dcdcde]"}`} title="Title" />
                      <div className={`w-2 h-2 rounded-full ${pageSeo.description ? "bg-emerald-400" : "bg-[#dcdcde]"}`} title="Description" />
                      <div className={`w-2 h-2 rounded-full ${pageSeo.schema ? "bg-emerald-400" : "bg-[#dcdcde]"}`} title="Schema" />
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#a7aaad]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#a7aaad]" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-4 border-t border-[#c3c4c7] space-y-4 bg-[#fafafa]">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[#1d2327] text-sm font-medium">Meta Title</label>
                        <span className={`text-xs ${titleLen > 60 ? "text-red-500" : titleLen > 50 ? "text-amber-500" : "text-[#646970]"}`}>
                          {titleLen}/60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={pageSeo.title}
                        onChange={(e) => update(path, "title", e.target.value)}
                        placeholder="Page Title | Aetherank"
                        className="w-full bg-white border border-[#8c8f94] text-[#1d2327] placeholder-[#a7aaad] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] transition-shadow"
                      />
                      <p className="text-[#646970] text-xs mt-1">Ideal: 50–60 characters. Appears in browser tab and Google results.</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[#1d2327] text-sm font-medium">Meta Description</label>
                        <span className={`text-xs ${descLen > 160 ? "text-red-500" : descLen > 140 ? "text-amber-500" : "text-[#646970]"}`}>
                          {descLen}/160 chars
                        </span>
                      </div>
                      <textarea
                        value={pageSeo.description}
                        onChange={(e) => update(path, "description", e.target.value)}
                        placeholder="Describe this page in 140–160 characters for Google search results."
                        rows={3}
                        className="w-full bg-white border border-[#8c8f94] text-[#1d2327] placeholder-[#a7aaad] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] transition-shadow resize-none"
                      />
                      <p className="text-[#646970] text-xs mt-1">Ideal: 140–160 characters. Shown in Google search snippets.</p>
                    </div>

                    <div>
                      <label className="block text-[#1d2327] text-sm font-medium mb-1">Keywords</label>
                      <input
                        type="text"
                        value={pageSeo.keywords}
                        onChange={(e) => update(path, "keywords", e.target.value)}
                        placeholder="keyword one, keyword two, keyword three"
                        className="w-full bg-white border border-[#8c8f94] text-[#1d2327] placeholder-[#a7aaad] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] transition-shadow"
                      />
                      <p className="text-[#646970] text-xs mt-1">Comma-separated. Used in the meta keywords tag.</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[#1d2327] text-sm font-medium">JSON-LD Schema Markup</label>
                        <span className="text-[#646970] text-xs">Structured data for rich results</span>
                      </div>
                      <textarea
                        value={pageSeo.schema ?? ""}
                        onChange={(e) => update(path, "schema", e.target.value)}
                        placeholder={'{ "@context": "https://schema.org", "@type": "WebPage", ... }'}
                        rows={6}
                        className="w-full bg-white border border-[#8c8f94] text-[#1d2327] placeholder-[#a7aaad] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] transition-shadow resize-y font-mono"
                      />
                      <p className="text-[#646970] text-xs mt-1">Paste valid JSON-LD. Injected as &lt;script type="application/ld+json"&gt; in the &lt;head&gt;. Leave blank to skip.</p>
                    </div>

                    {/* SERP Preview */}
                    {pageSeo.title && (
                      <div className="bg-white border border-[#c3c4c7] rounded p-4">
                        <p className="text-[#646970] text-xs font-medium mb-2 flex items-center gap-1">
                          <RefreshCw className="w-3 h-3" /> Google SERP Preview
                        </p>
                        <p className="text-[#1a0dab] text-sm font-medium truncate">{pageSeo.title}</p>
                        <p className="text-[#006621] text-xs mt-0.5">https://aetherank.com{path}</p>
                        <p className="text-[#545454] text-xs mt-1 line-clamp-2">{pageSeo.description || "No description set."}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-0 pb-6 pt-2 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white font-medium px-5 py-2 rounded text-sm transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
