import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowRight, ChevronDown, Search, MousePointerClick, Share2, Monitor, FileText, Star, Megaphone } from "lucide-react";

const serviceLinks = [
  { name: "SEO & GEO Optimization", path: "/services/seo", icon: Search, desc: "Rank higher on Google & AI search" },
  { name: "Google Ads (PPC)", path: "/services/ppc", icon: MousePointerClick, desc: "Drive paid traffic that converts" },
  { name: "Meta Ads", path: "/services/meta-ads", icon: Megaphone, desc: "Facebook & Instagram advertising" },
  { name: "Social Media", path: "/services/social-media", icon: Share2, desc: "Grow your brand on social" },
  { name: "Web Design & Development", path: "/services/web-design-development", icon: Monitor, desc: "Fast, beautiful websites" },
  { name: "Content Marketing", path: "/services/content-marketing", icon: FileText, desc: "Content that ranks & converts" },
  { name: "ORM", path: "/services/orm", icon: Star, desc: "Protect your online reputation" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [location] = useLocation();
  const servicesRef = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const handleServicesMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    closeTimeout.current = setTimeout(() => setIsServicesOpen(false), 120);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Case Studies", path: "/case-studies" },
    { name: "About Us", path: "/about-us" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location === path;
  const isServicesActive = location.startsWith("/services");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(226,232,240,0.8),0_4px_24px_rgba(0,0,0,0.06)] py-0"
          : "bg-white/80 backdrop-blur-md border-b border-slate-100/80 py-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_4px_12px_rgba(16,185,129,0.35)] group-hover:shadow-[0_6px_16px_rgba(16,185,129,0.45)] transition-shadow">
              <span className="text-white font-black text-lg leading-none">A</span>
            </div>
            <span className="font-extrabold text-[1.15rem] text-slate-900 tracking-tight">
              Aetherank<span className="text-emerald-500">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`relative px-3.5 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                isActive("/")
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Home
              {isActive("/") && <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />}
            </Link>

            {/* Services dropdown */}
            <div
              ref={servicesRef}
              className="relative"
              onMouseEnter={handleServicesMouseEnter}
              onMouseLeave={handleServicesMouseLeave}
            >
              <Link
                href="/services"
                className={`relative flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                  isServicesActive
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Services
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`} />
                {isServicesActive && <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />}
              </Link>

              {/* Dropdown panel */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-72 transition-all duration-200 origin-top ${
                isServicesOpen ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
              }`}>
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden p-2">
                  {serviceLinks.map((s) => (
                    <Link
                      key={s.path}
                      href={s.path}
                      className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors group/item ${
                        isActive(s.path) ? "bg-emerald-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isActive(s.path) ? "bg-emerald-100" : "bg-slate-100 group-hover/item:bg-emerald-100"
                      }`}>
                        <s.icon className={`w-4 h-4 transition-colors ${
                          isActive(s.path) ? "text-emerald-600" : "text-slate-500 group-hover/item:text-emerald-600"
                        }`} />
                      </div>
                      <div>
                        <div className={`text-[13px] font-semibold leading-tight transition-colors ${
                          isActive(s.path) ? "text-emerald-600" : "text-slate-800 group-hover/item:text-emerald-600"
                        }`}>
                          {s.name}
                        </div>
                        <div className="text-[12px] text-slate-500 mt-0.5">{s.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`relative px-3.5 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                  isActive(link.path)
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <Link
              href="/request-proposal"
              className="text-[13.5px] font-semibold text-slate-700 border border-slate-200 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-all duration-150"
            >
              Request Proposal
            </Link>
            <Link
              href="/free-audit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-white text-[13.5px] font-semibold hover:bg-emerald-600 shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] transition-all duration-150 hover:-translate-y-px"
            >
              Get Free Audit
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`block w-5 h-[2px] bg-slate-700 rounded-full transition-all duration-200 ${isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-5 h-[2px] bg-slate-700 rounded-full transition-all duration-200 ${isMobileMenuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-[2px] bg-slate-700 rounded-full transition-all duration-200 ${isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-2xl transition-all duration-300 origin-top overflow-hidden ${
        isMobileMenuOpen ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="px-4 pt-3 pb-5">
          <div className="flex flex-col gap-0.5 mb-4">
            <Link
              href="/"
              className={`flex items-center px-3.5 py-3 rounded-xl text-[14px] font-medium transition-colors ${
                isActive("/") ? "bg-emerald-50 text-emerald-600 font-semibold" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {isActive("/") && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2.5 shrink-0" />}
              Home
            </Link>

            {/* Mobile Services accordion */}
            <div>
              <button
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[14px] font-medium transition-colors ${
                  isServicesActive ? "bg-emerald-50 text-emerald-600 font-semibold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center">
                  {isServicesActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2.5 shrink-0" />}
                  Services
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileServicesOpen ? "rotate-180" : ""}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${isMobileServicesOpen ? "max-h-96" : "max-h-0"}`}>
                <div className="ml-3 pl-3 border-l-2 border-emerald-100 mt-1 mb-1 flex flex-col gap-0.5">
                  {serviceLinks.map((s) => (
                    <Link
                      key={s.path}
                      href={s.path}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                        isActive(s.path) ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <s.icon className="w-4 h-4 shrink-0 text-emerald-500" />
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`flex items-center px-3.5 py-3 rounded-xl text-[14px] font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-emerald-50 text-emerald-600 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {isActive(link.path) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2.5 shrink-0" />
                )}
                {link.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-2.5">
            <Link
              href="/request-proposal"
              className="text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:border-emerald-400 hover:text-emerald-600 transition-colors text-[13px]"
            >
              Request Proposal
            </Link>
            <Link
              href="/free-audit"
              className="text-center py-2.5 rounded-xl bg-emerald-500 text-white font-semibold text-[13px] shadow-[0_4px_14px_rgba(16,185,129,0.3)]"
            >
              Get Free Audit
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
