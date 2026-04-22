import { type ReactNode } from "react";
import { fetchBlogPosts, type BlogPost } from "@/lib/cmsApi";
import { articles } from "@/data/articles";
import { FadeIn } from "./ui/FadeIn";
import { Link } from "wouter";
import { useContactModal } from "./ContactModalContext";
import { motion } from "framer-motion";
import {
  useCompanyStats,
  useGrowthPartner,
  useAiAdvantage,
  useServicesSection,
  useWhyChooseUs,
  useAboutContent,
  useTestimonials,
  useFaqs,
  useContactContent,
  useCaseStudies,
  useNavigation,
} from "@/context/CmsContext";
import { 
  Search, 
  MousePointerClick, 
  Share2, 
  Monitor, 
  PenTool, 
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  TrendingUp,
  Target,
  Users,
  Award,
  ArrowRight,
  Star,
  CheckCircle2,
  Zap,
  Globe,
  HeartHandshake,
  Linkedin,
  Instagram,
  Facebook,
  Clock
} from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useCallback, useState } from "react";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// --- HERO SECTION ---
export function Hero() {
  const avatarSeeds = [
    "/team-avatar-1.png",
    "/team-avatar-2.png",
    "/team-avatar-3.png",
    "/team-avatar-4.png",
  ];

  const certBadges = [
    {
      name: "Google Partner",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
    },
    {
      name: "Meta Business",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
          <path fill="#0866FF" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: "JustDial",
      icon: (
        <svg viewBox="0 0 40 40" className="w-4 h-4" aria-hidden="true">
          <circle cx="20" cy="20" r="20" fill="#FF6B00"/>
          <text x="20" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">JD</text>
        </svg>
      ),
    },
    {
      name: "Clutch.co",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill="#FF3D2E"/>
          <text x="12" y="16.5" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">C</text>
        </svg>
      ),
    },
  ];

  return (
    <section className="relative pt-28 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 bg-[#F8FAFC] overflow-x-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f040_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f040_1px,transparent_1px)] bg-[size:48px_48px] -z-10" />
      {/* Emerald glow top-right */}
      <div className="absolute -top-24 right-0 w-[600px] h-[600px] rounded-full bg-emerald-400/10 blur-[120px] -z-10" />
      {/* Slate glow bottom-left */}
      <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full bg-slate-300/20 blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 xl:gap-16 items-center">

          {/* ── LEFT ── */}
          <div>
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm mb-7"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-emerald-700 tracking-wide uppercase">
                #1 AI Marketing Agency in India
              </span>
            </motion.div>

            {/* H1 — clean 3-line hierarchy */}
            <FadeIn delay={0.1}>
              <h1 className="text-[2.1rem] sm:text-[2.6rem] lg:text-[2.9rem] xl:text-[3.5rem] font-black text-slate-900 leading-[1.12] tracking-tight mb-5">
                Grow Your Business<br />
                with{" "}
                <span className="text-emerald-500">AI-Powered</span><br />
                Digital Marketing
              </h1>
            </FadeIn>

            {/* Subheadline */}
            <FadeIn delay={0.2}>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-7 max-w-lg">
                We help Indian businesses get more leads from Google, Instagram, YouTube & ChatGPT — with zero guesswork and full transparency.
              </p>
            </FadeIn>

            {/* CTA row */}
            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-3 mb-7">
                <Link
                  href="/free-audit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 group w-full sm:w-auto"
                >
                  Get FREE Website Audit
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/request-proposal"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-700 font-bold text-base border border-slate-200 hover:border-emerald-400 hover:text-emerald-600 hover:-translate-y-0.5 transition-all duration-200 shadow-sm w-full sm:w-auto"
                >
                  View Proposal
                </Link>
              </div>
            </FadeIn>

            {/* Social proof row */}
            <FadeIn delay={0.4}>
              <div className="flex flex-wrap items-center gap-3 mb-7">
                <div className="flex -space-x-2.5">
                  {avatarSeeds.map((src, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow ring-1 ring-slate-100">
                      <img loading="lazy" decoding="async" src={src} alt="Client" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-amber-400 mb-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <p className="text-sm font-semibold text-slate-600">
                    Rated 4.9/5 &bull; Trusted by <span className="text-emerald-600 font-bold">100+ brands</span> across India
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Cert badges */}
            <FadeIn delay={0.5}>
              <div className="flex flex-col items-center lg:items-start gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Certified By</span>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {certBadges.map((badge) => (
                    <div
                      key={badge.name}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200/80 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-150"
                    >
                      <span className="shrink-0">{badge.icon}</span>
                      <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

          </div>

          {/* ── RIGHT — Custom Dashboard Mockup ── */}
          <div className="hidden lg:block relative pr-6">
            <FadeIn delay={0.25} direction="left">
              {/* Glow */}
              <div className="absolute -inset-4 bg-emerald-400/10 rounded-3xl blur-2xl" />

              {/* Dashboard card */}
              <div className="relative bg-slate-950 rounded-2xl shadow-2xl border border-white/10 overflow-hidden font-sans">

                {/* ── Header bar ── */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-slate-900/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 text-xs font-bold tracking-wide">LIVE</span>
                    <span className="text-slate-400 text-xs ml-1">Aetherank Analytics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs">Mar 2026</span>
                    <div className="flex gap-1">
                      {["bg-red-500","bg-yellow-400","bg-emerald-500"].map(c => (
                        <span key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── KPI row ── */}
                <div className="grid grid-cols-3 divide-x divide-white/8 border-b border-white/8">
                  {[
                    { label: "Organic Traffic", value: "+340%", sub: "vs last quarter", color: "text-emerald-400" },
                    { label: "Leads / Month",   value: "186",   sub: "+62% vs last mo", color: "text-blue-400" },
                    { label: "Avg. ROAS",       value: "₹4.8",  sub: "per ₹1 spent",   color: "text-violet-400" },
                  ].map(k => (
                    <div key={k.label} className="px-4 py-3.5">
                      <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-1">{k.label}</p>
                      <p className={`text-xl font-black ${k.color} leading-none mb-0.5`}>{k.value}</p>
                      <p className="text-slate-600 text-[10px]">{k.sub}</p>
                    </div>
                  ))}
                </div>

                {/* ── Chart area ── */}
                <div className="px-5 pt-4 pb-2">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-slate-300 text-xs font-semibold">Traffic Overview</p>
                    <div className="flex gap-3">
                      {[["bg-emerald-500","Organic"],["bg-blue-500","Paid"],["bg-violet-500","Social"]].map(([c,l]) => (
                        <div key={l as string} className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${c}`} />
                          <span className="text-slate-500 text-[10px]">{l as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Bar chart — h-28 = 112px; pixel heights so % resolves correctly */}
                  {(() => {
                    const H = 112;
                    const bars = [
                      { o: 30, p: 18, s: 14 },
                      { o: 38, p: 22, s: 17 },
                      { o: 45, p: 20, s: 19 },
                      { o: 52, p: 28, s: 22 },
                      { o: 48, p: 25, s: 20 },
                      { o: 61, p: 32, s: 25 },
                      { o: 72, p: 35, s: 28 },
                      { o: 68, p: 30, s: 26 },
                      { o: 80, p: 40, s: 32 },
                      { o: 88, p: 44, s: 35 },
                      { o: 94, p: 48, s: 38 },
                      { o: 100, p: 52, s: 42 },
                    ];
                    return (
                      <div className="relative h-28 flex items-end gap-1.5">
                        {/* Guide lines */}
                        {[25, 50, 75, 100].map(pct => (
                          <div key={pct} className="absolute left-0 right-0 border-t border-white/[0.06]" style={{ bottom: `${pct}%` }} />
                        ))}
                        {bars.map((bar, i) => (
                          <div key={i} className="flex-1 flex items-end gap-[2px]">
                            <div className="flex-1 rounded-t-sm bg-emerald-500" style={{ height: Math.round(bar.o / 100 * H) }} />
                            <div className="flex-1 rounded-t-sm bg-blue-500/80"   style={{ height: Math.round(bar.p / 100 * H) }} />
                            <div className="flex-1 rounded-t-sm bg-violet-500/70" style={{ height: Math.round(bar.s / 100 * H) }} />
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                  <div className="flex justify-between mt-1.5">
                    {["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"].map(m => (
                      <span key={m} className="text-slate-600 text-[9px] flex-1 text-center">{m}</span>
                    ))}
                  </div>
                </div>

                {/* ── Channel breakdown ── */}
                <div className="grid grid-cols-2 gap-3 px-5 py-4 border-t border-white/8">
                  {[
                    { icon: <Search className="w-3.5 h-3.5" />,         label: "SEO, GEO Rankings",    val: "#1–3",  pct: 82, color: "bg-emerald-500" },
                    { icon: <MousePointerClick className="w-3.5 h-3.5" />, label: "Ad Conversions", val: "4.8×", pct: 74, color: "bg-blue-500" },
                    { icon: <Share2 className="w-3.5 h-3.5" />,          label: "Social Reach",   val: "+3×",  pct: 68, color: "bg-violet-500" },
                    { icon: <TrendingUp className="w-3.5 h-3.5" />,      label: "Lead Quality",   val: "9.1",  pct: 91, color: "bg-amber-400" },
                  ].map(ch => (
                    <div key={ch.label} className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                        {ch.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-400 text-[10px] font-medium truncate">{ch.label}</span>
                          <span className="text-slate-300 text-[10px] font-bold ml-1">{ch.val}</span>
                        </div>
                        <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${ch.color}`} style={{ width: `${ch.pct}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Floating badge — top left */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -left-5 top-10 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 border border-slate-100"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Traffic Growth</p>
                  <p className="text-xl font-black text-slate-900">+340%</p>
                </div>
              </motion.div>

              {/* Floating badge — bottom right */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute -right-5 bottom-14 bg-emerald-500 rounded-2xl px-4 py-3 shadow-xl shadow-emerald-500/30"
              >
                <p className="text-[10px] font-semibold text-emerald-100 uppercase tracking-wide">Leads This Month</p>
                <p className="text-xl font-black text-white">+186 🚀</p>
              </motion.div>

            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}

// --- AI ADVANTAGE BANNER ---
export function AIAdvantage() {
  const aiAdvantage = useAiAdvantage();
  const iconSet = [
    <Search className="w-5 h-5" />,
    <Share2 className="w-5 h-5" />,
    <MousePointerClick className="w-5 h-5" />,
    <Monitor className="w-5 h-5" />,
  ];
  const services = aiAdvantage.cards.map((c, i) => ({
    icon: iconSet[i % iconSet.length],
    title: c.title,
    desc: c.desc,
    stat: c.stat,
    statLabel: c.statLabel,
  }));

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.15),transparent)]" />
      {/* Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-14">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm px-4 py-2 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5 fill-current" /> What We Do
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              {aiAdvantage.section_headline}
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              {aiAdvantage.section_subheadline}
            </p>
          </FadeIn>
        </div>

        {/* Service cards — 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {services.map((s, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="group relative bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] hover:border-emerald-500/40 transition-all duration-300 overflow-hidden">
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-transparent transition-all duration-500 rounded-2xl" />

                <div className="relative flex items-start gap-5">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:bg-emerald-500/25 transition-colors">
                    {s.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg mb-1">{s.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{s.desc}</p>

                    {/* Stat pill */}
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-black text-sm">{s.stat}</span>
                      <span className="text-slate-500 text-xs">{s.statLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <FadeIn delay={0.45}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/[0.04] border border-white/10 rounded-2xl px-7 py-5">
            <div>
              <p className="text-white font-bold text-lg">Ready to start growing?</p>
              <p className="text-slate-400 text-sm">Free audit. No credit card. No commitment.</p>
            </div>
            <Link
              href="/free-audit"
              className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 hover:-translate-y-0.5 shadow-lg shadow-emerald-500/25 transition-all duration-200"
            >
              Get My Free Audit <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}

// --- SEO VS GEO COMPARISON ---
export function SEOvsGEO() {
  type View = "seo" | "compare" | "geo";
  const [view, setView] = useState<View>("compare");

  const dimensions = [
    {
      label: "TARGET",
      seo: { title: "Search Engines", sub: "Google, Bing, Yahoo" },
      geo: { title: "AI Answer Engines", sub: "ChatGPT, Perplexity, Gemini" },
    },
    {
      label: "OPTIMIZATION FOCUS",
      seo: { title: "Keywords", sub: "Exact match, long-tail, LSI" },
      geo: { title: "Intent + Context", sub: "Semantic meaning, user goals" },
    },
    {
      label: "CONTENT FORMAT",
      seo: { title: "Web Pages", sub: "HTML, structured markup" },
      geo: { title: "Structured Data + Entities", sub: "Knowledge graphs, facts, citations" },
    },
    {
      label: "SUCCESS METRICS",
      seo: { title: "Rankings", sub: "Position #1-10, SERP features" },
      geo: { title: "Answer Inclusion Rate", sub: "Citation frequency, source attribution" },
    },
    {
      label: "OPTIMIZATION CYCLE",
      seo: { title: "Weeks to Months", sub: "Algorithm updates, crawl delays" },
      geo: { title: "Days to Weeks", sub: "Real-time model updates" },
    },
    {
      label: "COMPETITIVE MOAT",
      seo: { title: "Backlinks", sub: "Domain authority, trust signals" },
      geo: { title: "Authoritative Content", sub: "Expert positioning, unique data" },
    },
  ];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f030_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f030_1px,transparent_1px)] bg-[size:48px_48px]" />
      {/* Emerald glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-emerald-400/8 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Section heading */}
        <div className="text-center mb-12">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm px-4 py-2 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5 fill-current" /> The Future of Search
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
              Generative Engine Optimization:<br className="hidden sm:block" />
              <span className="text-emerald-500"> The New SEO</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto">
              AI-powered search is transforming how people discover content—and GEO is quickly becoming the must-have capability for 2026. While traditional SEO chases keywords, GEO is built for AI-driven answer engines like ChatGPT, Perplexity, and Google's AI Overviews. With only{" "}
              <span className="text-emerald-600 font-bold">12%</span> of agencies offering GEO today, this is a rare white-space opportunity with surging demand.
            </p>
          </FadeIn>
        </div>

        {/* ── Comparison card ── */}
        <FadeIn delay={0.15}>
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-lg bg-white">

            {/* Header bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-slate-500 text-xs font-bold tracking-widest uppercase truncate">SEO vs GEO — 6 Dimensions</span>
              </div>
              {/* Toggle */}
              <div className="flex items-center bg-slate-200 rounded-lg p-1 gap-1 text-xs self-start sm:self-auto">
                {(["seo", "compare", "geo"] as View[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-md uppercase tracking-wider font-bold transition-all duration-200 flex items-center gap-1 ${
                      view === v
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {v === "compare" && <span className="mr-0.5">⇄</span>}
                    {v.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* ── MOBILE: stacked dimension cards (hidden on md+) ── */}
            <div className="md:hidden divide-y divide-slate-100">
              {dimensions.map((d, i) => (
                <div key={i} className="px-4 py-4 bg-white">
                  <span className="text-slate-400 text-[10px] tracking-widest uppercase font-bold block mb-3">{d.label}</span>
                  <div className={`grid gap-2 ${view === "compare" ? "grid-cols-2" : "grid-cols-1"}`}>
                    {(view === "seo" || view === "compare") && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <div className="text-slate-400 text-[9px] tracking-widest uppercase mb-1.5 font-bold">Traditional SEO</div>
                        <div className="text-slate-800 font-bold text-sm leading-snug">{d.seo.title}</div>
                        <div className="text-slate-500 text-[11px] mt-1">{d.seo.sub}</div>
                      </div>
                    )}
                    {(view === "geo" || view === "compare") && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                        <div className="text-emerald-600 text-[9px] tracking-widest uppercase mb-1.5 font-bold">GEO / AIO</div>
                        <div className="text-emerald-700 font-bold text-sm leading-snug">{d.geo.title}</div>
                        <div className="text-emerald-600 text-[11px] mt-1">{d.geo.sub}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ── DESKTOP: column table (hidden below md) ── */}
            <div className="hidden md:block">
              {/* Column headers */}
              <div className={`grid border-b border-slate-200 ${view === "compare" ? "grid-cols-[200px_1fr_1fr]" : "grid-cols-[200px_1fr]"}`}>
                <div className="py-3 px-5 bg-slate-50 text-slate-400 text-[11px] tracking-widest font-bold uppercase border-r border-slate-200">DIMENSION</div>
                {(view === "seo" || view === "compare") && (
                  <div className="py-3 px-5 bg-white border-r border-slate-200">
                    <div className="text-slate-700 font-bold text-xs tracking-widest uppercase">Traditional SEO</div>
                    <div className="text-slate-400 text-[10px] mt-0.5 tracking-wider uppercase">Legacy Approach</div>
                  </div>
                )}
                {(view === "geo" || view === "compare") && (
                  <div className="py-3 px-5 bg-emerald-50 flex items-start gap-2.5">
                    <span className="w-1 self-stretch shrink-0 rounded-full bg-emerald-500" style={{minHeight:"28px"}} />
                    <div>
                      <div className="text-emerald-700 font-bold text-xs tracking-widest uppercase">GEO / AIO</div>
                      <div className="text-emerald-500 text-[10px] mt-0.5 tracking-wider uppercase">Future Standard ✦</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rows */}
              {dimensions.map((d, i) => (
                <div
                  key={i}
                  className={`grid border-b border-slate-100 hover:bg-slate-50/60 transition-colors duration-150 ${
                    view === "compare" ? "grid-cols-[200px_1fr_1fr]" : "grid-cols-[200px_1fr]"
                  }`}
                >
                  <div className="py-5 px-5 bg-slate-50 flex items-center border-r border-slate-200">
                    <span className="text-slate-500 text-[11px] tracking-widest uppercase font-semibold">{d.label}</span>
                  </div>
                  {(view === "seo" || view === "compare") && (
                    <div className="py-5 px-5 bg-white border-r border-slate-100">
                      <div className="text-slate-800 font-bold text-[15px]">{d.seo.title}</div>
                      <div className="text-slate-500 text-[13px] mt-1 leading-snug">{d.seo.sub}</div>
                    </div>
                  )}
                  {(view === "geo" || view === "compare") && (
                    <div className="py-5 px-5 bg-emerald-50/70">
                      <div className="text-emerald-700 font-bold text-[15px]">{d.geo.title}</div>
                      <div className="text-emerald-600 text-[13px] mt-1 leading-snug">{d.geo.sub}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer bar */}
            <div className="bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span className="text-slate-500 text-xs tracking-wider uppercase">
                  Only <span className="text-amber-600 font-bold">12%</span> of agencies currently offer GEO services
                </span>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-500 text-xs tracking-wider uppercase">
                    Opportunity <span className="text-emerald-600 font-bold">HIGH</span>
                  </span>
                </div>
                <span className="text-slate-400 text-xs tracking-widest hidden sm:inline uppercase">
                  Click ⇄ Compare to toggle views
                </span>
              </div>
            </div>

          </div>
        </FadeIn>

      </div>
    </section>
  );
}

// --- LOCAL SEO CHECKLIST ---
export function LocalSEOChecklist() {
  const rows = [
    {
      bucket: "Website SEO, GEO",
      actions: [
        "Keyword + city in title, H1, and URL on core pages",
        "500+ words per main service/location page",
        "Internal links between service and location pages",
        "NAP in footer; ensure indexing; a few strong local backlinks",
      ],
      why: "Sends clear local relevance + entity signals and lets Google crawl, understand, and trust the site.",
      actionColor: "bg-blue-50 text-blue-700 border-blue-200",
      icon: "🌐",
    },
    {
      bucket: "Google Business",
      actions: [
        "Correct primary category; complete every field; consistent NAP",
        "Review velocity + replies; weekly photos",
        "2–4 posts/month using service + city; accurate hours",
      ],
      why: "GBP is one of the biggest local pack factors — engagement and completeness drive visibility and clicks.",
      actionColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: "📍",
    },
    {
      bucket: "LLM / Entity SEO, GEO",
      actions: [
        "Build structured citations (core + niche + chamber); consistent NAP everywhere",
        "Get into local listicles/roundups; earn unlinked brand mentions",
        "LocalBusiness schema + strong About page; reviews on multiple platforms",
      ],
      why: "Reinforces your business as an entity across the web, feeding Google + LLM understanding and trust.",
      actionColor: "bg-violet-50 text-violet-700 border-violet-200",
      icon: "🤖",
    },
  ];

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(16,185,129,0.08),transparent)]" />
      {/* Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Heading */}
        <div className="text-center mb-12">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm px-4 py-2 rounded-full mb-6">
              <CheckCircle2 className="w-3.5 h-3.5" /> 80/20 Rule Applied
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              Local SEO, GEO <span className="text-emerald-400">Master Checklist</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              The 20% of actions that drive 80% of your local search results. Do these first — in order.
            </p>
          </FadeIn>
        </div>

        {/* ── Mobile: stacked cards ── Desktop: table ── */}
        <FadeIn delay={0.15}>

          {/* MOBILE CARDS (hidden on md+) */}
          <div className="flex flex-col gap-4 md:hidden">
            {rows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
              >
                {/* Card header */}
                <div className="flex items-center gap-3 px-5 py-4 bg-white/[0.04] border-b border-white/[0.07]">
                  <span className="text-2xl">{row.icon}</span>
                  <span className="font-bold text-white text-base">{row.bucket}</span>
                </div>

                {/* Actions */}
                <div className="px-5 py-5 border-b border-white/[0.07]">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                    20% Actions <span className="text-emerald-500">(Do First)</span>
                  </p>
                  <ul className="space-y-2.5 mb-4">
                    {row.actions.map((a, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-slate-300 text-sm leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        {a}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    ✓ Aetherank handles this
                  </span>
                </div>

                {/* Why it matters */}
                <div className="px-5 py-4">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Why It Matters</p>
                  <p className="text-slate-400 text-sm leading-relaxed mb-3">{row.why}</p>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-slate-400">
                    Proven by data
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* DESKTOP TABLE (hidden below md) */}
          <div className="hidden md:block rounded-2xl border border-white/10 overflow-hidden">

            {/* Table header */}
            <div className="grid grid-cols-[160px_1fr_1fr] bg-white/[0.04] border-b border-white/10">
              <div className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Bucket</div>
              <div className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-l border-white/10">
                20% Actions <span className="text-emerald-500">(Do First)</span>
              </div>
              <div className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-l border-white/10">Why It Matters</div>
            </div>

            {/* Rows */}
            {rows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="grid grid-cols-[160px_1fr_1fr] border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.03] transition-colors duration-150"
              >
                {/* Bucket */}
                <div className="px-6 py-6 flex flex-col justify-center gap-2 border-r border-white/[0.06]">
                  <span className="text-2xl">{row.icon}</span>
                  <span className="font-bold text-white text-sm leading-snug">{row.bucket}</span>
                </div>

                {/* Actions */}
                <div className="px-6 py-6 border-r border-white/[0.06]">
                  <ul className="space-y-2.5 mb-4">
                    {row.actions.map((a, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-slate-300 text-sm leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        {a}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    ✓ Aetherank handles this
                  </span>
                </div>

                {/* Why it matters */}
                <div className="px-6 py-6 flex flex-col justify-center gap-4">
                  <p className="text-slate-400 text-sm leading-relaxed">{row.why}</p>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-slate-400 self-start">
                    Proven by data
                  </span>
                </div>
              </motion.div>
            ))}

          </div>
        </FadeIn>

        {/* Bottom CTA strip */}
        <FadeIn delay={0.35}>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/[0.04] border border-white/10 rounded-2xl px-7 py-5">
            <div>
              <p className="text-white font-bold text-lg">Want us to handle your entire local SEO, GEO checklist?</p>
              <p className="text-slate-400 text-sm">We audit, plan, and execute — you just watch the leads come in.</p>
            </div>
            <Link
              href="/free-audit"
              className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 hover:-translate-y-0.5 shadow-lg shadow-emerald-500/25 transition-all duration-200"
            >
              Get My Free SEO, GEO Audit <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}

// --- GROWTH PARTNER SECTION ---
export function GrowthPartner() {
  const rawStats = useCompanyStats();
  const gp = useGrowthPartner();
  const statColors = ["text-emerald-500", "text-blue-500", "text-violet-500", "text-amber-500"];
  const stats = rawStats.map((s, i) => ({ ...s, color: statColors[i % statColors.length] }));
  const pillarIcons = [<Target className="w-5 h-5" />, <Zap className="w-5 h-5" />, <HeartHandshake className="w-5 h-5" />];
  const pillars = gp.pillars.map((p, i) => ({
    icon: pillarIcons[i % pillarIcons.length],
    title: p.title,
    desc: p.desc,
  }));

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative BG word */}
      <div className="absolute -top-4 -left-6 text-[160px] font-black text-slate-50 select-none leading-none pointer-events-none hidden lg:block">
        Agency.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* LEFT — Headline + Pillars */}
          <div>
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 mb-6">
                <Globe className="w-3.5 h-3.5 text-violet-600" />
                <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">Your Growth Partner</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6">
                {gp.headline}
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg text-slate-600 leading-relaxed mb-10">
                {gp.subheadline}
              </p>
            </FadeIn>

            <div className="space-y-5 mb-10">
              {pillars.map((p, i) => (
                <FadeIn key={i} delay={0.3 + i * 0.1}>
                  <div className="flex items-start gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300">
                      {p.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-0.5">{p.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.6}>
              <div className="flex items-center gap-6">
                <Link
                  href="/about-us"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-700 transition-colors"
                >
                  Meet the Team <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/case-studies"
                  className="inline-flex items-center gap-2 font-semibold text-emerald-600 hover:text-emerald-700 text-sm transition-colors"
                >
                  See Our Results <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT — Stats + Testimonial */}
          <FadeIn delay={0.25} direction="left">
            <div className="flex flex-col gap-6">

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`text-4xl font-black mb-1 ${s.color}`}>{s.value}</div>
                    <div className="text-slate-600 text-sm font-semibold">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Testimonial Feature Card */}
              <div className="bg-slate-900 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-white text-lg font-medium leading-relaxed mb-6">
                    "Aetherank increased our monthly leads by 4x in just 90 days. Their AI-powered strategy is unlike anything we'd seen before."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      PS
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">Priya Sharma</div>
                      <div className="text-slate-400 text-xs">Founder, TechNova India</div>
                    </div>
                    <div className="ml-auto">
                      <div className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                        +340% Traffic
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}

// --- SERVICES SECTION ---
const SERVICE_ICONS = [
  <Search className="w-6 h-6" />,
  <MousePointerClick className="w-6 h-6" />,
  <Share2 className="w-6 h-6" />,
  <Monitor className="w-6 h-6" />,
  <PenTool className="w-6 h-6" />,
  <ShieldCheck className="w-6 h-6" />,
];

export function Services() {
  const { openModal } = useContactModal();
  const servicesSection = useServicesSection();
  const services = servicesSection.cards.map((c, i) => ({
    icon: SERVICE_ICONS[i % SERVICE_ICONS.length],
    title: c.title,
    desc: c.desc,
    link: c.link,
  }));

  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              {servicesSection.headline}
            </h2>
            <p className="text-lg text-slate-600">
              {servicesSection.subheadline}
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="group h-full bg-white rounded-2xl p-8 border border-slate-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {service.desc}
                </p>
                <Link
                  href={service.link}
                  className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group/btn"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- STATS & WHY CHOOSE US ---
export function WhyChooseUs() {
  const wcu = useWhyChooseUs();
  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {wcu.headline}
              </h2>
              <p className="text-slate-400 text-lg mb-10">
                {wcu.subheadline}
              </p>
            </FadeIn>
            
            <div className="space-y-6">
              {wcu.features.map((item, i) => (
                <FadeIn key={i} delay={0.1 * i}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mt-1">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">{item.title}</h4>
                      <p className="text-slate-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FadeIn delay={0.2} className="sm:col-span-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center hover:bg-white/15 transition-colors">
                <div className="text-5xl font-black text-emerald-400 mb-2">{wcu.big_stat}</div>
                <div className="text-white font-medium text-lg">{wcu.big_label}</div>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center hover:bg-white/15 transition-colors">
                <div className="text-4xl font-black text-white mb-2">{wcu.stat2}</div>
                <div className="text-slate-300 font-medium">{wcu.stat2_label}</div>
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center hover:bg-white/15 transition-colors">
                <div className="text-4xl font-black text-white mb-2">{wcu.stat3}</div>
                <div className="text-slate-300 font-medium">{wcu.stat3_label}</div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- CASE STUDIES ---
export function CaseStudies() {
  const { openModal } = useContactModal();
  const cases = useCaseStudies().slice(0, 3);

  return (
    <section id="case-studies" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Real Results. Real Growth.
              </h2>
              <p className="text-lg text-slate-600">
                Don't just take our word for it. See how we've helped businesses across India transform their digital presence.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <Link href="/case-studies" className="text-primary font-bold hover:text-slate-900 transition-colors flex items-center">View All Case Studies <ArrowRight className="w-5 h-5 ml-2" /></Link>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <Link href="/case-studies" className="block bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 group cursor-pointer"><div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
                    <img loading="lazy" decoding="async" 
                      src={item.image} 
                      alt={item.client}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-slate-900">
                      {item.timeline}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">{item.client}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-2xl font-black text-primary">{item.metric1}</div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">{item.label1}</div>
                      </div>
                      <div>
                        <div className="text-2xl font-black text-slate-900">{item.metric2}</div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">{item.label2}</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-primary group-hover:translate-x-2 transition-transform inline-flex items-center">
                      Read Full Story <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div></Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- TESTIMONIALS ---
export function Testimonials() {
  const testimonials = useTestimonials();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [Autoplay({ delay: 5000 })]);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Loved by Industry Leaders
            </h2>
            <div className="flex justify-center gap-1 text-amber-400">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" />)}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="embla" ref={emblaRef}>
            <div className="embla__container cursor-grab active:cursor-grabbing">
              {testimonials.map((t, i) => (
                <div className="embla__slide pl-4 lg:pl-8" key={i}>
                  <div className="bg-slate-50 rounded-2xl p-8 h-full border border-slate-100 flex flex-col justify-between">
                    <p className="text-slate-700 text-lg italic mb-8">"{t.text}"</p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{t.name}</h4>
                        <p className="text-sm text-slate-500">{t.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// --- ABOUT US ---
export function About() {
  const rawStats = useCompanyStats();
  const aboutContent = useAboutContent();
  const aboutColors = ["text-emerald-600", "text-blue-600", "text-violet-600", "text-amber-600"];
  const stats = rawStats.map((s, i) => ({ ...s, color: aboutColors[i % aboutColors.length] }));
  const points = aboutContent.points;

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── TOP: Heading centred ── */}
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 mb-5">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">About Aetherank</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
              {aboutContent.headline}
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              {aboutContent.subheadline}
            </p>
          </div>
        </FadeIn>

        {/* ── STATS ROW ── */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((s, i) => (
              <div key={i} className="text-center bg-slate-50 border border-slate-100 rounded-2xl py-7 px-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className={`text-4xl font-black mb-1 ${s.color}`}>{s.value}</div>
                <div className="text-slate-500 text-sm font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ── BOTTOM: Image + Content ── */}
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left — Image */}
          <FadeIn direction="right">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
              <img
                loading="lazy"
                decoding="async"
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=70&auto=format"
                alt="Aetherank Team in India"
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
              {/* Location badge */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider">Mumbai</span>
                  </div>
                  <p className="text-white text-xl font-extrabold">Serving India & Beyond</p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right — Points + CTA */}
          <div>
            <FadeIn delay={0.1}>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-3">
                We're Not Just an Agency —<br />
                <span className="text-emerald-500">We're Your Growth Partner.</span>
              </h3>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                We embed ourselves in your business, learn your goals inside out, and build strategies that actually move the needle — not just vanity metrics.
              </p>
            </FadeIn>

            {/* Check-mark list */}
            <div className="space-y-3 mb-10">
              {points.map((pt, i) => (
                <FadeIn key={i} delay={0.2 + i * 0.08}>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{pt}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* CTAs */}
            <FadeIn delay={0.6}>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/about-us"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-700 transition-colors"
                >
                  Meet the Team <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/case-studies"
                  className="inline-flex items-center gap-2 font-semibold text-emerald-600 hover:text-emerald-700 text-sm transition-colors"
                >
                  See Our Results <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>

      </div>
    </section>
  );
}

// --- BLOG ---
const FALLBACK_BLOGS = articles.slice(0, 3).map((a) => ({
  title: a.title,
  category: a.category,
  date: a.date,
  image: a.image,
  slug: a.slug,
}));

export function Blog() {
  const [posts, setPosts] = useState<{ title: string; category: string; date: string; image: string; slug: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts()
      .then((all) => {
        const published = all
          .filter((p) => p.status === "published")
          .slice(0, 3)
          .map((p) => ({
            title: p.title,
            category: p.category,
            date: new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
            image: p.image || "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&q=70&auto=format",
            slug: p.slug,
          }));
        setPosts(published.length > 0 ? published : FALLBACK_BLOGS);
      })
      .catch(() => setPosts(FALLBACK_BLOGS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="blog" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Latest Insights & Resources
            </h2>
            <p className="text-slate-600 text-lg">Stay ahead of the curve with our expert marketing analysis.</p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 animate-pulse">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-5 bg-slate-200 rounded w-full" />
                    <div className="h-5 bg-slate-200 rounded w-4/5" />
                    <div className="h-4 bg-slate-200 rounded w-1/4 mt-4" />
                  </div>
                </div>
              ))
            : posts.map((blog, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <Link
                    href={blog.slug ? `/blog/${blog.slug}` : "/blog"}
                    className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">{blog.category}</span>
                        <span className="text-sm text-slate-500">{blog.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <span className="font-semibold text-slate-700 flex items-center group-hover:translate-x-2 transition-transform">
                        Read Article <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              ))}
        </div>
      </div>
    </section>
  );
}

// --- HOME FAQ ---
export function HomeFAQ() {
  const faqItems = useFaqs();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">

          {/* ── LEFT ── */}
          <div className="lg:sticky lg:top-28">
            <FadeIn>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                FAQs
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-slate-900 leading-[1.1] tracking-tight mb-5">
                Ready to Grow Your<br />
                <span className="text-emerald-500">Business in 2026?</span>
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                Stop losing customers to your competitors. Let's build a digital strategy that turns your website into a revenue engine.
              </p>

              {/* CTA card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="font-bold text-slate-900 text-base mb-1">Book a Free Strategy Call</p>
                <p className="text-slate-500 text-sm mb-5">
                  Talk to our team before getting started. No pressure, just clarity.
                </p>
                <Link
                  href="/request-proposal"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
                >
                  Request Proposal
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* ── RIGHT — Accordion ── */}
          <div>
            <FadeIn delay={0.1}>
              <div className="divide-y divide-slate-200">
                {faqItems.map((item, i) => (
                  <div key={i} className="py-5">
                    <button
                      onClick={() => setOpen(open === i ? null : i)}
                      className="w-full flex items-center justify-between gap-4 text-left group"
                    >
                      <span className={`text-base font-semibold transition-colors ${open === i ? "text-emerald-600" : "text-slate-800 group-hover:text-emerald-600"}`}>
                        {item.q}
                      </span>
                      <span className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all ${open === i ? "bg-emerald-500 border-emerald-500 text-white rotate-45" : "border-slate-300 text-slate-400"}`}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </span>
                    </button>
                    {open === i && (
                      <p className="mt-3 text-slate-500 text-sm leading-relaxed pr-10">
                        {item.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}

// --- SERVICE FAQ (per-service, accepts custom items + heading) ---
export interface ServiceFaqItem { q: string; a: string; }
interface ServiceFAQProps {
  faqs: ServiceFaqItem[];
  headline: ReactNode;
  subtext?: string;
}
export function ServiceFAQ({ faqs, headline, subtext }: ServiceFAQProps) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-20 lg:py-28 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">

          {/* ── LEFT ── */}
          <div className="lg:sticky lg:top-28">
            <FadeIn>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                FAQs
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-slate-900 leading-[1.1] tracking-tight mb-5">
                {headline}
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                {subtext ?? "Have questions? Here are the most common things our clients ask before getting started."}
              </p>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="font-bold text-slate-900 text-base mb-1">Book a Free Strategy Call</p>
                <p className="text-slate-500 text-sm mb-5">
                  Talk to our team before getting started. No pressure, just clarity.
                </p>
                <Link
                  href="/request-proposal"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
                >
                  Request Proposal
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* ── RIGHT — Accordion ── */}
          <div>
            <FadeIn delay={0.1}>
              <div className="divide-y divide-slate-200">
                {faqs.map((item, i) => (
                  <div key={i} className="py-5">
                    <button
                      onClick={() => setOpen(open === i ? null : i)}
                      className="w-full flex items-center justify-between gap-4 text-left group"
                    >
                      <span className={`text-base font-semibold transition-colors ${open === i ? "text-emerald-600" : "text-slate-800 group-hover:text-emerald-600"}`}>
                        {item.q}
                      </span>
                      <span className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all ${open === i ? "bg-emerald-500 border-emerald-500 text-white rotate-45" : "border-slate-300 text-slate-400"}`}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </span>
                    </button>
                    {open === i && (
                      <p className="mt-3 text-slate-500 text-sm leading-relaxed pr-10">
                        {item.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}

// --- SERVICE RELATED POSTS ---
function categoryMatches(articleCat: string, filterCat: string): boolean {
  const a = articleCat.toLowerCase();
  const f = filterCat.toLowerCase();
  return a === f || a.includes(f) || f.includes(a);
}

const FALLBACK_RELATED = (category: string) =>
  articles
    .filter((a) => categoryMatches(a.category, category))
    .slice(0, 2)
    .map((a) => ({
      id: 0,
      title: a.title,
      slug: a.slug,
      category: a.category,
      excerpt: a.excerpt,
      image: a.image,
      date: a.date,
      readTime: a.readTime,
      author: a.author,
      content: "",
      status: "published" as const,
    }));

export function ServiceRelatedPosts({ category }: { category: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts()
      .then((all) => {
        const matched = all
          .filter((p) => p.status === "published" && categoryMatches(p.category, category))
          .slice(0, 2);
        setPosts(matched.length > 0 ? matched : FALLBACK_RELATED(category));
      })
      .catch(() => setPosts(FALLBACK_RELATED(category)))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading || posts.length === 0) return null;

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Related Reading
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Insights on <span className="text-emerald-500">{category}</span>
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors shrink-0"
            >
              View all articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 gap-8">
          {posts.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.1}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="h-52 overflow-hidden shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-slate-400">{post.date}</span>
                    {post.readTime && (
                      <span className="text-xs text-slate-400 ml-auto">{post.readTime}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <div className="mt-8 sm:hidden text-center">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
            View all articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// --- FINAL CTA ---
export function FinalCTA() {
  const { openModal } = useContactModal();

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <div className="bg-primary rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
            {/* Background pattern inside CTA */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                Ready to Grow Your Business in 2026?
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
                Stop losing customers to your competitors. Let's build a digital strategy that turns your website into a revenue engine.
              </p>
              <Link
                href="/free-audit"
                className="px-10 py-5 rounded-2xl bg-white text-emerald-600 font-black text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center"
              >
                Get a Free Audit
                <ArrowRight className="w-6 h-6 ml-2" />
              </Link>
              <p className="mt-6 text-sm text-primary-foreground/80">No commitment required. 100% Free Audit.</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// --- FOOTER ---
export function Footer() {
  const { openModal } = useContactModal();
  const contact = useContactContent();
  const navigation = useNavigation();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
          
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                <img
                  src="/logo-icon.png"
                  alt="Aetherank logo"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <span className="font-display font-bold text-2xl text-white tracking-tight">
                Aetherank<span className="text-emerald-400">.</span>
              </span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              {contact.footer_tagline || "India's premier AI-powered digital marketing agency. We turn clicks into clients."}
            </p>
            <div className="flex flex-wrap gap-3">
              {contact.instagram && (
                <a href={contact.instagram !== "#" ? contact.instagram : undefined} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-500 hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {contact.facebook && (
                <a href={contact.facebook !== "#" ? contact.facebook : undefined} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#0866FF] hover:text-white transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin !== "#" ? contact.linkedin : undefined} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#0A66C2] hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {contact.twitter && (
                <a href={contact.twitter !== "#" ? contact.twitter : undefined} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-colors">
                  <XIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {navigation.footer_columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.18em] mb-6 flex items-center gap-2">
                <span className="w-5 h-px bg-emerald-400 shrink-0"></span>{col.heading}
              </h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.path}>
                    <Link href={link.path} className="hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.18em] mb-6 flex items-center gap-2">
              <span className="w-5 h-px bg-emerald-400 shrink-0"></span>Contact Us
            </h4>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Mumbai</span>
                  <span>{contact.address_1}</span>
                </div>
              </li>
              {contact.address_2 && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Virar</span>
                    <span>{contact.address_2}</span>
                  </div>
                </li>
              )}
              {contact.address_3 && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">USA</span>
                    <span>{contact.address_3}</span>
                  </div>
                </li>
              )}
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <span>Mon–Fri, 9:30 AM – 6:30 PM</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="hover:text-white transition-colors">{contact.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors break-all">{contact.email}</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2026 Aetherank.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
