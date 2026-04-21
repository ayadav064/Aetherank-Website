import { useState } from "react";
import { useLocation, Link } from "wouter";
import { clearToken } from "@/lib/cmsApi";
import {
  LayoutDashboard,
  Search,
  FileText,
  LogOut,
  ExternalLink,
  ChevronDown,
  Home,
  BarChart2,
  Star,
  HelpCircle,
  Layers,
  Globe,
  Users,
  Lightbulb,
  CheckCircle2,
  Info,
  Megaphone,
  Bell,
  User,
  PenLine,
  Plus,
  Inbox,
  Mail,
  ImageIcon,
  Menu,
} from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  children?: { path: string; label: string }[];
}

const NAV: NavItem[] = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/admin/content?s=hero",
    label: "Home Content",
    icon: Home,
    children: [
      { path: "/admin/content?s=hero", label: "Hero Banner" },
      { path: "/admin/content?s=stats", label: "Stats Bar" },
      { path: "/admin/content?s=ai_advantage", label: "AI Advantage" },
      { path: "/admin/content?s=growth_partner", label: "Growth Partner" },
      { path: "/admin/content?s=services_section", label: "Services Grid" },
      { path: "/admin/content?s=why_choose_us", label: "Why Choose Us" },
      { path: "/admin/content?s=about", label: "About Section" },
      { path: "/admin/content?s=testimonials", label: "Testimonials" },
      { path: "/admin/content?s=faqs", label: "FAQs" },
    ],
  },
  {
    path: "/admin/blog",
    label: "Posts",
    icon: PenLine,
    children: [
      { path: "/admin/blog", label: "All Posts" },
      { path: "/admin/blog/new", label: "Add New" },
    ],
  },
  {
    path: "/admin/content?s=page_heroes",
    label: "Pages",
    icon: Globe,
    children: [
      { path: "/admin/content?s=page_heroes", label: "Inner Page Heroes" },
      { path: "/admin/content?s=contact", label: "Contact Info" },
      { path: "/admin/content?s=legal", label: "Legal Pages" },
    ],
  },
  {
    path: "/admin/content?s=service_pages",
    label: "Service Pages",
    icon: Megaphone,
    children: [
      { path: "/admin/content?s=service_pages&p=/services/seo", label: "SEO & GEO" },
      { path: "/admin/content?s=service_pages&p=/services/ppc", label: "PPC & Google Ads" },
      { path: "/admin/content?s=service_pages&p=/services/meta-ads", label: "Meta Ads" },
      { path: "/admin/content?s=service_pages&p=/services/social-media", label: "Social Media" },
      { path: "/admin/content?s=service_pages&p=/services/web-design-development", label: "Web Design & Dev" },
      { path: "/admin/content?s=service_pages&p=/services/content-marketing", label: "Content Marketing" },
      { path: "/admin/content?s=service_pages&p=/services/orm", label: "ORM" },
    ],
  },
  {
    path: "/admin/seo",
    label: "SEO",
    icon: Search,
    children: [
      { path: "/admin/seo?tab=meta", label: "Meta Tags" },
      { path: "/admin/seo?tab=sitemap", label: "Sitemap" },
      { path: "/admin/seo?tab=robots", label: "Robots.txt" },
    ],
  },
  {
    path: "/admin/submissions",
    label: "Submissions",
    icon: Inbox,
  },
  {
    path: "/admin/subscribers",
    label: "Subscribers",
    icon: Mail,
  },
  {
    path: "/admin/media",
    label: "Media",
    icon: ImageIcon,
  },
  {
    path: "/admin/navigation",
    label: "Navigation",
    icon: Menu,
    children: [
      { path: "/admin/navigation?tab=header", label: "Header Menu" },
      { path: "/admin/navigation?tab=footer", label: "Footer Menus" },
    ],
  },
];

const ICON_COLORS: Record<string, string> = {
  Dashboard: "text-sky-400",
  "Home Content": "text-emerald-400",
  Posts: "text-rose-400",
  Pages: "text-blue-400",
  "Service Pages": "text-violet-400",
  SEO: "text-teal-400",
  Submissions: "text-amber-400",
  Subscribers: "text-emerald-400",
  Media: "text-pink-400",
  Navigation: "text-orange-400",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    NAV.forEach((item) => {
      if (item.children) {
        const isActive =
          item.path.startsWith(location) ||
          item.children.some((c) => location.includes(c.path.split("?")[0]));
        initial[item.label] = isActive;
      }
    });
    return initial;
  });

  function handleLogout() {
    clearToken();
    navigate("/admin");
  }

  function toggleGroup(label: string) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  const currentSearch = typeof window !== "undefined" ? window.location.search : "";

  function isChildActive(childPath: string) {
    const [childBase, childQuery] = childPath.split("?");
    if (!location.includes(childBase.replace("/admin/", ""))) return false;
    if (!childQuery) return true;
    return currentSearch.includes(childQuery.split("&")[0].split("=")[1] ?? "");
  }

  return (
    <div className="min-h-screen flex bg-[#f0f0f1]">

      {/* ── Left Sidebar ── */}
      <aside className="w-[240px] shrink-0 flex flex-col fixed left-0 top-0 bottom-0 z-50 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0f1923 0%, #111c27 60%, #0d1a20 100%)" }}>

        {/* ── Brand header ── */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            {/* Favicon logo */}
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-500/30">
              <img src="/favicon.png" alt="Aetherank" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white font-bold text-[15px] leading-none tracking-tight">Aetherank</p>
              <p className="text-emerald-400/70 text-[11px] mt-1 font-medium tracking-wide">CMS Dashboard</p>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-none">
          {NAV.map((item) => {
            const Icon = item.icon;
            const color = ICON_COLORS[item.label] ?? "text-slate-400";
            const isDashboard = !item.children;
            const isPageActive = isDashboard
              ? location === item.path
              : location.includes(item.path.split("?")[0].replace("/admin/", ""));

            if (isDashboard) {
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-150 ${
                    isPageActive
                      ? "bg-emerald-500/15 text-white shadow-sm"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}>
                    <span className={`flex items-center justify-center w-7 h-7 rounded-md shrink-0 transition-colors ${
                      isPageActive ? "bg-emerald-500/20 text-emerald-400" : `bg-white/5 ${color} group-hover:bg-white/10`
                    }`}>
                      <Icon className="w-[15px] h-[15px]" />
                    </span>
                    {item.label}
                    {isPageActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
                  </div>
                </Link>
              );
            }

            const isOpen = openGroups[item.label];

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    isPageActive
                      ? "bg-emerald-500/15 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className={`flex items-center justify-center w-7 h-7 rounded-md shrink-0 transition-colors ${
                    isPageActive ? "bg-emerald-500/20 text-emerald-400" : `bg-white/5 ${color} group-hover:bg-white/10`
                  }`}>
                    <Icon className="w-[15px] h-[15px]" />
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && item.children && (
                  <div className="mt-0.5 ml-3 pl-7 border-l border-white/5 space-y-0.5 pb-1">
                    {item.children.map((child) => {
                      const active = isChildActive(child.path);
                      return (
                        <Link key={child.path} href={child.path}>
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] cursor-pointer transition-all duration-150 ${
                            active
                              ? "text-emerald-400 bg-emerald-500/10 font-semibold"
                              : "text-slate-500 hover:text-white hover:bg-white/5"
                          }`}>
                            <span className={`w-1 h-1 rounded-full shrink-0 ${active ? "bg-emerald-400" : "bg-slate-600"}`} />
                            {child.label}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── Bottom section ── */}
        <div className="px-2 py-3 border-t border-white/5 space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-150"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white/5 shrink-0">
              <ExternalLink className="w-[15px] h-[15px]" />
            </span>
            View Website
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white/5 shrink-0">
              <LogOut className="w-[15px] h-[15px]" />
            </span>
            Log Out
          </button>

          {/* Admin badge */}
          <div className="mt-2 mx-1 px-3 py-2.5 rounded-lg bg-white/4 border border-white/5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-[12px] font-semibold leading-none">Admin</p>
              <p className="text-slate-500 text-[11px] mt-0.5 truncate">aetherank.com</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 ml-[240px] min-h-screen overflow-auto">
        {/* ── Top Bar ── */}
        <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-500 font-medium">Aetherank CMS</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 transition-colors font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Visit Site
            </a>
            <div className="w-px h-4 bg-slate-200" />
            <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
