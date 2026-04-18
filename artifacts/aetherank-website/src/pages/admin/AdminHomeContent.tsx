import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { useCms } from "@/context/CmsContext";
import {
  fetchSettings,
  saveSettings,
  getToken,
  type CmsSettings,
  type HeroContent,
  type StatItem,
  type GrowthPartnerContent,
  type AiAdvantageSectionContent,
  type ServicesSectionContent,
  type WhyChooseUsContent,
  type AboutContent,
  type TestimonialItem,
  type FaqItem,
  DEFAULT_SEO,
  DEFAULT_CONTENT,
  DEFAULT_STATS,
  DEFAULT_GROWTH_PARTNER,
  DEFAULT_AI_ADVANTAGE,
  DEFAULT_SERVICES_SECTION,
  DEFAULT_WHY_CHOOSE_US,
  DEFAULT_ABOUT,
  DEFAULT_TESTIMONIALS,
  DEFAULT_FAQS,
} from "@/lib/cmsApi";
import AdminLayout from "./AdminLayout";
import {
  Home,
  Save,
  Loader2,
  CheckCircle2,
  Eye,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  BarChart2,
  Users,
  Lightbulb,
  Layers,
  Star,
  HelpCircle,
  CheckSquare,
} from "lucide-react";

const inputCls =
  "w-full bg-white border border-[#8c8f94] text-[#1d2327] text-sm rounded px-3 py-1.5 focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] placeholder:text-[#a7aaad] transition-colors";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-[#1d2327] text-xs font-medium">{label}</label>
      {hint && <p className="text-[#646970] text-xs">{hint}</p>}
      {children}
    </div>
  );
}

function AccordionPanel({
  id,
  title,
  subtitle,
  icon,
  badge,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: string;
  open: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#f6f7f7] transition-colors group"
      >
        <div className="flex items-center gap-3">
          <span className="text-[#a7aaad] group-hover:text-emerald-600 transition-colors shrink-0">{icon}</span>
          <div>
            <p className="text-[#1d2327] font-semibold text-sm">{title}</p>
            <p className="text-[#646970] text-xs mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {badge && (
            <span className="text-xs text-[#646970] bg-[#f0f0f1] border border-[#dcdcde] px-2 py-0.5 rounded-full hidden sm:inline">
              {badge}
            </span>
          )}
          {open ? (
            <ChevronUp className="w-4 h-4 text-[#646970]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#646970]" />
          )}
        </div>
      </button>
      {open && (
        <div className="border-t border-[#c3c4c7] p-5 space-y-4 bg-[#f9f9f9]">
          {children}
        </div>
      )}
    </div>
  );
}

export default function AdminHomeContent() {
  const [, navigate] = useLocation();
  const { refreshSettings } = useCms();

  const [hero, setHero] = useState<HeroContent>({ ...DEFAULT_CONTENT.hero });
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS.map((s) => ({ ...s })));
  const [growthPartner, setGrowthPartner] = useState<GrowthPartnerContent>({
    ...DEFAULT_GROWTH_PARTNER,
    pillars: DEFAULT_GROWTH_PARTNER.pillars.map((p) => ({ ...p })),
  });
  const [aiAdvantage, setAiAdvantage] = useState<AiAdvantageSectionContent>({
    ...DEFAULT_AI_ADVANTAGE,
    cards: DEFAULT_AI_ADVANTAGE.cards.map((c) => ({ ...c })),
  });
  const [servicesSection, setServicesSection] = useState<ServicesSectionContent>({
    ...DEFAULT_SERVICES_SECTION,
    cards: DEFAULT_SERVICES_SECTION.cards.map((c) => ({ ...c })),
  });
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsContent>({
    ...DEFAULT_WHY_CHOOSE_US,
    features: DEFAULT_WHY_CHOOSE_US.features.map((f) => ({ ...f })),
  });
  const [about, setAbout] = useState<AboutContent>({
    ...DEFAULT_ABOUT,
    points: [...DEFAULT_ABOUT.points],
  });
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(
    DEFAULT_TESTIMONIALS.map((t) => ({ ...t }))
  );
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS.map((f) => ({ ...f })));

  const [open, setOpen] = useState<string>("hero");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const toggle = useCallback((id: string) => {
    setOpen((prev) => (prev === id ? "" : id));
  }, []);

  useEffect(() => {
    if (!getToken()) { navigate("/admin"); return; }
    fetchSettings().then((s) => {
      if (s?.content?.hero) setHero({ ...DEFAULT_CONTENT.hero, ...s.content.hero });
      if (s?.content?.stats) setStats(s.content.stats);
      if (s?.content?.growth_partner)
        setGrowthPartner({ ...DEFAULT_GROWTH_PARTNER, ...s.content.growth_partner, pillars: s.content.growth_partner.pillars ?? DEFAULT_GROWTH_PARTNER.pillars });
      if (s?.content?.ai_advantage)
        setAiAdvantage({ ...DEFAULT_AI_ADVANTAGE, ...s.content.ai_advantage, cards: s.content.ai_advantage.cards ?? DEFAULT_AI_ADVANTAGE.cards });
      if (s?.content?.services_section)
        setServicesSection({ ...DEFAULT_SERVICES_SECTION, ...s.content.services_section, cards: s.content.services_section.cards ?? DEFAULT_SERVICES_SECTION.cards });
      if (s?.content?.why_choose_us)
        setWhyChooseUs({ ...DEFAULT_WHY_CHOOSE_US, ...s.content.why_choose_us, features: s.content.why_choose_us.features ?? DEFAULT_WHY_CHOOSE_US.features });
      if (s?.content?.about)
        setAbout({ ...DEFAULT_ABOUT, ...s.content.about, points: s.content.about.points ?? DEFAULT_ABOUT.points });
      if (s?.content?.testimonials) setTestimonials(s.content.testimonials);
      if (s?.content?.faqs) setFaqs(s.content.faqs);
      setLoading(false);
    });
  }, [navigate]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSavedMsg("");
    try {
      const current = await fetchSettings();
      const merged: CmsSettings = {
        seo: current?.seo ?? DEFAULT_SEO,
        content: {
          ...(current?.content ?? DEFAULT_CONTENT),
          hero,
          stats,
          growth_partner: growthPartner,
          ai_advantage: aiAdvantage,
          services_section: servicesSection,
          why_choose_us: whyChooseUs,
          about,
          testimonials,
          faqs,
        },
        navigation: current?.navigation,
      };
      await saveSettings(merged);
      await refreshSettings();
      setSavedMsg("Home content saved!");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-[#f0f0f1] min-h-full">
        {/* Page header */}
        <div className="bg-white border-b border-[#c3c4c7] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-[#1d2327] text-xl font-semibold flex items-center gap-2">
              <Home className="w-5 h-5 text-slate-400" /> Home Page Content
            </h1>
            <p className="text-[#646970] text-xs mt-0.5">
              Edit every section of the homepage — expand a section below, make your changes, then Save.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {savedMsg && (
              <span className="flex items-center gap-1.5 text-emerald-600 text-sm">
                <CheckCircle2 className="w-4 h-4" /> {savedMsg}
              </span>
            )}
            {error && <span className="text-red-600 text-sm">{error}</span>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded text-sm transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </div>

        <div className="p-6 max-w-[900px] space-y-2">

          {/* ── 1. Hero ── */}
          <AccordionPanel
            id="hero"
            title="Hero Banner"
            subtitle="Main headline, subheadline, and CTA buttons at the top of the homepage."
            icon={<Eye className="w-4 h-4" />}
            open={open === "hero"}
            onToggle={toggle}
          >
            <Field label="Main Headline" hint="Primary heading — keep it punchy and benefit-focused. ~6–10 words.">
              <input type="text" value={hero.headline} onChange={(e) => setHero({ ...hero, headline: e.target.value })} placeholder="We Drive Real Growth for Ambitious Brands" className={inputCls} />
            </Field>
            <Field label="Subheadline" hint="Supporting sentence that adds context. 1–2 lines maximum.">
              <textarea value={hero.subheadline} onChange={(e) => setHero({ ...hero, subheadline: e.target.value })} rows={3} className={`${inputCls} resize-none`} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Primary CTA Button">
                <input type="text" value={hero.cta_primary} onChange={(e) => setHero({ ...hero, cta_primary: e.target.value })} placeholder="Get Free Audit" className={inputCls} />
              </Field>
              <Field label="Secondary CTA Button">
                <input type="text" value={hero.cta_secondary} onChange={(e) => setHero({ ...hero, cta_secondary: e.target.value })} placeholder="View Our Work" className={inputCls} />
              </Field>
            </div>
            <div className="bg-slate-950 border border-slate-700/50 rounded-lg p-5 mt-1">
              <p className="text-slate-500 text-xs font-medium mb-3 flex items-center gap-1"><Eye className="w-3 h-3" /> Preview</p>
              <h2 className="text-white text-xl font-bold mb-2">{hero.headline || "Your headline here"}</h2>
              <p className="text-slate-400 text-sm mb-3">{hero.subheadline || "Your subheadline here"}</p>
              <div className="flex gap-3">
                <span className="bg-emerald-500 text-slate-950 font-semibold text-sm px-4 py-1.5 rounded-lg">{hero.cta_primary || "CTA 1"}</span>
                <span className="border border-slate-600 text-slate-300 font-medium text-sm px-4 py-1.5 rounded-lg">{hero.cta_secondary || "CTA 2"}</span>
              </div>
            </div>
          </AccordionPanel>

          {/* ── 2. Stats ── */}
          <AccordionPanel
            id="stats"
            title="Stats Bar"
            subtitle="The 4 headline numbers displayed prominently below the hero."
            icon={<BarChart2 className="w-4 h-4" />}
            badge={`${stats.length} stats`}
            open={open === "stats"}
            onToggle={toggle}
          >
            <div className="space-y-3">
              {stats.map((stat, i) => (
                <div key={i} className="flex gap-3 items-end">
                  <Field label={`Stat ${i + 1} Value`}>
                    <input type="text" value={stat.value} onChange={(e) => setStats(stats.map((s, j) => j === i ? { ...s, value: e.target.value } : s))} placeholder="100+" className={inputCls} />
                  </Field>
                  <Field label="Label">
                    <input type="text" value={stat.label} onChange={(e) => setStats(stats.map((s, j) => j === i ? { ...s, label: e.target.value } : s))} placeholder="Brands Scaled" className={inputCls} />
                  </Field>
                  <button onClick={() => setStats(stats.filter((_, j) => j !== i))} className="mb-0.5 p-2.5 rounded border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => setStats([...stats, { value: "", label: "" }])} className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add Stat
            </button>
          </AccordionPanel>

          {/* ── 3. AI Advantage ── */}
          <AccordionPanel
            id="ai_advantage"
            title="AI Advantage Section"
            subtitle="The animated service-stat cards section."
            icon={<Layers className="w-4 h-4" />}
            badge={`${aiAdvantage.cards.length} cards`}
            open={open === "ai_advantage"}
            onToggle={toggle}
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="Section Headline">
                <input type="text" value={aiAdvantage.section_headline} onChange={(e) => setAiAdvantage({ ...aiAdvantage, section_headline: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Section Subheadline">
                <input type="text" value={aiAdvantage.section_subheadline} onChange={(e) => setAiAdvantage({ ...aiAdvantage, section_subheadline: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <p className="text-[#1d2327] text-xs font-semibold uppercase tracking-wide mt-1">Cards</p>
            <div className="space-y-3">
              {aiAdvantage.cards.map((card, i) => (
                <div key={i} className="bg-white border border-[#c3c4c7] rounded p-4 space-y-3 relative">
                  <button onClick={() => setAiAdvantage({ ...aiAdvantage, cards: aiAdvantage.cards.filter((_, j) => j !== i) })} className="absolute top-3 right-3 p-1.5 rounded border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="grid grid-cols-2 gap-3 pr-10">
                    <Field label={`Card ${i + 1} Title`}>
                      <input type="text" value={card.title} onChange={(e) => setAiAdvantage({ ...aiAdvantage, cards: aiAdvantage.cards.map((c, j) => j === i ? { ...c, title: e.target.value } : c) })} className={inputCls} />
                    </Field>
                    <Field label="Description">
                      <input type="text" value={card.desc} onChange={(e) => setAiAdvantage({ ...aiAdvantage, cards: aiAdvantage.cards.map((c, j) => j === i ? { ...c, desc: e.target.value } : c) })} className={inputCls} />
                    </Field>
                    <Field label="Stat Value (e.g. +340%)">
                      <input type="text" value={card.stat} onChange={(e) => setAiAdvantage({ ...aiAdvantage, cards: aiAdvantage.cards.map((c, j) => j === i ? { ...c, stat: e.target.value } : c) })} className={inputCls} />
                    </Field>
                    <Field label="Stat Label (e.g. avg. traffic growth)">
                      <input type="text" value={card.statLabel} onChange={(e) => setAiAdvantage({ ...aiAdvantage, cards: aiAdvantage.cards.map((c, j) => j === i ? { ...c, statLabel: e.target.value } : c) })} className={inputCls} />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setAiAdvantage({ ...aiAdvantage, cards: [...aiAdvantage.cards, { title: "", desc: "", stat: "", statLabel: "" }] })} className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add Card
            </button>
          </AccordionPanel>

          {/* ── 4. Growth Partner ── */}
          <AccordionPanel
            id="growth_partner"
            title="Growth Partner Section"
            subtitle="The 'We Don't Just Run Campaigns' block with approach pillars."
            icon={<Lightbulb className="w-4 h-4" />}
            badge={`${growthPartner.pillars.length} pillars`}
            open={open === "growth_partner"}
            onToggle={toggle}
          >
            <Field label="Headline">
              <input type="text" value={growthPartner.headline} onChange={(e) => setGrowthPartner({ ...growthPartner, headline: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Subheadline">
              <textarea value={growthPartner.subheadline} onChange={(e) => setGrowthPartner({ ...growthPartner, subheadline: e.target.value })} rows={2} className={`${inputCls} resize-none`} />
            </Field>
            <p className="text-[#1d2327] text-xs font-semibold uppercase tracking-wide mt-1">Pillars</p>
            <div className="space-y-3">
              {growthPartner.pillars.map((pillar, i) => (
                <div key={i} className="bg-white border border-[#c3c4c7] rounded p-4 space-y-3 relative">
                  <button onClick={() => setGrowthPartner({ ...growthPartner, pillars: growthPartner.pillars.filter((_, j) => j !== i) })} className="absolute top-3 right-3 p-1.5 rounded border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="grid grid-cols-2 gap-3 pr-10">
                    <Field label={`Pillar ${i + 1} Title`}>
                      <input type="text" value={pillar.title} onChange={(e) => setGrowthPartner({ ...growthPartner, pillars: growthPartner.pillars.map((p, j) => j === i ? { ...p, title: e.target.value } : p) })} className={inputCls} />
                    </Field>
                    <Field label="Description">
                      <textarea value={pillar.desc} onChange={(e) => setGrowthPartner({ ...growthPartner, pillars: growthPartner.pillars.map((p, j) => j === i ? { ...p, desc: e.target.value } : p) })} rows={2} className={`${inputCls} resize-none`} />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setGrowthPartner({ ...growthPartner, pillars: [...growthPartner.pillars, { title: "", desc: "" }] })} className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add Pillar
            </button>
          </AccordionPanel>

          {/* ── 5. Services Section ── */}
          <AccordionPanel
            id="services_section"
            title="Services Grid"
            subtitle="The full-funnel services card grid on the homepage."
            icon={<Layers className="w-4 h-4" />}
            badge={`${servicesSection.cards.length} cards`}
            open={open === "services_section"}
            onToggle={toggle}
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="Section Headline">
                <input type="text" value={servicesSection.headline} onChange={(e) => setServicesSection({ ...servicesSection, headline: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Section Subheadline">
                <input type="text" value={servicesSection.subheadline} onChange={(e) => setServicesSection({ ...servicesSection, subheadline: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <p className="text-[#1d2327] text-xs font-semibold uppercase tracking-wide mt-1">Service Cards</p>
            <div className="space-y-3">
              {servicesSection.cards.map((card, i) => (
                <div key={i} className="bg-white border border-[#c3c4c7] rounded p-4 relative">
                  <button onClick={() => setServicesSection({ ...servicesSection, cards: servicesSection.cards.filter((_, j) => j !== i) })} className="absolute top-3 right-3 p-1.5 rounded border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="grid grid-cols-3 gap-3 pr-10">
                    <Field label={`Card ${i + 1} Title`}>
                      <input type="text" value={card.title} onChange={(e) => setServicesSection({ ...servicesSection, cards: servicesSection.cards.map((c, j) => j === i ? { ...c, title: e.target.value } : c) })} className={inputCls} />
                    </Field>
                    <Field label="Description">
                      <input type="text" value={card.desc} onChange={(e) => setServicesSection({ ...servicesSection, cards: servicesSection.cards.map((c, j) => j === i ? { ...c, desc: e.target.value } : c) })} className={inputCls} />
                    </Field>
                    <Field label="Link (e.g. /services/seo)">
                      <input type="text" value={card.link} onChange={(e) => setServicesSection({ ...servicesSection, cards: servicesSection.cards.map((c, j) => j === i ? { ...c, link: e.target.value } : c) })} className={inputCls} />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setServicesSection({ ...servicesSection, cards: [...servicesSection.cards, { title: "", desc: "", link: "" }] })} className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add Service Card
            </button>
          </AccordionPanel>

          {/* ── 6. Why Choose Us ── */}
          <AccordionPanel
            id="why_choose_us"
            title="Why Choose Us"
            subtitle="Credentials, differentiators and headline stats."
            icon={<CheckSquare className="w-4 h-4" />}
            badge={`${whyChooseUs.features.length} features`}
            open={open === "why_choose_us"}
            onToggle={toggle}
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="Headline">
                <input type="text" value={whyChooseUs.headline} onChange={(e) => setWhyChooseUs({ ...whyChooseUs, headline: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Subheadline">
                <input type="text" value={whyChooseUs.subheadline} onChange={(e) => setWhyChooseUs({ ...whyChooseUs, subheadline: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <p className="text-[#1d2327] text-xs font-semibold uppercase tracking-wide mt-1">Feature Points</p>
            <div className="space-y-3">
              {whyChooseUs.features.map((feat, i) => (
                <div key={i} className="flex gap-3 items-end">
                  <Field label={`Feature ${i + 1} Title`}>
                    <input type="text" value={feat.title} onChange={(e) => setWhyChooseUs({ ...whyChooseUs, features: whyChooseUs.features.map((f, j) => j === i ? { ...f, title: e.target.value } : f) })} className={inputCls} />
                  </Field>
                  <Field label="Description">
                    <input type="text" value={feat.desc} onChange={(e) => setWhyChooseUs({ ...whyChooseUs, features: whyChooseUs.features.map((f, j) => j === i ? { ...f, desc: e.target.value } : f) })} className={inputCls} />
                  </Field>
                  <button onClick={() => setWhyChooseUs({ ...whyChooseUs, features: whyChooseUs.features.filter((_, j) => j !== i) })} className="mb-0.5 p-2.5 rounded border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => setWhyChooseUs({ ...whyChooseUs, features: [...whyChooseUs.features, { title: "", desc: "" }] })} className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add Feature
            </button>
            <p className="text-[#1d2327] text-xs font-semibold uppercase tracking-wide mt-2">Headline Stats</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-3">
                <Field label="Big Stat (e.g. 500%)">
                  <input type="text" value={whyChooseUs.big_stat} onChange={(e) => setWhyChooseUs({ ...whyChooseUs, big_stat: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Big Stat Label">
                  <input type="text" value={whyChooseUs.big_label} onChange={(e) => setWhyChooseUs({ ...whyChooseUs, big_label: e.target.value })} className={inputCls} />
                </Field>
              </div>
              <div className="space-y-3">
                <Field label="Stat 2 Value">
                  <input type="text" value={whyChooseUs.stat2} onChange={(e) => setWhyChooseUs({ ...whyChooseUs, stat2: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Stat 2 Label">
                  <input type="text" value={whyChooseUs.stat2_label} onChange={(e) => setWhyChooseUs({ ...whyChooseUs, stat2_label: e.target.value })} className={inputCls} />
                </Field>
              </div>
              <div className="space-y-3">
                <Field label="Stat 3 Value">
                  <input type="text" value={whyChooseUs.stat3} onChange={(e) => setWhyChooseUs({ ...whyChooseUs, stat3: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Stat 3 Label">
                  <input type="text" value={whyChooseUs.stat3_label} onChange={(e) => setWhyChooseUs({ ...whyChooseUs, stat3_label: e.target.value })} className={inputCls} />
                </Field>
              </div>
            </div>
          </AccordionPanel>

          {/* ── 7. About ── */}
          <AccordionPanel
            id="about"
            title="About Section"
            subtitle="The 'India's Most Trusted' section with bullet points."
            icon={<Users className="w-4 h-4" />}
            badge={`${about.points.length} points`}
            open={open === "about"}
            onToggle={toggle}
          >
            <Field label="Headline">
              <input type="text" value={about.headline} onChange={(e) => setAbout({ ...about, headline: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Subheadline">
              <textarea value={about.subheadline} onChange={(e) => setAbout({ ...about, subheadline: e.target.value })} rows={2} className={`${inputCls} resize-none`} />
            </Field>
            <p className="text-[#1d2327] text-xs font-semibold uppercase tracking-wide mt-1">Bullet Points</p>
            <div className="space-y-2">
              {about.points.map((pt, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={pt} onChange={(e) => setAbout({ ...about, points: about.points.map((p, j) => j === i ? e.target.value : p) })} className={`${inputCls} flex-1`} placeholder={`Point ${i + 1}`} />
                  <button onClick={() => setAbout({ ...about, points: about.points.filter((_, j) => j !== i) })} className="p-2.5 rounded border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => setAbout({ ...about, points: [...about.points, ""] })} className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add Point
            </button>
          </AccordionPanel>

          {/* ── 8. Testimonials ── */}
          <AccordionPanel
            id="testimonials"
            title="Testimonials"
            subtitle="Client reviews shown in the homepage testimonials carousel."
            icon={<Star className="w-4 h-4" />}
            badge={`${testimonials.length} reviews`}
            open={open === "testimonials"}
            onToggle={toggle}
          >
            <div className="space-y-3">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white border border-[#c3c4c7] rounded p-4 space-y-3 relative">
                  <button onClick={() => setTestimonials(testimonials.filter((_, j) => j !== i))} className="absolute top-3 right-3 p-1.5 rounded border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="grid grid-cols-2 gap-3 pr-10">
                    <Field label={`#${i + 1} Client Name`}>
                      <input type="text" value={t.name} onChange={(e) => setTestimonials(testimonials.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} placeholder="Rahul Sharma" className={inputCls} />
                    </Field>
                    <Field label="Company">
                      <input type="text" value={t.company} onChange={(e) => setTestimonials(testimonials.map((x, j) => j === i ? { ...x, company: e.target.value } : x))} placeholder="TechNova India" className={inputCls} />
                    </Field>
                  </div>
                  <Field label="Testimonial Text">
                    <textarea value={t.text} onChange={(e) => setTestimonials(testimonials.map((x, j) => j === i ? { ...x, text: e.target.value } : x))} rows={2} className={`${inputCls} resize-none`} placeholder="What the client said…" />
                  </Field>
                </div>
              ))}
            </div>
            <button onClick={() => setTestimonials([...testimonials, { name: "", company: "", text: "" }])} className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add Testimonial
            </button>
          </AccordionPanel>

          {/* ── 9. FAQs ── */}
          <AccordionPanel
            id="faqs"
            title="FAQs"
            subtitle="Questions shown in the homepage FAQ accordion."
            icon={<HelpCircle className="w-4 h-4" />}
            badge={`${faqs.length} questions`}
            open={open === "faqs"}
            onToggle={toggle}
          >
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white border border-[#c3c4c7] rounded p-4 space-y-3 relative">
                  <button onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} className="absolute top-3 right-3 p-1.5 rounded border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <Field label={`Q${i + 1} Question`}>
                    <input type="text" value={faq.q} onChange={(e) => setFaqs(faqs.map((x, j) => j === i ? { ...x, q: e.target.value } : x))} placeholder="What is your question?" className={`${inputCls} pr-10`} />
                  </Field>
                  <Field label="Answer">
                    <textarea value={faq.a} onChange={(e) => setFaqs(faqs.map((x, j) => j === i ? { ...x, a: e.target.value } : x))} rows={2} className={`${inputCls} resize-none`} placeholder="The answer…" />
                  </Field>
                </div>
              ))}
            </div>
            <button onClick={() => setFaqs([...faqs, { q: "", a: "" }])} className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </AccordionPanel>

          {/* Bottom save */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white font-medium px-5 py-2 rounded text-sm transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
