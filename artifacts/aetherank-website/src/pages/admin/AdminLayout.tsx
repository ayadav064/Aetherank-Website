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
    path: "/admin/home",
    label: "Home Content",
    icon: Home,
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
    <div className="min-h-screen flex flex-col bg-[#f0f0f1]">
      {/* ── Top Admin Bar ── */}
      <header className="h-9 bg-[#1d2327] flex items-center justify-between px-4 shrink-0 z-50 fixed top-0 left-0 right-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
              <span className="text-slate-950 font-black text-[10px]">A</span>
            </div>
            <span className="text-white text-sm font-semibold">Aetherank CMS</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-slate-400 text-xs">
            <span className="text-slate-600">|</span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors px-2 py-0.5 rounded hover:bg-slate-700"
            >
              <Home className="w-3 h-3" />
              Visit Site
            </a>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors relative">
            <Bell className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded text-xs transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-9">
        {/* ── Left Sidebar ── */}
        <aside className="w-[220px] shrink-0 bg-[#1d2327] min-h-[calc(100vh-36px)] fixed left-0 top-9 bottom-0 overflow-y-auto z-40">
          {/* Site brand */}
          <div className="px-4 py-5 border-b border-[#2c3338]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg">
                <span className="text-slate-950 font-black text-sm">A</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">Aetherank</p>
                <p className="text-[#a7aaad] text-xs mt-0.5">aetherank.com</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="py-2">
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
                    <div
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors border-l-[3px] ${
                        isPageActive
                          ? "bg-[#2c3338] text-white border-emerald-500"
                          : "text-[#a7aaad] border-transparent hover:bg-[#2c3338] hover:text-white"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isPageActive ? "text-emerald-400" : color}`} />
                      {item.label}
                    </div>
                  </Link>
                );
              }

              const isOpen = openGroups[item.label];

              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors border-l-[3px] ${
                      isPageActive
                        ? "bg-[#2c3338] text-white border-emerald-500"
                        : "text-[#a7aaad] border-transparent hover:bg-[#2c3338] hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isPageActive ? "text-emerald-400" : color}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && item.children && (
                    <div className="bg-[#101517]">
                      {item.children.map((child) => {
                        const active = isChildActive(child.path);
                        return (
                          <Link key={child.path} href={child.path}>
                            <div
                              className={`flex items-center gap-2 pl-11 pr-4 py-2 text-xs cursor-pointer transition-colors ${
                                active
                                  ? "text-white bg-[#2c3338]"
                                  : "text-[#a7aaad] hover:bg-[#2c3338] hover:text-white"
                              }`}
                            >
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

          {/* Bottom links */}
          <div className="border-t border-[#2c3338] mt-2 py-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#a7aaad] hover:bg-[#2c3338] hover:text-white transition-colors border-l-[3px] border-transparent"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              View Website
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#a7aaad] hover:bg-red-900/30 hover:text-red-400 transition-colors border-l-[3px] border-transparent"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Log Out
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 ml-[220px] min-h-[calc(100vh-36px)] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
