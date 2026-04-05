import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import {
  fetchSettings,
  getToken,
  type CmsSettings,
  DEFAULT_SEO,
  DEFAULT_CONTENT,
  DEFAULT_TESTIMONIALS,
  DEFAULT_FAQS,
  DEFAULT_SERVICE_PAGES,
} from "@/lib/cmsApi";
import AdminLayout from "./AdminLayout";
import {
  Search,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Globe,
  TrendingUp,
  Edit3,
  Star,
  HelpCircle,
  Megaphone,
  LayoutDashboard,
  ExternalLink,
  Zap,
  Users,
  BarChart2,
  Info,
  Inbox,
  BookOpen,
  Eye,
  Mail,
  PenLine,
  Home,
  MousePointerClick,
  ShieldCheck,
  MonitorSmartphone,
  Newspaper,
  Phone,
  ClipboardList,
  Binoculars,
  Briefcase,
  ChevronDown,
  ChevronRight,
  ImageIcon,
  MessageSquare,
  DollarSign,
  List,
  Settings,
  Scale,
} from "lucide-react";

interface DashboardStats {
  blog: { total: number; published: number; draft: number };
  submissions: {
    total: number;
    unread: number;
    last30Days: number;
    byType: { type: string; count: number }[];
    recent: Array<{ id: string; type: string; data: Record<string, unknown>; read: boolean; createdAt: string }>;
  };
  analytics: { totalViews: number; last30Days: number; topPages: Array<{ path: string; views: number }> };
}

interface EditableSection {
  label: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}

interface PageEntry {
  label: string;
  path: string;
  icon: React.FC<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  desc: string;
  sections: EditableSection[];
  children?: PageEntry[];
  viewHref?: string;
}

const PAGES: PageEntry[] = [
  {
    label: "Home",
    path: "/",
    viewHref: "/",
    icon: Home,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    desc: "Hero, stats, services overview, testimonials & FAQs",
    sections: [
      { label: "Hero & Headlines", href: "/admin/home", icon: ImageIcon },
      { label: "Stats & Numbers", href: "/admin/home", icon: BarChart2 },
      { label: "Testimonials", href: "/admin/content?s=testimonials", icon: Star },
      { label: "FAQs", href: "/admin/content?s=faqs", icon: HelpCircle },
      { label: "Contact Info", href: "/admin/content?s=contact", icon: Phone },
    ],
  },
  {
    label: "Services",
    path: "/services",
    viewHref: "/services",
    icon: Briefcase,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
    desc: "All 6 service offerings — each has its own editable page",
    sections: [
      { label: "Page Heroes", href: "/admin/content?s=page_heroes", icon: ImageIcon },
    ],
    children: [
      {
        label: "SEO & GEO Optimization",
        path: "/services/seo",
        viewHref: "/services/seo",
        icon: Search,
        iconColor: "text-teal-600",
        iconBg: "bg-teal-50",
        desc: "Rank higher on Google & AI search engines",
        sections: [
          { label: "Benefits", href: "/admin/content?s=service_pages&p=/services/seo", icon: CheckCircle2 },
          { label: "Process Steps", href: "/admin/content?s=service_pages&p=/services/seo", icon: List },
          { label: "Pricing", href: "/admin/content?s=service_pages&p=/services/seo", icon: DollarSign },
          { label: "FAQs", href: "/admin/content?s=service_pages&p=/services/seo", icon: HelpCircle },
        ],
      },
      {
        label: "Google Ads (PPC)",
        path: "/services/ppc",
        viewHref: "/services/ppc",
        icon: MousePointerClick,
        iconColor: "text-sky-600",
        iconBg: "bg-sky-50",
        desc: "Drive paid traffic that converts into leads",
        sections: [
          { label: "Benefits", href: "/admin/content?s=service_pages&p=/services/ppc", icon: CheckCircle2 },
          { label: "Process Steps", href: "/admin/content?s=service_pages&p=/services/ppc", icon: List },
          { label: "Pricing", href: "/admin/content?s=service_pages&p=/services/ppc", icon: DollarSign },
          { label: "FAQs", href: "/admin/content?s=service_pages&p=/services/ppc", icon: HelpCircle },
        ],
      },
      {
        label: "Social Media Marketing",
        path: "/services/social-media",
        viewHref: "/services/social-media",
        icon: Users,
        iconColor: "text-pink-600",
        iconBg: "bg-pink-50",
        desc: "Grow your brand across Instagram, LinkedIn & more",
        sections: [
          { label: "Benefits", href: "/admin/content?s=service_pages&p=/services/social-media", icon: CheckCircle2 },
          { label: "Process Steps", href: "/admin/content?s=service_pages&p=/services/social-media", icon: List },
          { label: "Pricing", href: "/admin/content?s=service_pages&p=/services/social-media", icon: DollarSign },
          { label: "FAQs", href: "/admin/content?s=service_pages&p=/services/social-media", icon: HelpCircle },
        ],
      },
      {
        label: "Web Design & Development",
        path: "/services/web-design-development",
        viewHref: "/services/web-design-development",
        icon: MonitorSmartphone,
        iconColor: "text-indigo-600",
        iconBg: "bg-indigo-50",
        desc: "Fast, beautiful, conversion-optimised websites",
        sections: [
          { label: "Benefits", href: "/admin/content?s=service_pages&p=/services/web-design-development", icon: CheckCircle2 },
          { label: "Process Steps", href: "/admin/content?s=service_pages&p=/services/web-design-development", icon: List },
          { label: "Pricing", href: "/admin/content?s=service_pages&p=/services/web-design-development", icon: DollarSign },
          { label: "FAQs", href: "/admin/content?s=service_pages&p=/services/web-design-development", icon: HelpCircle },
        ],
      },
      {
        label: "Content Marketing",
        path: "/services/content-marketing",
        viewHref: "/services/content-marketing",
        icon: Newspaper,
        iconColor: "text-amber-600",
        iconBg: "bg-amber-50",
        desc: "Content that ranks on Google and converts visitors",
        sections: [
          { label: "Benefits", href: "/admin/content?s=service_pages&p=/services/content-marketing", icon: CheckCircle2 },
          { label: "Process Steps", href: "/admin/content?s=service_pages&p=/services/content-marketing", icon: List },
          { label: "Pricing", href: "/admin/content?s=service_pages&p=/services/content-marketing", icon: DollarSign },
          { label: "FAQs", href: "/admin/content?s=service_pages&p=/services/content-marketing", icon: HelpCircle },
        ],
      },
      {
        label: "Online Reputation Management",
        path: "/services/orm",
        viewHref: "/services/orm",
        icon: ShieldCheck,
        iconColor: "text-rose-600",
        iconBg: "bg-rose-50",
        desc: "Protect and grow your online reputation",
        sections: [
          { label: "Benefits", href: "/admin/content?s=service_pages&p=/services/orm", icon: CheckCircle2 },
          { label: "Process Steps", href: "/admin/content?s=service_pages&p=/services/orm", icon: List },
          { label: "Pricing", href: "/admin/content?s=service_pages&p=/services/orm", icon: DollarSign },
          { label: "FAQs", href: "/admin/content?s=service_pages&p=/services/orm", icon: HelpCircle },
        ],
      },
      {
        label: "Meta Ads",
        path: "/services/meta-ads",
        viewHref: "/services/meta-ads",
        icon: Megaphone,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50",
        desc: "Facebook & Instagram advertising that drives revenue",
        sections: [
          { label: "Benefits", href: "/admin/content?s=service_pages&p=/services/meta-ads", icon: CheckCircle2 },
          { label: "Process Steps", href: "/admin/content?s=service_pages&p=/services/meta-ads", icon: List },
          { label: "Pricing", href: "/admin/content?s=service_pages&p=/services/meta-ads", icon: DollarSign },
          { label: "FAQs", href: "/admin/content?s=service_pages&p=/services/meta-ads", icon: HelpCircle },
        ],
      },
    ],
  },
  {
    label: "Case Studies",
    path: "/case-studies",
    viewHref: "/case-studies",
    icon: Binoculars,
    iconColor: "text-cyan-600",
    iconBg: "bg-cyan-50",
    desc: "Client success stories, results & timelines",
    sections: [
      { label: "Case Study Cards", href: "/admin/content?s=case_studies", icon: FileText },
      { label: "Page Hero", href: "/admin/content?s=page_heroes", icon: ImageIcon },
    ],
  },
  {
    label: "About Us",
    path: "/about-us",
    viewHref: "/about-us",
    icon: Info,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    desc: "Company story, team, mission & values",
    sections: [
      { label: "About Content", href: "/admin/content?s=about", icon: FileText },
      { label: "Page Hero", href: "/admin/content?s=page_heroes", icon: ImageIcon },
    ],
  },
  {
    label: "Blog",
    path: "/blog",
    viewHref: "/blog",
    icon: BookOpen,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50",
    desc: "Articles, guides, insights & resources",
    sections: [
      { label: "All Posts", href: "/admin/blog", icon: List },
      { label: "Write New Post", href: "/admin/blog/new", icon: PenLine },
    ],
  },
  {
    label: "Contact",
    path: "/contact",
    viewHref: "/contact",
    icon: Phone,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    desc: "Office addresses, phone, email & social links",
    sections: [
      { label: "Contact Info", href: "/admin/content?s=contact", icon: Phone },
      { label: "Page Hero", href: "/admin/content?s=page_heroes", icon: ImageIcon },
    ],
  },
  {
    label: "Forms & Submissions",
    path: "/admin/submissions",
    viewHref: undefined,
    icon: ClipboardList,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    desc: "Contact, audit & proposal form submissions inbox",
    sections: [
      { label: "View Inbox", href: "/admin/submissions", icon: Inbox },
    ],
  },
  {
    label: "Legal Pages",
    path: "/privacy-policy",
    viewHref: "/privacy-policy",
    icon: Scale,
    iconColor: "text-slate-600",
    iconBg: "bg-slate-100",
    desc: "Privacy policy & terms of service",
    sections: [
      { label: "Privacy Policy", href: "/admin/content?s=legal", icon: FileText },
      { label: "Terms of Service", href: "/admin/content?s=legal", icon: FileText },
    ],
  },
];

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [settings, setSettings] = useState<CmsSettings | null>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [expandedServices, setExpandedServices] = useState(true);

  useEffect(() => {
    if (!getToken()) { navigate("/admin"); return; }
    fetchSettings().then((s) => { setSettings(s); setApiOnline(!!s); });
    const token = getToken();
    if (token) {
      fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((d) => setStats(d as DashboardStats))
        .catch(() => null);
    }
  }, [navigate]);

  const seo = settings?.seo ?? DEFAULT_SEO;
  const content = settings?.content ?? DEFAULT_CONTENT;
  const PAGE_LIST = Object.keys(DEFAULT_SEO);
  const pagesWithTitle = PAGE_LIST.filter((p) => seo[p]?.title?.trim()).length;
  const pagesWithDesc = PAGE_LIST.filter((p) => seo[p]?.description?.trim()).length;
  const testimonialCount = content.testimonials?.length ?? DEFAULT_TESTIMONIALS.length;
  const faqCount = content.faqs?.length ?? DEFAULT_FAQS.length;
  const seoHealth = Math.round(((pagesWithTitle + pagesWithDesc) / (PAGE_LIST.length * 2)) * 100);

  return (
    <AdminLayout>
      <div className="bg-[#f0f0f1] min-h-full">
        {/* Page header */}
        <div className="bg-white border-b border-[#c3c4c7] px-6 py-4 flex items-center justify-between">
          <h1 className="text-[#1d2327] text-xl font-semibold flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-slate-400" />
            Dashboard
          </h1>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#2271b1] hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Website
          </a>
        </div>

        <div className="p-6 space-y-5 max-w-[1200px]">
          {/* API Status */}
          <div className={`flex items-center gap-3 px-4 py-2.5 rounded border text-sm ${
            apiOnline === null ? "bg-white border-[#c3c4c7] text-[#646970]"
            : apiOnline ? "bg-[#edfaef] border-[#68de7c] text-[#1a7a2f]"
            : "bg-[#fcf0e1] border-[#f0c33c] text-[#8a6116]"
          }`}>
            {apiOnline === null ? <AlertCircle className="w-4 h-4 animate-pulse shrink-0" />
              : apiOnline ? <CheckCircle2 className="w-4 h-4 shrink-0" />
              : <AlertCircle className="w-4 h-4 shrink-0" />}
            {apiOnline === null ? "Connecting to server…"
              : apiOnline ? "Connected — all changes save to PostgreSQL."
              : "Server offline — start the API server to save changes."}
          </div>

          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Blog Posts", value: stats.blog.total, sub: `${stats.blog.published} published · ${stats.blog.draft} draft`, icon: BookOpen, color: "blue", href: "/admin/blog" },
                { label: "Submissions", value: stats.submissions.total, sub: `${stats.submissions.unread} unread`, icon: Inbox, color: "emerald", href: "/admin/submissions" },
                { label: "Testimonials", value: testimonialCount, sub: "from CMS", icon: Star, color: "amber", href: "/admin/content?s=testimonials" },
                { label: "SEO Health", value: `${seoHealth}%`, sub: `${pagesWithTitle}/${PAGE_LIST.length} pages have title`, icon: Search, color: "violet", href: "/admin/seo" },
              ].map(({ label, value, sub, icon: Icon, color, href }) => (
                <Link key={label} href={href}>
                  <div className={`bg-white border border-[#c3c4c7] rounded shadow-sm p-4 hover:border-${color}-300 hover:shadow transition-all cursor-pointer group`}>
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-[#646970] text-xs font-medium">{label}</p>
                      <div className={`w-7 h-7 rounded-lg bg-${color}-100 flex items-center justify-center shrink-0`}>
                        <Icon className={`w-3.5 h-3.5 text-${color}-600`} />
                      </div>
                    </div>
                    <p className="text-[#1d2327] text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</p>
                    <p className="text-[#a7aaad] text-xs mt-1">{sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ── Content Map ── */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#c3c4c7] bg-[#f6f7f7] flex items-center justify-between">
              <div>
                <h2 className="text-[#1d2327] font-semibold text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  Pages &amp; Editable Content
                </h2>
                <p className="text-[#646970] text-xs mt-0.5">Every page on your site — click any section to start editing.</p>
              </div>
              <Link href="/admin/seo">
                <span className="flex items-center gap-1 text-xs text-[#2271b1] hover:underline cursor-pointer">
                  <Search className="w-3 h-3" /> SEO Editor
                </span>
              </Link>
            </div>

            <div className="divide-y divide-[#f0f0f1]">
              {PAGES.map((page) => {
                const isServices = page.label === "Services";
                const pageSeo = seo[page.path] ?? {};
                const seoOk = !!(pageSeo.title?.trim() && pageSeo.description?.trim());
                const Icon = page.icon;

                return (
                  <div key={page.label}>
                    {/* ── Page Row ── */}
                    <div className="flex items-start gap-4 px-5 py-4 hover:bg-[#f9f9f9] transition-colors">
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-lg ${page.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className={`w-4.5 h-4.5 ${page.iconColor}`} />
                      </div>

                      {/* Name + desc */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[#1d2327] font-semibold text-sm">{page.label}</span>
                          {page.path !== "/admin/submissions" && (
                            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                              seoOk ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                            }`}>
                              {seoOk ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                              {seoOk ? "SEO ✓" : "SEO missing"}
                            </span>
                          )}
                          {isServices && (
                            <button
                              onClick={() => setExpandedServices((v) => !v)}
                              className="flex items-center gap-0.5 text-[10px] text-[#646970] hover:text-[#2271b1] transition-colors"
                            >
                              {expandedServices ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                              {expandedServices ? "collapse" : "expand"} 6 pages
                            </button>
                          )}
                        </div>
                        <p className="text-[#646970] text-xs mt-0.5">{page.desc}</p>

                        {/* Editable sections as chips */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {page.sections.map((sec) => {
                            const SIcon = sec.icon;
                            return (
                              <Link key={sec.label} href={sec.href}>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#dcdcde] bg-[#f6f7f7] text-[11px] text-[#1d2327] font-medium hover:border-[#2271b1] hover:bg-blue-50 hover:text-[#2271b1] transition-all cursor-pointer">
                                  <SIcon className="w-3 h-3" />
                                  {sec.label}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 mt-0.5">
                        {page.viewHref && (
                          <a
                            href={page.viewHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-[#646970] hover:text-[#2271b1] transition-colors px-2 py-1 rounded hover:bg-[#f0f0f1]"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </a>
                        )}
                        <Link href={page.sections[0]?.href ?? "#"}>
                          <span className="flex items-center gap-1 text-xs bg-[#2271b1] text-white px-2.5 py-1 rounded hover:bg-[#135e96] transition-colors cursor-pointer">
                            <Edit3 className="w-3 h-3" /> Edit
                          </span>
                        </Link>
                      </div>
                    </div>

                    {/* ── Service Children ── */}
                    {isServices && expandedServices && page.children && (
                      <div className="bg-[#f6f7f7] border-t border-[#f0f0f1]">
                        {page.children.map((child, ci) => {
                          const ChildIcon = child.icon;
                          const childSeo = seo[child.path] ?? {};
                          const childSeoOk = !!(childSeo.title?.trim() && childSeo.description?.trim());
                          return (
                            <div
                              key={child.label}
                              className={`flex items-start gap-4 px-5 py-3 hover:bg-[#ebebec] transition-colors ${ci < page.children!.length - 1 ? "border-b border-[#ebebec]" : ""}`}
                            >
                              {/* indent connector */}
                              <div className="w-9 flex items-center justify-center shrink-0 mt-1 relative">
                                <div className="absolute left-4 top-[-12px] bottom-0 w-px bg-[#dcdcde]" />
                                <div className="absolute left-4 top-3 w-3 h-px bg-[#dcdcde]" />
                                <div className={`w-7 h-7 rounded-md ${child.iconBg} flex items-center justify-center z-10`}>
                                  <ChildIcon className={`w-3.5 h-3.5 ${child.iconColor}`} />
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[#1d2327] font-medium text-xs">{child.label}</span>
                                  <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                                    childSeoOk ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                  }`}>
                                    {childSeoOk ? "SEO ✓" : "SEO missing"}
                                  </span>
                                </div>
                                <p className="text-[#a7aaad] text-[11px] mt-0.5">{child.desc}</p>
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {child.sections.map((sec) => {
                                    const SIcon = sec.icon;
                                    return (
                                      <Link key={sec.label} href={sec.href}>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#dcdcde] bg-white text-[10px] text-[#646970] font-medium hover:border-[#2271b1] hover:text-[#2271b1] hover:bg-blue-50 transition-all cursor-pointer">
                                          <SIcon className="w-2.5 h-2.5" />
                                          {sec.label}
                                        </span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {child.viewHref && (
                                  <a
                                    href={child.viewHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-[11px] text-[#646970] hover:text-[#2271b1] transition-colors px-1.5 py-0.5 rounded hover:bg-white"
                                  >
                                    <Eye className="w-3 h-3" /> View
                                  </a>
                                )}
                                <Link href={child.sections[0]?.href ?? "#"}>
                                  <span className="flex items-center gap-1 text-[11px] bg-[#2271b1] text-white px-2 py-0.5 rounded hover:bg-[#135e96] transition-colors cursor-pointer">
                                    <Edit3 className="w-3 h-3" /> Edit
                                  </span>
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Bottom row: Recent Submissions + SEO Table ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Submissions */}
            <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
              <div className="px-4 py-3 border-b border-[#c3c4c7] flex items-center justify-between">
                <h3 className="text-[#1d2327] font-semibold text-sm flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-slate-400" /> Recent Submissions
                </h3>
                <Link href="/admin/submissions">
                  <span className="text-[#2271b1] text-xs hover:underline cursor-pointer">View all →</span>
                </Link>
              </div>
              <div className="divide-y divide-[#f0f0f1]">
                {!stats && <p className="text-[#a7aaad] text-xs text-center py-6">Loading…</p>}
                {stats && stats.submissions.recent.length === 0 && (
                  <p className="text-[#a7aaad] text-xs text-center py-6">No submissions yet.</p>
                )}
                {stats?.submissions.recent.map((s) => {
                  const name = String(s.data["name"] ?? "Unknown");
                  const email = String(s.data["email"] ?? "");
                  const typeLabel = s.type === "contact" ? "Contact" : s.type === "audit" ? "Audit" : "Proposal";
                  const typeColor = s.type === "contact" ? "blue" : s.type === "audit" ? "amber" : "violet";
                  return (
                    <Link key={s.id} href="/admin/submissions">
                      <div className="flex items-start gap-3 px-4 py-3 hover:bg-[#f6f7f7] cursor-pointer">
                        <div className={`w-7 h-7 rounded-full bg-${typeColor}-100 flex items-center justify-center shrink-0 mt-0.5`}>
                          <span className={`text-${typeColor}-600 text-xs font-bold`}>{name[0]?.toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[#1d2327] text-sm font-medium truncate">{name}</p>
                            {!s.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                          </div>
                          <p className="text-[#646970] text-xs truncate">{email}</p>
                        </div>
                        <span className={`text-${typeColor}-600 text-xs bg-${typeColor}-50 border border-${typeColor}-100 px-1.5 py-0.5 rounded-full shrink-0`}>{typeLabel}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* SEO at-a-glance */}
            <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#c3c4c7] flex items-center justify-between">
                <h3 className="text-[#1d2327] font-semibold text-sm flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" /> SEO Status
                </h3>
                <Link href="/admin/seo">
                  <span className="text-[#2271b1] text-xs hover:underline cursor-pointer flex items-center gap-1">
                    <Edit3 className="w-3 h-3" /> Edit All →
                  </span>
                </Link>
              </div>
              {/* progress bar */}
              <div className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[#646970] text-xs">Overall SEO Health</span>
                  <span className={`text-sm font-bold ${seoHealth >= 80 ? "text-emerald-600" : seoHealth >= 50 ? "text-amber-600" : "text-red-600"}`}>
                    {seoHealth}%
                  </span>
                </div>
                <div className="h-2 bg-[#f0f0f1] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${seoHealth >= 80 ? "bg-emerald-500" : seoHealth >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${seoHealth}%` }}
                  />
                </div>
                <p className="text-[#a7aaad] text-xs mt-1.5">{pagesWithTitle} of {Object.keys(DEFAULT_SEO).length} pages have a title · {pagesWithDesc} have a description</p>
              </div>
              <table className="w-full text-xs mt-1">
                <thead>
                  <tr className="border-b border-[#f0f0f1] bg-[#f6f7f7]">
                    <th className="text-left text-[#646970] font-medium px-4 py-2">Page</th>
                    <th className="text-center text-[#646970] font-medium px-2 py-2">Title</th>
                    <th className="text-center text-[#646970] font-medium px-2 py-2">Desc</th>
                    <th className="text-center text-[#646970] font-medium px-2 py-2">Keywords</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f1]">
                  {Object.keys(DEFAULT_SEO).slice(0, 8).map((page) => {
                    const pageSeo = seo[page];
                    return (
                      <tr key={page} className="hover:bg-[#f6f7f7]">
                        <td className="px-4 py-2 font-mono text-[#1d2327]">{page === "/" ? "/ Home" : page.replace("/services/", "↳ ").replace("/", "")}</td>
                        <td className="px-2 py-2 text-center"><SeoStatusDot ok={!!pageSeo?.title?.trim()} /></td>
                        <td className="px-2 py-2 text-center"><SeoStatusDot ok={!!pageSeo?.description?.trim()} /></td>
                        <td className="px-2 py-2 text-center"><SeoStatusDot ok={!!pageSeo?.keywords?.trim()} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {Object.keys(DEFAULT_SEO).length > 8 && (
                <div className="px-4 py-2 border-t border-[#f0f0f1]">
                  <Link href="/admin/seo">
                    <span className="text-[#2271b1] text-xs hover:underline cursor-pointer">+ {Object.keys(DEFAULT_SEO).length - 8} more pages — view all →</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-[#a7aaad] pb-4">
            <span>Aetherank CMS — PostgreSQL</span>
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
              <ExternalLink className="w-3 h-3" /> View your site
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function SeoStatusDot({ ok }: { ok: boolean }) {
  return ok
    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mx-auto" />
    : <div className="w-2.5 h-2.5 rounded-full bg-[#dcdcde] mx-auto" />;
}
