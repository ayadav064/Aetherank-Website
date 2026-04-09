import { useEffect, useState, useCallback } from "react";
import { useLocation, useSearch } from "wouter";
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
import {
  Search,
  Save,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Map,
  FileText,
  ExternalLink,
  RotateCcw,
} from "lucide-react";

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
  "/digital-marketing-company-india": "Landing: Digital Marketing India",
  "/digital-marketing-company-mumbai": "Landing: Digital Marketing Mumbai",
};

const DEFAULT_ROBOTS_TXT = (siteUrl: string) =>
`User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/admin

# Allow beneficial AI search agents
User-agent: OAI-SearchBot
Allow: /

# Block OpenAI training crawler
User-agent: GPTBot
Disallow: /

# Block Google AI training crawler
User-agent: Google-Extended
Disallow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

type SeoMap = Record<string, SeoPageSettings>;
type ActiveTab = "meta" | "sitemap" | "robots";

const inputCls =
  "w-full bg-white border border-[#8c8f94] text-[#1d2327] placeholder-[#a7aaad] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] transition-shadow";

export default function SeoEditor() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const tab = (new URLSearchParams(search).get("tab") ?? "meta") as ActiveTab;

  const [seo, setSeo] = useState<SeoMap>({ ...DEFAULT_SEO });
  const [robotsTxt, setRobotsTxt] = useState("");
  const [sitemapSiteUrl, setSitemapSiteUrl] = useState("https://aetherank.com");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>("/");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { navigate("/admin"); return; }
    fetchSettings().then((s) => {
      if (s?.seo) setSeo({ ...DEFAULT_SEO, ...s.seo });
      const tech = s?.technical;
      const url = tech?.sitemap_site_url?.trim() || "https://aetherank.com";
      setSitemapSiteUrl(url);
      setRobotsTxt(tech?.robots_txt ?? DEFAULT_ROBOTS_TXT(url));
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
        technical: {
          ...(current?.technical ?? {}),
          robots_txt: robotsTxt,
          sitemap_site_url: sitemapSiteUrl,
        },
      };
      await saveSettings(merged);
      setSavedMsg("Saved!");
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

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "meta", label: "Meta Tags", icon: <Search className="w-4 h-4" /> },
    { id: "sitemap", label: "Sitemap", icon: <Map className="w-4 h-4" /> },
    { id: "robots", label: "Robots.txt", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <AdminLayout>
      <div className="bg-[#f0f0f1] min-h-full">
        <div className="bg-white border-b border-[#c3c4c7] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-[#1d2327] text-xl font-semibold flex items-center gap-2">
              <Search className="w-5 h-5 text-slate-400" /> SEO Editor
            </h1>
            <p className="text-[#646970] text-xs mt-0.5">
              Meta tags, sitemap configuration, and robots.txt for all pages.
            </p>
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

        {/* Tab bar */}
        <div className="bg-white border-b border-[#c3c4c7] px-6">
          <div className="flex gap-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(`/admin/seo?tab=${t.id}`)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-[#2271b1] text-[#2271b1]"
                    : "border-transparent text-[#646970] hover:text-[#1d2327]"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Meta Tags Tab ── */}
        {tab === "meta" && (
          <div className="p-6 space-y-2 max-w-[900px]">
            {Object.entries(PAGE_LABELS).map(([path, label]) => {
              const isOpen = expanded === path;
              const pageSeo = seo[path] ?? DEFAULT_SEO[path] ?? { title: "", description: "", keywords: "", schema: "" };
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
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#a7aaad]" /> : <ChevronDown className="w-4 h-4 text-[#a7aaad]" />}
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
                          className={inputCls}
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
                          className={`${inputCls} resize-none`}
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
                          className={inputCls}
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
                          className={`${inputCls} resize-y font-mono`}
                        />
                        <p className="text-[#646970] text-xs mt-1">
                          Paste valid JSON-LD. Injected as &lt;script type="application/ld+json"&gt; in the &lt;head&gt;. Leave blank to skip.
                        </p>
                      </div>

                      {pageSeo.title && (
                        <div className="bg-white border border-[#c3c4c7] rounded p-4">
                          <p className="text-[#646970] text-xs font-medium mb-2 flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" /> Google SERP Preview
                          </p>
                          <p className="text-[#1a0dab] text-sm font-medium truncate">{pageSeo.title}</p>
                          <p className="text-[#006621] text-xs mt-0.5">{sitemapSiteUrl}{path}</p>
                          <p className="text-[#545454] text-xs mt-1 line-clamp-2">{pageSeo.description || "No description set."}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-2 flex justify-end">
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
        )}

        {/* ── Sitemap Tab ── */}
        {tab === "sitemap" && (
          <div className="p-6 max-w-[900px] space-y-4">
            <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-6 space-y-5">
              <div>
                <label className="block text-[#1d2327] text-sm font-semibold mb-1">Site URL</label>
                <p className="text-[#646970] text-xs mb-2">
                  The base domain used to generate all sitemap URLs. Must include <code className="bg-[#f0f0f1] px-1 rounded">https://</code> and no trailing slash.
                </p>
                <input
                  type="url"
                  value={sitemapSiteUrl}
                  onChange={(e) => setSitemapSiteUrl(e.target.value)}
                  placeholder="https://aetherank.com"
                  className={inputCls}
                />
              </div>

              <div className="border-t border-[#f0f0f1] pt-4">
                <p className="text-[#1d2327] text-sm font-semibold mb-1">Sitemap Preview</p>
                <p className="text-[#646970] text-xs mb-3">
                  The sitemap is auto-generated from all site pages + published blog posts. It updates automatically when you publish new posts.
                </p>
                <div className="bg-[#f6f7f7] border border-[#c3c4c7] rounded p-4 space-y-1 font-mono text-xs text-[#1d2327]">
                  {[
                    "/", "/services", "/services/seo", "/services/ppc", "/services/meta-ads",
                    "/services/social-media", "/services/web-design-development",
                    "/services/content-marketing", "/services/orm",
                    "/about-us", "/case-studies", "/blog", "/contact",
                    "/free-audit", "/request-proposal", "/privacy-policy", "/terms-of-service",
                  ].map((p) => (
                    <div key={p} className="flex items-center gap-2 text-[#646970]">
                      <span className="text-emerald-600">✓</span>
                      <span>{sitemapSiteUrl}{p}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-[#a7aaad] mt-1 pt-1 border-t border-[#dcdcde]">
                    <span className="text-sky-500">+</span>
                    <span>All published blog posts at {sitemapSiteUrl}/blog/[slug]</span>
                  </div>
                </div>

                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-sm text-[#2271b1] hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View live sitemap.xml
                </a>
              </div>
            </div>

            <div className="flex justify-end">
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
        )}

        {/* ── Robots.txt Tab ── */}
        {tab === "robots" && (
          <div className="p-6 max-w-[900px] space-y-4">
            <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[#1d2327] text-sm font-semibold">robots.txt</p>
                  <p className="text-[#646970] text-xs mt-0.5">
                    Controls which pages search engine crawlers can access. Changes are live immediately after saving.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setRobotsTxt(DEFAULT_ROBOTS_TXT(sitemapSiteUrl))}
                    className="flex items-center gap-1.5 text-xs text-[#646970] border border-[#c3c4c7] px-3 py-1.5 rounded hover:bg-[#f6f7f7] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset to Default
                  </button>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#2271b1] border border-[#c3c4c7] px-3 py-1.5 rounded hover:bg-[#f6f7f7] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View live file
                  </a>
                </div>
              </div>

              <textarea
                value={robotsTxt}
                onChange={(e) => setRobotsTxt(e.target.value)}
                rows={20}
                spellCheck={false}
                className="w-full bg-[#fafafa] border border-[#8c8f94] text-[#1d2327] rounded px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] transition-shadow resize-y"
              />

              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-800 space-y-1">
                <p className="font-semibold">Common directives:</p>
                <p><code className="bg-amber-100 px-1 rounded">User-agent: *</code> — applies to all bots</p>
                <p><code className="bg-amber-100 px-1 rounded">Disallow: /admin</code> — blocks a path from being crawled</p>
                <p><code className="bg-amber-100 px-1 rounded">Allow: /</code> — explicitly allows a path</p>
                <p><code className="bg-amber-100 px-1 rounded">Sitemap: URL</code> — tells crawlers where your sitemap is</p>
              </div>
            </div>

            <div className="flex justify-end">
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
        )}
      </div>
    </AdminLayout>
  );
}
