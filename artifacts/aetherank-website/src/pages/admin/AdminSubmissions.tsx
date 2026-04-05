import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { getToken } from "@/lib/cmsApi";
import {
  Mail, Inbox, Trash2, CheckCircle2, Loader2,
  Phone, Globe, Building2, MessageSquare, Target, Wallet, Clock, RefreshCw
} from "lucide-react";

interface Submission {
  id: string;
  type: "contact" | "audit" | "proposal";
  data: Record<string, unknown>;
  createdAt: string;
  read: boolean;
}

const TYPE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  contact: { label: "Contact", color: "text-blue-700", bg: "bg-blue-100" },
  audit: { label: "Free Audit", color: "text-emerald-700", bg: "bg-emerald-100" },
  proposal: { label: "Proposal", color: "text-violet-700", bg: "bg-violet-100" },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function FieldRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: unknown }) {
  if (!value) return null;
  const display = Array.isArray(value) ? (value as string[]).join(", ") : String(value);
  if (!display) return null;
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
      <span className="text-slate-500 shrink-0 min-w-[90px]">{label}:</span>
      <span className="text-slate-800 font-medium break-all">{display}</span>
    </div>
  );
}

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [filter, setFilter] = useState<"all" | "contact" | "audit" | "proposal">("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/submissions", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json() as Submission[];
        setSubmissions(data);
        if (selected) {
          const updated = data.find(s => s.id === selected.id);
          setSelected(updated ?? null);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function markRead(id: string) {
    await fetch(`/api/admin/submissions/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, read: true } : s));
  }

  async function deleteSubmission(id: string) {
    setDeleting(id);
    await fetch(`/api/admin/submissions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setSubmissions(prev => prev.filter(s => s.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleting(null);
  }

  function selectSubmission(sub: Submission) {
    setSelected(sub);
    if (!sub.read) void markRead(sub.id);
  }

  const filtered = submissions.filter(s => filter === "all" || s.type === filter);
  const unread = submissions.filter(s => !s.read).length;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[#1d2327] flex items-center gap-2">
              <Inbox className="w-5 h-5" />
              Form Submissions
              {unread > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-[#2271b1] text-white text-xs font-bold">{unread}</span>
              )}
            </h1>
            <p className="text-sm text-[#646970] mt-1">{submissions.length} total submission{submissions.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => void load()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#c3c4c7] rounded bg-white text-[#1d2327] hover:bg-[#f0f0f1] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-4 border-b border-[#c3c4c7]">
          {(["all", "contact", "audit", "proposal"] as const).map(f => {
            const count = f === "all" ? submissions.length : submissions.filter(s => s.type === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
                  filter === f
                    ? "border-[#2271b1] text-[#2271b1]"
                    : "border-transparent text-[#646970] hover:text-[#1d2327]"
                }`}
              >
                {f === "all" ? "All" : f === "audit" ? "Free Audit" : f.charAt(0).toUpperCase() + f.slice(1)} ({count})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[#2271b1]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-16 text-center">
            <Inbox className="w-10 h-10 text-[#c3c4c7] mx-auto mb-3" />
            <p className="text-[#646970] text-sm">No submissions yet.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[360px_1fr] gap-4">
            {/* Inbox list */}
            <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
              <div className="divide-y divide-[#f0f0f1]">
                {filtered.map(sub => {
                  const tinfo = TYPE_LABELS[sub.type]!;
                  const name = (sub.data["name"] ?? sub.data["businessName"] ?? "Unknown") as string;
                  const email = (sub.data["email"] ?? "") as string;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => selectSubmission(sub)}
                      className={`w-full text-left px-4 py-3.5 hover:bg-[#f0f0f1] transition-colors ${
                        selected?.id === sub.id ? "bg-[#f0f6fc] border-l-[3px] border-l-[#2271b1]" : "border-l-[3px] border-l-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {!sub.read && <span className="w-2 h-2 rounded-full bg-[#2271b1] shrink-0" />}
                          <span className={`text-sm font-semibold truncate ${sub.read ? "text-[#1d2327]" : "text-[#1d2327]"}`}>{name}</span>
                        </div>
                        <span className="text-xs text-[#646970] shrink-0">{timeAgo(sub.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tinfo.bg} ${tinfo.color}`}>{tinfo.label}</span>
                        {email && <span className="text-xs text-[#646970] truncate">{email}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detail panel */}
            {selected ? (
              <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TYPE_LABELS[selected.type]!.bg} ${TYPE_LABELS[selected.type]!.color}`}>
                        {TYPE_LABELS[selected.type]!.label}
                      </span>
                      {selected.read && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Read
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold text-[#1d2327]">
                      {(selected.data["name"] ?? selected.data["businessName"] ?? "Submission") as string}
                    </h2>
                    <p className="text-sm text-[#646970]">{new Date(selected.createdAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}</p>
                  </div>
                  <button
                    onClick={() => void deleteSubmission(selected.id)}
                    disabled={deleting === selected.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deleting === selected.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    Delete
                  </button>
                </div>

                <div className="space-y-3 border border-[#f0f0f1] rounded p-4 bg-[#f9f9f9]">
                  <FieldRow icon={<Mail className="w-4 h-4" />} label="Email" value={selected.data["email"]} />
                  <FieldRow icon={<Phone className="w-4 h-4" />} label="Phone" value={selected.data["phone"]} />
                  <FieldRow icon={<Building2 className="w-4 h-4" />} label="Company" value={selected.data["company"] ?? selected.data["businessName"]} />
                  <FieldRow icon={<Globe className="w-4 h-4" />} label="Website" value={selected.data["website"]} />
                  <FieldRow icon={<Target className="w-4 h-4" />} label="Industry" value={selected.data["industry"]} />
                  <FieldRow icon={<Target className="w-4 h-4" />} label="Goals" value={selected.data["goals"]} />
                  <FieldRow icon={<Wallet className="w-4 h-4" />} label="Budget" value={selected.data["budget"]} />
                  <FieldRow icon={<Clock className="w-4 h-4" />} label="Timeline" value={selected.data["timeline"]} />
                  <FieldRow icon={<Target className="w-4 h-4" />} label="Services" value={selected.data["services"]} />
                  <FieldRow icon={<Globe className="w-4 h-4" />} label="Traffic" value={selected.data["monthlyTraffic"]} />
                  <FieldRow icon={<Globe className="w-4 h-4" />} label="City" value={selected.data["city"]} />
                  <FieldRow icon={<Target className="w-4 h-4" />} label="Service" value={selected.data["service"]} />
                  {selected.data["message"] && (
                    <div className="pt-2 border-t border-[#e0e0e0]">
                      <div className="flex items-start gap-2 text-sm">
                        <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-slate-500 block mb-1">Message:</span>
                          <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{selected.data["message"] as string}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {selected.data["goals"] && (
                    <div className="pt-2">
                      <p className="text-xs text-[#646970] uppercase tracking-wide mb-1">Goals</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(selected.data["goals"] as string[]).map((g, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">{g}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <a
                    href={`mailto:${selected.data["email"] as string}`}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2271b1] text-white text-sm font-medium rounded hover:bg-[#135e96] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Reply via Email
                  </a>
                  {selected.data["phone"] && (
                    <a
                      href={`tel:${selected.data["phone"] as string}`}
                      className="flex items-center gap-2 px-4 py-2 border border-[#c3c4c7] text-[#1d2327] text-sm font-medium rounded hover:bg-[#f0f0f1] transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#c3c4c7] rounded shadow-sm flex items-center justify-center py-20">
                <div className="text-center">
                  <Inbox className="w-8 h-8 text-[#c3c4c7] mx-auto mb-2" />
                  <p className="text-sm text-[#646970]">Select a submission to view details</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
