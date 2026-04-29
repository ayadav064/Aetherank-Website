import { Layout } from "@/components/Layout";
import { usePageContent } from "@/context/CmsContext";
import { useAboutPageContent } from "@/context/CmsContext";
import { FadeIn } from "@/components/ui/FadeIn";
import { FinalCTA } from "@/components/Sections";
import { Target, Users, Zap, Heart, CheckCircle2, MapPin, Award, Globe, ArrowRight, IndianRupee, Clock } from "lucide-react";
import { Link } from "wouter";

const STAT_ICONS = [MapPin, Award, Globe, Users];

const VALUE_ICONS = [Target, Users, Zap, Heart];
const VALUE_ACCENTS = ["emerald", "blue", "purple", "rose"];

const INDIA_STAT_ICONS = [IndianRupee, Globe, Award, Clock];

const accentMap: Record<string, { bg: string; text: string; ring: string }> = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100" },
  blue:    { bg: "bg-blue-50",    text: "text-blue-600",    ring: "ring-blue-100" },
  purple:  { bg: "bg-violet-50",  text: "text-violet-600",  ring: "ring-violet-100" },
  rose:    { bg: "bg-rose-50",    text: "text-rose-600",    ring: "ring-rose-100" },
};

export default function AboutPage() {
  const content = usePageContent("/about-us");
  const ap = useAboutPageContent();

  return (
    <Layout>
      <div className="bg-white">

        {/* ── Hero ── */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium border border-emerald-500/30 mb-6">
                Who We Are
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                {content.headline}<br className="hidden sm:block" /> <span className="text-emerald-400">{content.headline_highlight}</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                {content.subheadline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30">
                  {content.cta_text ?? "Work With Us"} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/case-studies" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-600 text-slate-300 font-semibold hover:border-slate-400 hover:text-white transition-colors">
                  See Our Work
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Stats Bar ── */}
        <section className="bg-slate-50 py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.4]"
            style={{ backgroundImage: "radial-gradient(circle, #10b98120 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {ap.stats.map((stat, i) => {
                const Icon = STAT_ICONS[i % STAT_ICONS.length];
                return (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="group bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-6 text-center flex flex-col items-center gap-3 transition-all duration-300 hover:shadow-md shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <Icon className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div className="text-4xl sm:text-5xl font-black text-slate-900 leading-none">{stat.value}</div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest leading-tight">{stat.label}</div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Our Story ── */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-start">
              <FadeIn className="lg:col-span-2 lg:sticky lg:top-28">
                <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Our Story</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-4 leading-tight">
                  From a Simple<br />Observation<br />
                  to a Growth<br />Machine
                </h2>
                <div className="mt-8 w-12 h-1 rounded-full bg-emerald-400" />
              </FadeIn>

              <FadeIn delay={0.1} className="lg:col-span-3">
                <div className="space-y-6 text-[1.05rem] text-slate-600 leading-relaxed">
                  {ap.story_paragraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <blockquote className="mt-8 border-l-4 border-emerald-400 pl-5 py-1">
                  <p className="text-lg font-semibold text-slate-800 italic">
                    "{ap.story_quote}"
                  </p>
                </blockquote>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {ap.story_points.map((point, i) => (
                    <div key={i} className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-slate-100 shadow-sm text-sm font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {point}
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── Meet The Team ── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col lg:flex-row">
                <div className="lg:w-2/5 bg-slate-900 p-10 flex flex-col justify-between gap-8">
                  <div>
                    <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">The People</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 leading-tight">
                      Meet<br />The Team
                    </h2>
                    <p className="text-slate-400 mt-4 leading-relaxed text-sm">
                      A passionate crew of marketers, strategists, designers, and developers — united by one goal: your growth.
                    </p>
                  </div>

                  <div className="space-y-1">
                    {ap.team_roles.map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-700/60 last:border-0">
                        <span className="text-slate-300 text-sm font-medium">{item.label}</span>
                        <span className="text-emerald-400 font-bold text-sm">{item.count}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="text-3xl font-black text-white">{ap.team_total}<span className="text-emerald-400"></span></div>
                    <div className="text-slate-400 text-sm mt-1">Specialists across all disciplines</div>
                  </div>
                </div>

                <div className="lg:w-3/5 bg-amber-50 flex-shrink-0">
                  <img
                    loading="lazy"
                    src="/aetherank-team-art.webp"
                    alt="The Aetherank team illustration"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Core Values ── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">What Drives Us</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-4">Our Core Values</h2>
                <p className="text-slate-500 max-w-xl mx-auto">The principles that guide every decision, every campaign, every client relationship.</p>
              </div>
            </FadeIn>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ap.core_values.map((value, i) => {
                const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
                const accent = VALUE_ACCENTS[i % VALUE_ACCENTS.length];
                const a = accentMap[accent];
                return (
                  <FadeIn key={i} delay={i * 0.08}>
                    <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 h-full hover:shadow-md transition-shadow">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ring-4 ${a.bg} ${a.text} ${a.ring}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{value.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Why India ── */}
        <section className="py-24 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <FadeIn>
                <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Our Advantage</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-8 leading-tight">
                  Why an India-Based Agency?
                </h2>
                <ul className="space-y-5">
                  {ap.india_points.map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-slate-300 text-[1.05rem] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
                    Let's Talk Growth <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </FadeIn>

              <FadeIn delay={0.15}>
                <div className="grid grid-cols-2 gap-4">
                  {ap.india_stats.map((card, i) => {
                    const Icon = INDIA_STAT_ICONS[i % INDIA_STAT_ICONS.length];
                    return (
                      <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col gap-3 hover:border-emerald-500/40 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-2xl font-black text-white">{card.value}</div>
                          <div className="text-sm font-semibold text-slate-200 mt-0.5 leading-snug">{card.label}</div>
                          <div className="text-xs text-slate-500 mt-1">{card.sub}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        <FinalCTA />
      </div>
    </Layout>
  );
}
