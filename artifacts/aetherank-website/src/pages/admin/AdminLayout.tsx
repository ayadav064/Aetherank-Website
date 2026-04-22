import { useState } from "react";
import { useLocation, Link } from "wouter";
import { clearToken } from "@/lib/cmsApi";
import {
  LayoutDashboard,
  Search,
  LogOut,
  ExternalLink,
  ChevronRight,
  Home,
  Globe,
  Megaphone,
  Bell,
  User,
  PenLine,
  Inbox,
  Mail,
  ImageIcon,
  Menu,
  Zap,
} from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  children?: { path: string; label: string }[];
}

const NAV_SECTIONS = [
  {
    label: "GENERAL",
    items: [
      { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      {
        path: "/admin/blog",
        label: "Posts",
        icon: PenLine,
        children: [
          { path: "/admin/blog",     label: "All Posts" },
          { path: "/admin/blog/new", label: "Add New"   },
        ],
      },
      { path: "/admin/submissions", label: "Submissions", icon: Inbox    },
      { path: "/admin/subscribers", label: "Subscribers", icon: Mail     },
      { path: "/admin/media",       label: "Media",       icon: ImageIcon },
    ] as NavItem[],
  },
  {
    label: "CONTENT",
    items: [
      {
        path: "/admin/content?s=hero",
        label: "Home Content",
        icon: Home,
        children: [
          { path: "/admin/content?s=hero",             label: "Hero Banner"    },
          { path: "/admin/content?s=stats",            label: "Stats Bar"      },
          { path: "/admin/content?s=ai_advantage",     label: "AI Advantage"   },
          { path: "/admin/content?s=growth_partner",   label: "Growth Partner" },
          { path: "/admin/content?s=services_section", label: "Services Grid"  },
          { path: "/admin/content?s=why_choose_us",    label: "Why Choose Us"  },
          { path: "/admin/content?s=about",            label: "About Section"  },
          { path: "/admin/content?s=testimonials",     label: "Testimonials"   },
          { path: "/admin/content?s=faqs",             label: "FAQs"           },
        ],
      },
      {
        path: "/admin/content?s=page_heroes",
        label: "Pages",
        icon: Globe,
        children: [
          { path: "/admin/content?s=page_heroes", label: "Page Heroes"  },
          { path: "/admin/content?s=contact",     label: "Contact Info" },
          { path: "/admin/content?s=legal",       label: "Legal Pages"  },
        ],
      },
      {
        path: "/admin/content?s=service_pages",
        label: "Service Pages",
        icon: Megaphone,
        children: [
          { path: "/admin/content?s=service_pages&p=/services/seo",                    label: "SEO & GEO"          },
          { path: "/admin/content?s=service_pages&p=/services/ppc",                    label: "PPC & Google Ads"   },
          { path: "/admin/content?s=service_pages&p=/services/meta-ads",               label: "Meta Ads"           },
          { path: "/admin/content?s=service_pages&p=/services/social-media",           label: "Social Media"       },
          { path: "/admin/content?s=service_pages&p=/services/web-design-development", label: "Web Design & Dev"   },
          { path: "/admin/content?s=service_pages&p=/services/content-marketing",      label: "Content Marketing"  },
          { path: "/admin/content?s=service_pages&p=/services/orm",                    label: "ORM"                },
        ],
      },
    ] as NavItem[],
  },
  {
    label: "SEO & SETTINGS",
    items: [
      {
        path: "/admin/seo",
        label: "SEO",
        icon: Search,
        children: [
          { path: "/admin/seo?tab=meta",    label: "Meta Tags"  },
          { path: "/admin/seo?tab=sitemap", label: "Sitemap"    },
          { path: "/admin/seo?tab=robots",  label: "Robots.txt" },
        ],
      },
      {
        path: "/admin/navigation",
        label: "Navigation",
        icon: Menu,
        children: [
          { path: "/admin/navigation?tab=header", label: "Header Menu"  },
          { path: "/admin/navigation?tab=footer", label: "Footer Menus" },
        ],
      },
    ] as NavItem[],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();

  const allItems = NAV_SECTIONS.flatMap((s) => s.items);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    allItems.forEach((item) => {
      if (item.children) {
        const isActive =
          item.path.startsWith(location) ||
          item.children.some((c) => location.includes(c.path.split("?")[0]));
        initial[item.label] = isActive;
      }
    });
    return initial;
  });

  function handleLogout() { clearToken(); navigate("/admin"); }
  function toggleGroup(label: string) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  const currentSearch = typeof window !== "undefined" ? window.location.search : "";

  function isItemActive(item: NavItem) {
    if (!item.children) return location === item.path;
    return location.includes(item.path.split("?")[0].replace("/admin/", ""));
  }

  function isChildActive(childPath: string) {
    const [childBase, childQuery] = childPath.split("?");
    if (!location.includes(childBase.replace("/admin/", ""))) return false;
    if (!childQuery) return true;
    return currentSearch.includes(childQuery.split("&")[0].split("=")[1] ?? "");
  }

  function NavRow({ item }: { item: NavItem }) {
    const Icon = item.icon;
    const active = isItemActive(item);
    const isOpen = openGroups[item.label];
    const hasChildren = !!item.children;

    if (!hasChildren) {
      return (
        <Link href={item.path}>
          <div className={`flex items-center gap-2.5 px-3 py-[7px] rounded-md text-[13px] font-medium cursor-pointer transition-all duration-100 group ${
            active
              ? "bg-slate-100 text-slate-900"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}>
            <Icon className={`w-[15px] h-[15px] shrink-0 ${active ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-500"}`} />
            <span className="flex-1 truncate">{item.label}</span>
            {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
          </div>
        </Link>
      );
    }

    return (
      <div>
        <button
          onClick={() => toggleGroup(item.label)}
          className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-md text-[13px] font-medium transition-all duration-100 group ${
            active
              ? "bg-slate-100 text-slate-900"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <Icon className={`w-[15px] h-[15px] shrink-0 ${active ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-500"}`} />
          <span className="flex-1 text-left truncate">{item.label}</span>
          <ChevronRight className={`w-3 h-3 shrink-0 text-slate-300 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
        </button>

        {isOpen && (
          <div className="mt-0.5 mb-1 ml-[22px] pl-3.5 border-l-2 border-slate-100 space-y-px">
            {item.children!.map((child) => {
              const childActive = isChildActive(child.path);
              return (
                <Link key={child.path} href={child.path}>
                  <div className={`flex items-center gap-2 px-2 py-[6px] rounded-md text-[12px] cursor-pointer transition-all duration-100 ${
                    childActive
                      ? "text-emerald-700 font-semibold bg-emerald-50"
                      : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${childActive ? "bg-emerald-500" : "bg-slate-200"}`} />
                    {child.label}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">

      {/* ══════════════════ SIDEBAR ══════════════════ */}
      <aside className="w-[232px] shrink-0 flex flex-col fixed left-0 top-0 bottom-0 z-50 bg-white border-r border-slate-200/80 shadow-[1px_0_0_0_rgba(0,0,0,0.04)]">

        {/* ── Brand ── */}
        <div className="px-4 pt-[18px] pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm shadow-emerald-200 shrink-0">
              <Zap className="w-[14px] h-[14px] text-white" strokeWidth={2.5} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-900 font-bold text-[14px] tracking-tight">Aetherank</span>
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.12em] border border-slate-200 rounded px-1 py-px">CMS</span>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-5 scrollbar-none">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="px-3 mb-1 text-[10px] font-bold text-slate-300 uppercase tracking-[0.1em]">
                {section.label}
              </p>
              <div className="space-y-px">
                {section.items.map((item) => (
                  <NavRow key={item.label} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Footer ── */}
        <div className="px-2.5 py-3 border-t border-slate-100 space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-[7px] rounded-md text-[13px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-100"
          >
            <ExternalLink className="w-[15px] h-[15px] text-slate-400 shrink-0" />
            View Website
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-[7px] rounded-md text-[13px] font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-100"
          >
            <LogOut className="w-[15px] h-[15px] shrink-0" />
            Log Out
          </button>

          {/* User card */}
          <div className="mt-2 px-2.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-100">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 text-[12px] font-semibold leading-none">Admin</p>
              <p className="text-slate-400 text-[11px] mt-0.5 truncate">aetherank.com</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ring-2 ring-white shadow-sm" />
          </div>
        </div>
      </aside>

      {/* ══════════════════ MAIN ══════════════════ */}
      <div className="flex-1 ml-[232px] flex flex-col min-h-screen">

        {/* ── Topbar ── */}
        <header className="h-[52px] bg-white/80 backdrop-blur-sm border-b border-slate-200/70 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-slate-400 text-[12px] font-medium">All systems operational</span>
          </div>

          <div className="flex items-center gap-1">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Visit Site
            </a>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell className="w-[15px] h-[15px]" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 ml-1 px-2.5 py-1.5 rounded-lg text-[12px] text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
