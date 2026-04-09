import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import AdminLayout from "./AdminLayout";
import {
  fetchSettings,
  saveSettings,
  getToken,
  DEFAULT_NAVIGATION,
  type CmsSettings,
  type NavigationLink,
  type FooterColumn,
  type NavigationSettings,
} from "@/lib/cmsApi";
import {
  Menu,
  Plus,
  Trash2,
  GripVertical,
  Save,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  LayoutTemplate,
  Info,
} from "lucide-react";

export default function AdminNavigation() {
  const [, navigate] = useLocation();
  const [settings, setSettings] = useState<CmsSettings | null>(null);
  const [nav, setNav] = useState<NavigationSettings>(DEFAULT_NAVIGATION);
  const [activeTab, setActiveTab] = useState<"header" | "footer">("header");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!getToken()) { navigate("/admin"); return; }
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "footer") setActiveTab("footer");
    fetchSettings().then((s) => {
      if (s) {
        setSettings(s);
        setNav(s.navigation ?? DEFAULT_NAVIGATION);
      }
    });
  }, [navigate]);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      const updated: CmsSettings = { ...settings, navigation: nav };
      await saveSettings(updated);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  // ── Header Menu helpers ────────────────────────────────────────────────────

  function addHeaderLink() {
    setNav((prev) => ({
      ...prev,
      header: [...prev.header, { label: "New Page", path: "/new-page" }],
    }));
  }

  function updateHeaderLink(idx: number, field: keyof NavigationLink, value: string) {
    setNav((prev) => ({
      ...prev,
      header: prev.header.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      ),
    }));
  }

  function removeHeaderLink(idx: number) {
    setNav((prev) => ({
      ...prev,
      header: prev.header.filter((_, i) => i !== idx),
    }));
  }

  function moveHeaderLink(idx: number, dir: -1 | 1) {
    setNav((prev) => {
      const arr = [...prev.header];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return prev;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return { ...prev, header: arr };
    });
  }

  // ── Footer helpers ─────────────────────────────────────────────────────────

  function addFooterColumn() {
    setNav((prev) => ({
      ...prev,
      footer_columns: [
        ...prev.footer_columns,
        { heading: "New Column", links: [{ label: "Link", path: "/link" }] },
      ],
    }));
  }

  function updateColumnHeading(colIdx: number, value: string) {
    setNav((prev) => ({
      ...prev,
      footer_columns: prev.footer_columns.map((col, i) =>
        i === colIdx ? { ...col, heading: value } : col
      ),
    }));
  }

  function removeColumn(colIdx: number) {
    setNav((prev) => ({
      ...prev,
      footer_columns: prev.footer_columns.filter((_, i) => i !== colIdx),
    }));
  }

  function moveColumn(colIdx: number, dir: -1 | 1) {
    setNav((prev) => {
      const arr = [...prev.footer_columns];
      const target = colIdx + dir;
      if (target < 0 || target >= arr.length) return prev;
      [arr[colIdx], arr[target]] = [arr[target], arr[colIdx]];
      return { ...prev, footer_columns: arr };
    });
  }

  function addColumnLink(colIdx: number) {
    setNav((prev) => ({
      ...prev,
      footer_columns: prev.footer_columns.map((col, i) =>
        i === colIdx
          ? { ...col, links: [...col.links, { label: "New Link", path: "/new" }] }
          : col
      ),
    }));
  }

  function updateColumnLink(colIdx: number, linkIdx: number, field: keyof NavigationLink, value: string) {
    setNav((prev) => ({
      ...prev,
      footer_columns: prev.footer_columns.map((col, ci) =>
        ci === colIdx
          ? {
              ...col,
              links: col.links.map((lnk, li) =>
                li === linkIdx ? { ...lnk, [field]: value } : lnk
              ),
            }
          : col
      ),
    }));
  }

  function removeColumnLink(colIdx: number, linkIdx: number) {
    setNav((prev) => ({
      ...prev,
      footer_columns: prev.footer_columns.map((col, ci) =>
        ci === colIdx
          ? { ...col, links: col.links.filter((_, li) => li !== linkIdx) }
          : col
      ),
    }));
  }

  function moveColumnLink(colIdx: number, linkIdx: number, dir: -1 | 1) {
    setNav((prev) => ({
      ...prev,
      footer_columns: prev.footer_columns.map((col, ci) => {
        if (ci !== colIdx) return col;
        const arr = [...col.links];
        const target = linkIdx + dir;
        if (target < 0 || target >= arr.length) return col;
        [arr[linkIdx], arr[target]] = [arr[target], arr[linkIdx]];
        return { ...col, links: arr };
      }),
    }));
  }

  return (
    <AdminLayout>
      <div className="bg-[#f0f0f1] min-h-full">
        {/* Page header */}
        <div className="bg-white border-b border-[#c3c4c7] px-6 py-4 flex items-center justify-between">
          <h1 className="text-[#1d2327] text-xl font-semibold flex items-center gap-2">
            <Menu className="w-5 h-5 text-slate-400" />
            Navigation
          </h1>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-[#2271b1] hover:underline">
              <ExternalLink className="w-3.5 h-3.5" /> View Site
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition-all ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-[#2271b1] text-white hover:bg-[#135e96]"
              } disabled:opacity-60`}
            >
              {saved ? (
                <><CheckCircle2 className="w-4 h-4" /> Saved</>
              ) : (
                <><Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Changes"}</>
              )}
            </button>
          </div>
        </div>

        <div className="p-6 max-w-4xl space-y-5">

          {/* Info banner */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded p-3.5 text-sm text-blue-800">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
            <div>
              <strong>Header:</strong> "Home" and "Services" are always shown. Add any extra pages here.
              &nbsp;<strong>Footer:</strong> Add, rename, or reorder any columns and links.
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
            <div className="flex border-b border-[#c3c4c7]">
              <button
                onClick={() => setActiveTab("header")}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === "header"
                    ? "border-[#2271b1] text-[#2271b1] bg-blue-50/50"
                    : "border-transparent text-[#646970] hover:text-[#1d2327]"
                }`}
              >
                <Menu className="w-4 h-4" />
                Header Menu
              </button>
              <button
                onClick={() => setActiveTab("footer")}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === "footer"
                    ? "border-[#2271b1] text-[#2271b1] bg-blue-50/50"
                    : "border-transparent text-[#646970] hover:text-[#1d2327]"
                }`}
              >
                <LayoutTemplate className="w-4 h-4" />
                Footer Menus
              </button>
            </div>

            {/* ── Header Menu tab ─────────────────────────────────────────── */}
            {activeTab === "header" && (
              <div className="p-5 space-y-4">
                <p className="text-xs text-[#646970]">
                  These links appear in the top navigation bar next to <strong>Home</strong> and <strong>Services</strong>.
                  Links with path <code className="bg-slate-100 px-1 rounded">/</code> or <code className="bg-slate-100 px-1 rounded">/services</code> are ignored here (they're always displayed).
                </p>

                <div className="space-y-2">
                  {nav.header.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#f6f7f7] border border-[#dcdcde] rounded p-3">
                      <GripVertical className="w-4 h-4 text-[#a7aaad] shrink-0" />

                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-[#646970] uppercase mb-1">Label</label>
                          <input
                            value={item.label}
                            onChange={(e) => updateHeaderLink(idx, "label", e.target.value)}
                            className="w-full text-sm border border-[#dcdcde] rounded px-2.5 py-1.5 bg-white focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
                            placeholder="Page Name"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#646970] uppercase mb-1">Path / URL</label>
                          <input
                            value={item.path}
                            onChange={(e) => updateHeaderLink(idx, "path", e.target.value)}
                            className="w-full text-sm border border-[#dcdcde] rounded px-2.5 py-1.5 bg-white focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] font-mono"
                            placeholder="/page-path"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => moveHeaderLink(idx, -1)}
                          disabled={idx === 0}
                          className="p-1.5 rounded hover:bg-[#dcdcde] disabled:opacity-30 transition-colors"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5 text-[#646970]" />
                        </button>
                        <button
                          onClick={() => moveHeaderLink(idx, 1)}
                          disabled={idx === nav.header.length - 1}
                          className="p-1.5 rounded hover:bg-[#dcdcde] disabled:opacity-30 transition-colors"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5 text-[#646970]" />
                        </button>
                        <button
                          onClick={() => removeHeaderLink(idx)}
                          className="p-1.5 rounded hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#a7aaad]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addHeaderLink}
                  className="flex items-center gap-2 px-4 py-2 border border-dashed border-[#2271b1] text-[#2271b1] rounded text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Menu Item
                </button>
              </div>
            )}

            {/* ── Footer Menus tab ────────────────────────────────────────── */}
            {activeTab === "footer" && (
              <div className="p-5 space-y-6">
                <p className="text-xs text-[#646970]">
                  Each column appears in the footer. Add, rename, or reorder columns and their links.
                </p>

                {nav.footer_columns.map((col, colIdx) => (
                  <div key={colIdx} className="border border-[#dcdcde] rounded overflow-hidden">
                    {/* Column header */}
                    <div className="bg-[#f6f7f7] border-b border-[#dcdcde] px-4 py-3 flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-[#a7aaad] shrink-0" />
                      <div className="flex-1">
                        <label className="block text-[10px] font-semibold text-[#646970] uppercase mb-1">Column Heading</label>
                        <input
                          value={col.heading}
                          onChange={(e) => updateColumnHeading(colIdx, e.target.value)}
                          className="text-sm font-semibold border border-[#dcdcde] rounded px-2.5 py-1.5 bg-white focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] w-48"
                          placeholder="Column Name"
                        />
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => moveColumn(colIdx, -1)}
                          disabled={colIdx === 0}
                          className="p-1.5 rounded hover:bg-[#dcdcde] disabled:opacity-30 transition-colors"
                          title="Move left"
                        >
                          <ArrowUp className="w-3.5 h-3.5 text-[#646970]" />
                        </button>
                        <button
                          onClick={() => moveColumn(colIdx, 1)}
                          disabled={colIdx === nav.footer_columns.length - 1}
                          className="p-1.5 rounded hover:bg-[#dcdcde] disabled:opacity-30 transition-colors"
                          title="Move right"
                        >
                          <ArrowDown className="w-3.5 h-3.5 text-[#646970]" />
                        </button>
                        <button
                          onClick={() => removeColumn(colIdx)}
                          className="p-1.5 rounded hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="Delete column"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#a7aaad]" />
                        </button>
                      </div>
                    </div>

                    {/* Column links */}
                    <div className="p-4 space-y-2">
                      {col.links.map((link, linkIdx) => (
                        <div key={linkIdx} className="flex items-center gap-2 bg-[#f6f7f7] border border-[#dcdcde] rounded p-2.5">
                          <GripVertical className="w-3.5 h-3.5 text-[#a7aaad] shrink-0" />
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <input
                              value={link.label}
                              onChange={(e) => updateColumnLink(colIdx, linkIdx, "label", e.target.value)}
                              className="text-sm border border-[#dcdcde] rounded px-2 py-1.5 bg-white focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
                              placeholder="Link Label"
                            />
                            <input
                              value={link.path}
                              onChange={(e) => updateColumnLink(colIdx, linkIdx, "path", e.target.value)}
                              className="text-sm border border-[#dcdcde] rounded px-2 py-1.5 bg-white focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] font-mono"
                              placeholder="/path"
                            />
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              onClick={() => moveColumnLink(colIdx, linkIdx, -1)}
                              disabled={linkIdx === 0}
                              className="p-1 rounded hover:bg-[#dcdcde] disabled:opacity-30"
                              title="Move up"
                            >
                              <ArrowUp className="w-3 h-3 text-[#646970]" />
                            </button>
                            <button
                              onClick={() => moveColumnLink(colIdx, linkIdx, 1)}
                              disabled={linkIdx === col.links.length - 1}
                              className="p-1 rounded hover:bg-[#dcdcde] disabled:opacity-30"
                              title="Move down"
                            >
                              <ArrowDown className="w-3 h-3 text-[#646970]" />
                            </button>
                            <button
                              onClick={() => removeColumnLink(colIdx, linkIdx)}
                              className="p-1 rounded hover:bg-red-50 hover:text-red-500"
                              title="Remove"
                            >
                              <Trash2 className="w-3 h-3 text-[#a7aaad]" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => addColumnLink(colIdx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-[#2271b1] text-[#2271b1] rounded text-xs font-medium hover:bg-blue-50 transition-colors mt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Link
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addFooterColumn}
                  className="flex items-center gap-2 px-4 py-2 border border-dashed border-[#2271b1] text-[#2271b1] rounded text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Footer Column
                </button>
              </div>
            )}
          </div>

          {/* Save button bottom */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold transition-all ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-[#2271b1] text-white hover:bg-[#135e96]"
              } disabled:opacity-60`}
            >
              {saved ? (
                <><CheckCircle2 className="w-4 h-4" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4" /> {saving ? "Saving…" : "Save All Changes"}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
