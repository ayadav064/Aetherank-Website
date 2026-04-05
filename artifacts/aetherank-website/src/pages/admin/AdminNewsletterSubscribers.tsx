import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { getToken } from "@/lib/cmsApi";
import {
  Mail, Loader2, Trash2, RefreshCw, Download, Users, CheckCircle2, XCircle,
} from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  active: boolean;
  ip: string | null;
  createdAt: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  return `${mo}mo ago`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminNewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscribers", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json() as Subscriber[];
        setSubscribers(data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function deleteSubscriber(id: string) {
    setDeleting(id);
    try {
      await fetch(`/api/admin/subscribers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  function exportCsv() {
    const active = subscribers.filter((s) => s.active);
    const csv = ["Email,Subscribed On"]
      .concat(active.map((s) => `${s.email},${formatDate(s.createdAt)}`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aetherank-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );
  const activeCount = subscribers.filter((s) => s.active).length;

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[#1d2327] flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Newsletter Subscribers
              {subscribers.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold">
                  {activeCount}
                </span>
              )}
            </h1>
            <p className="text-sm text-[#646970] mt-1">
              {activeCount} active subscriber{activeCount !== 1 ? "s" : ""} · {subscribers.length} total
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => void load()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#c3c4c7] rounded bg-white text-[#1d2327] hover:bg-[#f0f0f1] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            {activeCount > 0 && (
              <button
                onClick={exportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#2271b1] rounded bg-[#2271b1] text-white hover:bg-[#135e96] transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Total Subscribers", value: subscribers.length, icon: Users, color: "blue" },
            { label: "Active", value: activeCount, icon: CheckCircle2, color: "emerald" },
            { label: "Inactive", value: subscribers.length - activeCount, icon: XCircle, color: "slate" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-[#c3c4c7] rounded shadow-sm p-4 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-${color}-100 flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 text-${color}-600`} />
              </div>
              <div>
                <p className="text-[#1d2327] text-xl font-bold leading-none">{value}</p>
                <p className="text-[#646970] text-xs mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        {subscribers.length > 0 && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm px-3 py-2 text-sm border border-[#c3c4c7] rounded bg-white text-[#1d2327] placeholder-[#a7aaad] focus:outline-none focus:border-[#2271b1]"
            />
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[#2271b1]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-16 text-center">
            <Mail className="w-10 h-10 text-[#c3c4c7] mx-auto mb-3" />
            <p className="text-[#646970] text-sm font-medium">
              {subscribers.length === 0 ? "No subscribers yet." : "No results match your search."}
            </p>
            {subscribers.length === 0 && (
              <p className="text-[#a7aaad] text-xs mt-1">
                Emails will appear here after someone subscribes from the blog page.
              </p>
            )}
          </div>
        ) : (
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7]">
                  <th className="text-left px-4 py-3 text-[#1d2327] font-semibold text-xs uppercase tracking-wide">Email</th>
                  <th className="text-left px-4 py-3 text-[#1d2327] font-semibold text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-[#1d2327] font-semibold text-xs uppercase tracking-wide hidden md:table-cell">Subscribed</th>
                  <th className="text-right px-4 py-3 text-[#1d2327] font-semibold text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f1]">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <span className="text-emerald-700 text-xs font-bold uppercase">
                            {sub.email[0]}
                          </span>
                        </div>
                        <span className="text-[#1d2327] font-medium">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                        sub.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {sub.active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {sub.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#646970] hidden md:table-cell">
                      <span title={formatDate(sub.createdAt)}>{timeAgo(sub.createdAt)}</span>
                      <span className="text-[#a7aaad] text-xs block">{formatDate(sub.createdAt)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`mailto:${sub.email}`}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#2271b1] border border-[#c3c4c7] rounded hover:bg-[#f0f6fc] hover:border-[#2271b1] transition-colors"
                        >
                          <Mail className="w-3 h-3" /> Email
                        </a>
                        <button
                          onClick={() => void deleteSubscriber(sub.id)}
                          disabled={deleting === sub.id}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {deleting === sub.id
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <Trash2 className="w-3 h-3" />}
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 0 && (
              <div className="px-4 py-3 bg-[#f6f7f7] border-t border-[#c3c4c7] text-xs text-[#646970]">
                Showing {filtered.length} of {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
