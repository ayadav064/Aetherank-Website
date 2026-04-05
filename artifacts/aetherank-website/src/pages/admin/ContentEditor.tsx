import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import {
  fetchSettings,
  saveSettings,
  getToken,
  type CmsSettings,
  type HeroContent,
  type ContactContent,
  type PageHeroContent,
  type StatItem,
  type GrowthPartnerContent,
  type AiAdvantageSectionContent,
  type ServicesSectionContent,
  type WhyChooseUsContent,
  type AboutContent,
  type TestimonialItem,
  type FaqItem,
  type ServicePageData,
  type BenefitItem,
  type ProcessStep,
  type PricingPlan,
  type AboutPageContent,
  type CoreValueItem,
  type CaseStudyItem,
  DEFAULT_SEO,
  DEFAULT_CONTENT,
  DEFAULT_PAGE_CONTENT,
  DEFAULT_STATS,
  DEFAULT_GROWTH_PARTNER,
  DEFAULT_AI_ADVANTAGE,
  DEFAULT_SERVICES_SECTION,
  DEFAULT_WHY_CHOOSE_US,
  DEFAULT_ABOUT,
  DEFAULT_TESTIMONIALS,
  DEFAULT_FAQS,
  DEFAULT_SERVICE_PAGES,
  DEFAULT_ABOUT_PAGE,
  DEFAULT_CASE_STUDIES,
  DEFAULT_BLOG_NEWSLETTER_CTA,
  type BlogNewsletterCta,
} from "@/lib/cmsApi";
import AdminLayout from "./AdminLayout";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  FileText,
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
  Globe,
  Shield,
} from "lucide-react";

const PAGE_LABELS: Record<string, string> = {
  "/services": "Services (Overview)",
  "/services/seo": "SEO & GEO Page",
  "/services/ppc": "PPC & Google Ads Page",
  "/services/meta-ads": "Meta Ads Page",
  "/services/social-media": "Social Media Page",
  "/services/web-design-development": "Web Design & Dev Page",
  "/services/content-marketing": "Content Marketing Page",
  "/services/orm": "ORM Page",
  "/about-us": "About Us Page",
  "/case-studies": "Case Studies Page",
  "/blog": "Blog Page",
  "/free-audit": "Free Audit Page",
  "/request-proposal": "Request Proposal Page",
  "/contact": "Contact Page",
};

const SERVICE_PAGE_LABELS: Record<string, string> = {
  "/services/seo": "SEO & GEO",
  "/services/ppc": "PPC & Google Ads",
  "/services/meta-ads": "Meta Ads",
  "/services/social-media": "Social Media",
  "/services/web-design-development": "Web Design & Dev",
  "/services/content-marketing": "Content Marketing",
  "/services/orm": "ORM",
};

export default function ContentEditor() {
  const [, navigate] = useLocation();

  // Existing state
  const [hero, setHero] = useState<HeroContent>({ ...DEFAULT_CONTENT.hero });
  const [contact, setContact] = useState<ContactContent>({ ...DEFAULT_CONTENT.contact });
  const [pages, setPages] = useState<Record<string, PageHeroContent>>({ ...DEFAULT_PAGE_CONTENT });
  const [expandedPage, setExpandedPage] = useState<string | null>(null);

  // New state — home sections
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

  // Service pages state
  const [servicePages, setServicePages] = useState<Record<string, ServicePageData>>(
    Object.fromEntries(
      Object.entries(DEFAULT_SERVICE_PAGES).map(([k, v]) => [
        k,
        {
          benefits: v.benefits.map((b) => ({ ...b })),
          process_steps: v.process_steps.map((s) => ({ ...s })),
          pricing: v.pricing.map((p) => ({ ...p })),
        },
      ])
    )
  );
  const [expandedServicePage, setExpandedServicePage] = useState<string | null>(null);
  const [expandedServiceTab, setExpandedServiceTab] = useState<"benefits" | "process" | "pricing" | "faqs">("benefits");

  const [privacyHtml, setPrivacyHtml] = useState<string>("");
  const [termsHtml, setTermsHtml] = useState<string>("");

  const [aboutPage, setAboutPage] = useState<AboutPageContent>({
    ...DEFAULT_ABOUT_PAGE,
    stats: DEFAULT_ABOUT_PAGE.stats.map((s) => ({ ...s })),
    story_paragraphs: [...DEFAULT_ABOUT_PAGE.story_paragraphs],
    story_points: [...DEFAULT_ABOUT_PAGE.story_points],
    core_values: DEFAULT_ABOUT_PAGE.core_values.map((v) => ({ ...v })),
    team_roles: DEFAULT_ABOUT_PAGE.team_roles.map((r) => ({ ...r })),
    india_points: [...DEFAULT_ABOUT_PAGE.india_points],
    india_stats: DEFAULT_ABOUT_PAGE.india_stats.map((s) => ({ ...s })),
  });
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>(
    DEFAULT_CASE_STUDIES.map((c) => ({ ...c }))
  );
  const [blogNewsletterCta, setBlogNewsletterCta] = useState<BlogNewsletterCta>({ ...DEFAULT_BLOG_NEWSLETTER_CTA });

  const search = useSearch();
  const urlParams = useMemo(() => new URLSearchParams(search), [search]);
  const urlSection = urlParams.get("s") ?? "hero";
  const urlPage = urlParams.get("p") ?? null;

  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>(urlSection);

  useEffect(() => {
    setActiveSection(urlSection);
    if (urlPage) setExpandedServicePage(urlPage);
  }, [urlSection, urlPage]);

  useEffect(() => {
    if (!getToken()) { navigate("/admin"); return; }
    fetchSettings().then((s) => {
      if (s?.content?.hero) setHero({ ...DEFAULT_CONTENT.hero, ...s.content.hero });
      if (s?.content?.contact) setContact({ ...DEFAULT_CONTENT.contact, ...s.content.contact });
      if (s?.content?.pages) setPages({ ...DEFAULT_PAGE_CONTENT, ...s.content.pages });
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
      if (s?.content?.service_pages)
        setServicePages((prev) => ({ ...prev, ...s.content.service_pages }));
      if (s?.content?.privacy_html) setPrivacyHtml(s.content.privacy_html);
      if (s?.content?.terms_html) setTermsHtml(s.content.terms_html);
      if (s?.content?.about_page) setAboutPage({ ...DEFAULT_ABOUT_PAGE, ...s.content.about_page });
      if (s?.content?.case_studies && s.content.case_studies.length > 0) setCaseStudies(s.content.case_studies);
      if (s?.content?.blog_newsletter_cta) setBlogNewsletterCta({ ...DEFAULT_BLOG_NEWSLETTER_CTA, ...s.content.blog_newsletter_cta });
      setLoading(false);
    });
  }, [navigate]);

  const updatePage = useCallback((path: string, field: keyof PageHeroContent, value: string) => {
    setPages((prev) => ({ ...prev, [path]: { ...prev[path], [field]: value } }));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSavedMsg("");
    try {
      const current = await fetchSettings();
      const merged: CmsSettings = {
        seo: current?.seo ?? DEFAULT_SEO,
        content: {
          hero,
          contact,
          pages,
          stats,
          growth_partner: growthPartner,
          ai_advantage: aiAdvantage,
          services_section: servicesSection,
          why_choose_us: whyChooseUs,
          about,
          testimonials,
          faqs,
          service_pages: servicePages,
          privacy_html: privacyHtml,
          terms_html: termsHtml,
          about_page: aboutPage,
          case_studies: caseStudies,
          blog_newsletter_cta: blogNewsletterCta,
        },
      };
      await saveSettings(merged);
      setSavedMsg("Content saved!");
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
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const navItems = [
    { id: "hero", label: "Home Hero", icon: <Eye className="w-4 h-4" /> },
    { id: "contact", label: "Contact Info", icon: <Globe className="w-4 h-4" /> },
    { id: "stats", label: "Stats Bar", icon: <BarChart2 className="w-4 h-4" /> },
    { id: "growth_partner", label: "Growth Partner", icon: <Lightbulb className="w-4 h-4" /> },
    { id: "ai_advantage", label: "AI Advantage", icon: <Layers className="w-4 h-4" /> },
    { id: "services_section", label: "Services Section", icon: <Layers className="w-4 h-4" /> },
    { id: "why_choose_us", label: "Why Choose Us", icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: "about", label: "About Section", icon: <Users className="w-4 h-4" /> },
    { id: "testimonials", label: "Testimonials", icon: <Star className="w-4 h-4" /> },
    { id: "faqs", label: "FAQs", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "page_heroes", label: "Page Heroes", icon: <FileText className="w-4 h-4" /> },
    { id: "service_pages", label: "Service Pages", icon: <Globe className="w-4 h-4" /> },
    { id: "about_page", label: "About Us Page", icon: <Users className="w-4 h-4" /> },
    { id: "case_studies", label: "Case Studies", icon: <BarChart2 className="w-4 h-4" /> },
    { id: "blog_newsletter_cta", label: "Blog Newsletter CTA", icon: <FileText className="w-4 h-4" /> },
    { id: "legal", label: "Legal Pages", icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <AdminLayout>
      <div className="bg-[#f0f0f1] min-h-full">
        {/* WP-style page header */}
        <div className="bg-white border-b border-[#c3c4c7] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-[#1d2327] text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" /> Content Editor
            </h1>
            <p className="text-[#646970] text-xs mt-0.5">Edit all website copy — sections, service pages, testimonials & more.</p>
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

        <div className="p-6 flex gap-5">
          {/* Secondary nav (section tabs) */}
          <nav className="w-44 shrink-0">
            <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-left transition-colors border-b border-[#f0f0f1] last:border-0 ${
                    activeSection === item.id
                      ? "bg-[#f6f7f7] text-emerald-700 font-semibold border-l-2 border-l-emerald-500"
                      : "text-[#1d2327] hover:bg-[#f6f7f7] hover:text-emerald-700"
                  }`}
                >
                  <span className={`shrink-0 ${activeSection === item.id ? "text-emerald-500" : "text-[#a7aaad]"}`}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Main content */}
          <div className="flex-1 space-y-4">

            {/* ── Home Hero ── */}
            {activeSection === "hero" && (
              <Section title="Home Page Hero" subtitle="Main banner on the homepage — headline, subheadline, and CTA buttons.">
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
                <div className="bg-slate-950 border border-slate-700/50 rounded-xl p-6 mt-2">
                  <p className="text-slate-500 text-xs font-medium mb-4 flex items-center gap-1"><Eye className="w-3 h-3" /> Preview</p>
                  <h2 className="text-white text-2xl font-bold mb-2">{hero.headline || "Your headline here"}</h2>
                  <p className="text-slate-400 text-sm mb-4">{hero.subheadline || "Your subheadline here"}</p>
                  <div className="flex gap-3">
                    <span className="bg-emerald-500 text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg">{hero.cta_primary || "CTA 1"}</span>
                    <span className="border border-slate-600 text-slate-300 font-medium text-sm px-4 py-2 rounded-lg">{hero.cta_secondary || "CTA 2"}</span>
                  </div>
                </div>
              </Section>
            )}

            {/* ── Contact Info ── */}
            {activeSection === "contact" && (
              <Section title="Contact Information" subtitle="Displayed on the Contact page and in the footer.">
                <Field label="Footer Tagline" hint="Short description shown under the logo in the website footer.">
                  <textarea rows={2} value={contact.footer_tagline ?? ""} onChange={(e) => setContact({ ...contact, footer_tagline: e.target.value })} placeholder="India's premier AI-powered digital marketing agency. We turn clicks into clients." className={inputCls} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Email Address">
                    <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="help@aetherank.com" className={inputCls} />
                  </Field>
                  <Field label="Phone Number">
                    <input type="text" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+91 80109 60269" className={inputCls} />
                  </Field>
                </div>
                <Field label="Office Address 1" hint="First office address shown on the Contact page and footer.">
                  <input type="text" value={contact.address_1} onChange={(e) => setContact({ ...contact, address_1: e.target.value })} placeholder="Tardeo AC Market, Mumbai — 400034" className={inputCls} />
                </Field>
                <Field label="Office Address 2" hint="Second office address (leave blank to hide).">
                  <input type="text" value={contact.address_2} onChange={(e) => setContact({ ...contact, address_2: e.target.value })} placeholder="Rustomjee Global City, Virar West — 401303" className={inputCls} />
                </Field>
                <Field label="Headquarters Address" hint="HQ address shown in footer and contact page (leave blank to hide).">
                  <input type="text" value={contact.address_3 ?? ""} onChange={(e) => setContact({ ...contact, address_3: e.target.value })} placeholder="2906 Bull Run Ct, Missouri City, TX, USA 77459" className={inputCls} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Logo Image URL" hint="Paste a URL to your logo image (PNG/SVG). Shown in the navbar and footer. Leave blank to use the default text logo.">
                    <input type="url" value={contact.logo_url ?? ""} onChange={(e) => setContact({ ...contact, logo_url: e.target.value })} placeholder="https://yourdomain.com/logo.png" className={inputCls} />
                  </Field>
                  <Field label="Favicon URL" hint="Paste a URL to your favicon (ICO/PNG/SVG). Leave blank to use the default Aetherank icon.">
                    <input type="url" value={contact.favicon_url ?? ""} onChange={(e) => setContact({ ...contact, favicon_url: e.target.value })} placeholder="https://yourdomain.com/favicon.ico" className={inputCls} />
                  </Field>
                </div>
                <p className="text-[#646970] text-xs font-medium uppercase tracking-wide pt-2">Social Media Links <span className="normal-case font-normal">(leave blank to hide icon)</span></p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="LinkedIn URL">
                    <input type="url" value={contact.linkedin ?? ""} onChange={(e) => setContact({ ...contact, linkedin: e.target.value })} placeholder="https://linkedin.com/company/aetherank" className={inputCls} />
                  </Field>
                  <Field label="Twitter / X URL">
                    <input type="url" value={contact.twitter ?? ""} onChange={(e) => setContact({ ...contact, twitter: e.target.value })} placeholder="https://twitter.com/aetherank" className={inputCls} />
                  </Field>
                  <Field label="Instagram URL">
                    <input type="url" value={contact.instagram ?? ""} onChange={(e) => setContact({ ...contact, instagram: e.target.value })} placeholder="https://instagram.com/aetherank" className={inputCls} />
                  </Field>
                  <Field label="Facebook URL">
                    <input type="url" value={contact.facebook ?? ""} onChange={(e) => setContact({ ...contact, facebook: e.target.value })} placeholder="https://facebook.com/aetherank" className={inputCls} />
                  </Field>
                </div>
              </Section>
            )}

            {/* ── Stats Bar ── */}
            {activeSection === "stats" && (
              <Section title="Company Stats Bar" subtitle="The 4 headline numbers displayed prominently on the homepage.">
                {stats.map((stat, i) => (
                  <div key={i} className="flex gap-3 items-end">
                    <Field label={`Stat ${i + 1} — Value`}>
                      <input type="text" value={stat.value} onChange={(e) => setStats(stats.map((s, j) => j === i ? { ...s, value: e.target.value } : s))} placeholder="100+" className={inputCls} />
                    </Field>
                    <Field label="Label">
                      <input type="text" value={stat.label} onChange={(e) => setStats(stats.map((s, j) => j === i ? { ...s, label: e.target.value } : s))} placeholder="Brands Scaled" className={inputCls} />
                    </Field>
                    <button onClick={() => setStats(stats.filter((_, j) => j !== i))} className="mb-0.5 p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={() => setStats([...stats, { value: "", label: "" }])} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  <Plus className="w-4 h-4" /> Add Stat
                </button>
              </Section>
            )}

            {/* ── Growth Partner ── */}
            {activeSection === "growth_partner" && (
              <Section title="Growth Partner Section" subtitle="The 'We Don't Just Run Campaigns' section with pillars.">
                <Field label="Headline">
                  <input type="text" value={growthPartner.headline} onChange={(e) => setGrowthPartner({ ...growthPartner, headline: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Subheadline">
                  <textarea value={growthPartner.subheadline} onChange={(e) => setGrowthPartner({ ...growthPartner, subheadline: e.target.value })} rows={3} className={`${inputCls} resize-none`} />
                </Field>
                <p className="text-slate-400 text-sm font-medium mt-2">Pillars</p>
                {growthPartner.pillars.map((pillar, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-xl p-4 space-y-3 relative">
                    <button onClick={() => setGrowthPartner({ ...growthPartner, pillars: growthPartner.pillars.filter((_, j) => j !== i) })} className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Field label={`Pillar ${i + 1} Title`}>
                      <input type="text" value={pillar.title} onChange={(e) => setGrowthPartner({ ...growthPartner, pillars: growthPartner.pillars.map((p, j) => j === i ? { ...p, title: e.target.value } : p) })} className={inputCls} />
                    </Field>
                    <Field label="Description">
                      <textarea value={pillar.desc} onChange={(e) => setGrowthPartner({ ...growthPartner, pillars: growthPartner.pillars.map((p, j) => j === i ? { ...p, desc: e.target.value } : p) })} rows={2} className={`${inputCls} resize-none`} />
                    </Field>
                  </div>
                ))}
                <button onClick={() => setGrowthPartner({ ...growthPartner, pillars: [...growthPartner.pillars, { title: "", desc: "" }] })} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  <Plus className="w-4 h-4" /> Add Pillar
                </button>
              </Section>
            )}

            {/* ── AI Advantage Section ── */}
            {activeSection === "ai_advantage" && (
              <Section title="AI Advantage / Services Cards" subtitle="The animated cards section showing service stats.">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Section Headline">
                    <input type="text" value={aiAdvantage.section_headline} onChange={(e) => setAiAdvantage({ ...aiAdvantage, section_headline: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="Section Subheadline">
                    <input type="text" value={aiAdvantage.section_subheadline} onChange={(e) => setAiAdvantage({ ...aiAdvantage, section_subheadline: e.target.value })} className={inputCls} />
                  </Field>
                </div>
                <p className="text-slate-400 text-sm font-medium mt-2">Cards</p>
                {aiAdvantage.cards.map((card, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-xl p-4 space-y-3 relative">
                    <button onClick={() => setAiAdvantage({ ...aiAdvantage, cards: aiAdvantage.cards.filter((_, j) => j !== i) })} className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
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
                <button onClick={() => setAiAdvantage({ ...aiAdvantage, cards: [...aiAdvantage.cards, { title: "", desc: "", stat: "", statLabel: "" }] })} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  <Plus className="w-4 h-4" /> Add Card
                </button>
              </Section>
            )}

            {/* ── Services Section ── */}
            {activeSection === "services_section" && (
              <Section title="Services Section" subtitle="The full-funnel services grid on the homepage.">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Section Headline">
                    <input type="text" value={servicesSection.headline} onChange={(e) => setServicesSection({ ...servicesSection, headline: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="Section Subheadline">
                    <input type="text" value={servicesSection.subheadline} onChange={(e) => setServicesSection({ ...servicesSection, subheadline: e.target.value })} className={inputCls} />
                  </Field>
                </div>
                <p className="text-slate-400 text-sm font-medium mt-2">Service Cards</p>
                {servicesSection.cards.map((card, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-xl p-4 space-y-3 relative">
                    <button onClick={() => setServicesSection({ ...servicesSection, cards: servicesSection.cards.filter((_, j) => j !== i) })} className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="grid grid-cols-3 gap-3">
                      <Field label={`Card ${i + 1} Title`}>
                        <input type="text" value={card.title} onChange={(e) => setServicesSection({ ...servicesSection, cards: servicesSection.cards.map((c, j) => j === i ? { ...c, title: e.target.value } : c) })} className={inputCls} />
                      </Field>
                      <Field label="Description">
                        <input type="text" value={card.desc} onChange={(e) => setServicesSection({ ...servicesSection, cards: servicesSection.cards.map((c, j) => j === i ? { ...c, desc: e.target.value } : c) })} className={inputCls} />
                      </Field>
                      <Field label="Link Path (e.g. /services/seo)">
                        <input type="text" value={card.link} onChange={(e) => setServicesSection({ ...servicesSection, cards: servicesSection.cards.map((c, j) => j === i ? { ...c, link: e.target.value } : c) })} className={inputCls} />
                      </Field>
                    </div>
                  </div>
                ))}
                <button onClick={() => setServicesSection({ ...servicesSection, cards: [...servicesSection.cards, { title: "", desc: "", link: "" }] })} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  <Plus className="w-4 h-4" /> Add Service Card
                </button>
              </Section>
            )}

            {/* ── Why Choose Us ── */}
            {activeSection === "why_choose_us" && (
              <Section title="Why Choose Us" subtitle="The credentials and differentiators section.">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Headline">
                    <input type="text" value={whyChooseUs.headline} onChange={(e) => setWhyChooseUs({ ...whyChooseUs, headline: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="Subheadline">
                    <input type="text" value={whyChooseUs.subheadline} onChange={(e) => setWhyChooseUs({ ...whyChooseUs, subheadline: e.target.value })} className={inputCls} />
                  </Field>
                </div>
                <p className="text-slate-400 text-sm font-medium mt-2">Feature Points</p>
                {whyChooseUs.features.map((feat, i) => (
                  <div key={i} className="flex gap-3 items-end">
                    <Field label={`Feature ${i + 1} Title`}>
                      <input type="text" value={feat.title} onChange={(e) => setWhyChooseUs({ ...whyChooseUs, features: whyChooseUs.features.map((f, j) => j === i ? { ...f, title: e.target.value } : f) })} className={inputCls} />
                    </Field>
                    <Field label="Description">
                      <input type="text" value={feat.desc} onChange={(e) => setWhyChooseUs({ ...whyChooseUs, features: whyChooseUs.features.map((f, j) => j === i ? { ...f, desc: e.target.value } : f) })} className={inputCls} />
                    </Field>
                    <button onClick={() => setWhyChooseUs({ ...whyChooseUs, features: whyChooseUs.features.filter((_, j) => j !== i) })} className="mb-0.5 p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={() => setWhyChooseUs({ ...whyChooseUs, features: [...whyChooseUs.features, { title: "", desc: "" }] })} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  <Plus className="w-4 h-4" /> Add Feature
                </button>
                <p className="text-slate-400 text-sm font-medium mt-4">Headline Stats (right column)</p>
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
              </Section>
            )}

            {/* ── About ── */}
            {activeSection === "about" && (
              <Section title="About Section" subtitle="The 'India's Most Trusted' section on the homepage.">
                <Field label="Headline">
                  <input type="text" value={about.headline} onChange={(e) => setAbout({ ...about, headline: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Subheadline">
                  <textarea value={about.subheadline} onChange={(e) => setAbout({ ...about, subheadline: e.target.value })} rows={2} className={`${inputCls} resize-none`} />
                </Field>
                <p className="text-slate-400 text-sm font-medium mt-2">Bullet Points</p>
                {about.points.map((pt, i) => (
                  <div key={i} className="flex gap-3">
                    <input type="text" value={pt} onChange={(e) => setAbout({ ...about, points: about.points.map((p, j) => j === i ? e.target.value : p) })} className={`${inputCls} flex-1`} placeholder={`Point ${i + 1}`} />
                    <button onClick={() => setAbout({ ...about, points: about.points.filter((_, j) => j !== i) })} className="p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={() => setAbout({ ...about, points: [...about.points, ""] })} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  <Plus className="w-4 h-4" /> Add Point
                </button>
              </Section>
            )}

            {/* ── Testimonials ── */}
            {activeSection === "testimonials" && (
              <Section title="Testimonials" subtitle="Client testimonials shown in the homepage testimonials carousel.">
                {testimonials.map((t, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-xl p-4 space-y-3 relative">
                    <button onClick={() => setTestimonials(testimonials.filter((_, j) => j !== i))} className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label={`#${i + 1} Name`}>
                        <input type="text" value={t.name} onChange={(e) => setTestimonials(testimonials.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} placeholder="Rahul Sharma" className={inputCls} />
                      </Field>
                      <Field label="Company">
                        <input type="text" value={t.company} onChange={(e) => setTestimonials(testimonials.map((x, j) => j === i ? { ...x, company: e.target.value } : x))} placeholder="TechNova India" className={inputCls} />
                      </Field>
                    </div>
                    <Field label="Testimonial Text">
                      <textarea value={t.text} onChange={(e) => setTestimonials(testimonials.map((x, j) => j === i ? { ...x, text: e.target.value } : x))} rows={3} className={`${inputCls} resize-none`} placeholder="What the client said…" />
                    </Field>
                  </div>
                ))}
                <button onClick={() => setTestimonials([...testimonials, { name: "", company: "", text: "" }])} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  <Plus className="w-4 h-4" /> Add Testimonial
                </button>
              </Section>
            )}

            {/* ── FAQs ── */}
            {activeSection === "faqs" && (
              <Section title="FAQs" subtitle="Questions shown in the homepage FAQ accordion.">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-[#f6f7f7] border border-[#e2e3e5] rounded p-4 space-y-3 relative">
                    <button onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} className="absolute top-3 right-3 p-1.5 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Field label={`Q${i + 1} Question`}>
                      <input type="text" value={faq.q} onChange={(e) => setFaqs(faqs.map((x, j) => j === i ? { ...x, q: e.target.value } : x))} placeholder="What is your question?" className={inputCls} />
                    </Field>
                    <Field label="Answer">
                      <textarea value={faq.a} onChange={(e) => setFaqs(faqs.map((x, j) => j === i ? { ...x, a: e.target.value } : x))} rows={3} className={`${inputCls} resize-none`} placeholder="The answer…" />
                    </Field>
                  </div>
                ))}
                <button onClick={() => setFaqs([...faqs, { q: "", a: "" }])} className="flex items-center gap-2 text-sm text-[#2271b1] hover:text-[#135e96] transition-colors">
                  <Plus className="w-4 h-4" /> Add FAQ
                </button>
              </Section>
            )}

            {/* ── Page Heroes ── */}
            {activeSection === "page_heroes" && (
              <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#c3c4c7] bg-[#f6f7f7]">
                  <h2 className="text-[#1d2327] font-semibold text-sm">Page Hero Sections</h2>
                  <p className="text-[#646970] text-xs mt-0.5">Edit the headline, subheadline, and CTA for each page's banner.</p>
                </div>
                <div className="divide-y divide-[#f0f0f1]">
                  {Object.entries(PAGE_LABELS).map(([path, label]) => {
                    const isOpen = expandedPage === path;
                    const pg = pages[path] ?? DEFAULT_PAGE_CONTENT[path] ?? { headline: "", subheadline: "" };
                    return (
                      <div key={path}>
                        <button onClick={() => setExpandedPage(isOpen ? null : path)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#f6f7f7] transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-[#1d2327] font-medium text-sm">{label}</span>
                            <span className="text-[#a7aaad] text-xs font-mono hidden sm:inline">{path}</span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {pg.headline && <span className="text-[#646970] text-xs truncate max-w-[200px] hidden md:inline">{pg.headline}{pg.headline_highlight ? ` ${pg.headline_highlight}` : ""}</span>}
                            {isOpen ? <ChevronUp className="w-4 h-4 text-[#646970]" /> : <ChevronDown className="w-4 h-4 text-[#646970]" />}
                          </div>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 pt-3 bg-[#f6f7f7] border-t border-[#e2e3e5] space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Field label="Headline (first part)" hint="Text before the coloured highlight word.">
                                <input type="text" value={pg.headline} onChange={(e) => updatePage(path, "headline", e.target.value)} placeholder="Search Engine" className={inputCls} />
                              </Field>
                              <Field label="Headline Highlight" hint="Coloured accent word(s) at the end.">
                                <input type="text" value={pg.headline_highlight ?? ""} onChange={(e) => updatePage(path, "headline_highlight", e.target.value)} placeholder="Optimization" className={inputCls} />
                              </Field>
                            </div>
                            <Field label="Subheadline">
                              <textarea value={pg.subheadline} onChange={(e) => updatePage(path, "subheadline", e.target.value)} rows={3} className={`${inputCls} resize-none`} />
                            </Field>
                            <Field label="CTA Button Text" hint="Leave blank to use the page default.">
                              <input type="text" value={pg.cta_text ?? ""} onChange={(e) => updatePage(path, "cta_text", e.target.value)} placeholder="Get Free Audit" className={inputCls} />
                            </Field>
                            <div className="bg-[#1d2327] rounded p-4">
                              <p className="text-[#8c8f94] text-xs font-medium mb-3 flex items-center gap-1"><Eye className="w-3 h-3" /> Hero Preview</p>
                              <h3 className="text-white text-lg font-bold mb-1">
                                {pg.headline || "Headline"}{" "}<span className="text-emerald-400">{pg.headline_highlight || ""}</span>
                              </h3>
                              <p className="text-[#c3c4c7] text-sm mb-3">{pg.subheadline || "Subheadline text."}</p>
                              {pg.cta_text && <span className="bg-emerald-500 text-slate-950 font-semibold text-xs px-4 py-1.5 rounded">{pg.cta_text}</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Service Pages ── */}
            {activeSection === "service_pages" && (
              <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#c3c4c7] bg-[#f6f7f7]">
                  <h2 className="text-[#1d2327] font-semibold text-sm">Service Page Content</h2>
                  <p className="text-[#646970] text-xs mt-0.5">Edit benefits, process steps, and pricing for each service page.</p>
                </div>
                <div className="divide-y divide-[#f0f0f1]">
                  {Object.entries(SERVICE_PAGE_LABELS).map(([path, label]) => {
                    const isOpen = expandedServicePage === path;
                    const sp: ServicePageData = servicePages[path] ?? DEFAULT_SERVICE_PAGES[path] ?? { benefits: [], process_steps: [], pricing: [], faqs: [] };

                    const updateSP = (updates: Partial<ServicePageData>) =>
                      setServicePages((prev) => ({ ...prev, [path]: { ...sp, ...updates } }));

                    return (
                      <div key={path}>
                        <button onClick={() => { setExpandedServicePage(isOpen ? null : path); setExpandedServiceTab("benefits"); }} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#f6f7f7] transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-[#1d2327] font-medium text-sm">{label}</span>
                            <span className="text-[#a7aaad] text-xs font-mono hidden sm:inline">{path}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[#646970] text-xs">{sp.benefits.length}b · {sp.process_steps.length}p · {sp.pricing.length}pr · {(sp.faqs ?? []).length}faq</span>
                            {isOpen ? <ChevronUp className="w-4 h-4 text-[#646970]" /> : <ChevronDown className="w-4 h-4 text-[#646970]" />}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-4 bg-[#f6f7f7] border-t border-[#e2e3e5]">
                            {/* Tab bar */}
                            <div className="flex gap-1 mb-5 bg-white border border-[#c3c4c7] rounded p-1 w-fit shadow-sm">
                              {(["benefits", "process", "pricing", "faqs"] as const).map((tab) => (
                                <button key={tab} onClick={() => setExpandedServiceTab(tab)} className={`px-4 py-1.5 rounded text-sm font-medium capitalize transition-colors ${expandedServiceTab === tab ? "bg-[#2271b1] text-white" : "text-[#646970] hover:text-[#1d2327]"}`}>
                                  {tab === "process" ? "Process Steps" : tab === "faqs" ? "FAQs" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                              ))}
                            </div>

                            {/* Benefits */}
                            {expandedServiceTab === "benefits" && (
                              <div className="space-y-3">
                                {sp.benefits.map((b, i) => (
                                  <div key={i} className="flex gap-3 items-end">
                                    <Field label={`Benefit ${i + 1} Title`}>
                                      <input type="text" value={b.title} onChange={(e) => updateSP({ benefits: sp.benefits.map((x, j) => j === i ? { ...x, title: e.target.value } : x) })} className={inputCls} />
                                    </Field>
                                    <Field label="Description">
                                      <input type="text" value={b.desc} onChange={(e) => updateSP({ benefits: sp.benefits.map((x, j) => j === i ? { ...x, desc: e.target.value } : x) })} className={inputCls} />
                                    </Field>
                                    <button onClick={() => updateSP({ benefits: sp.benefits.filter((_, j) => j !== i) })} className="mb-0.5 p-2.5 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors shrink-0">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                                <button onClick={() => updateSP({ benefits: [...sp.benefits, { title: "", desc: "" } as BenefitItem] })} className="flex items-center gap-2 text-sm text-[#2271b1] hover:text-[#135e96] transition-colors">
                                  <Plus className="w-4 h-4" /> Add Benefit
                                </button>
                              </div>
                            )}

                            {/* Process Steps */}
                            {expandedServiceTab === "process" && (
                              <div className="space-y-3">
                                {sp.process_steps.map((s, i) => (
                                  <div key={i} className="bg-white border border-[#c3c4c7] rounded p-4 space-y-3 relative shadow-sm">
                                    <button onClick={() => updateSP({ process_steps: sp.process_steps.filter((_, j) => j !== i) })} className="absolute top-3 right-3 p-1.5 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="grid grid-cols-3 gap-3">
                                      <Field label="Step Number (e.g. 01)">
                                        <input type="text" value={s.step} onChange={(e) => updateSP({ process_steps: sp.process_steps.map((x, j) => j === i ? { ...x, step: e.target.value } : x) })} className={inputCls} />
                                      </Field>
                                      <Field label="Step Title">
                                        <input type="text" value={s.title} onChange={(e) => updateSP({ process_steps: sp.process_steps.map((x, j) => j === i ? { ...x, title: e.target.value } : x) })} className={inputCls} />
                                      </Field>
                                      <Field label="Step Description">
                                        <input type="text" value={s.desc} onChange={(e) => updateSP({ process_steps: sp.process_steps.map((x, j) => j === i ? { ...x, desc: e.target.value } : x) })} className={inputCls} />
                                      </Field>
                                    </div>
                                  </div>
                                ))}
                                <button onClick={() => updateSP({ process_steps: [...sp.process_steps, { step: `0${sp.process_steps.length + 1}`, title: "", desc: "" } as ProcessStep] })} className="flex items-center gap-2 text-sm text-[#2271b1] hover:text-[#135e96] transition-colors">
                                  <Plus className="w-4 h-4" /> Add Step
                                </button>
                              </div>
                            )}

                            {/* Pricing */}
                            {expandedServiceTab === "pricing" && (
                              <div className="space-y-3">
                                {sp.pricing.map((plan, i) => {
                                  const updatePlan = (changes: Partial<PricingPlan>) =>
                                    updateSP({ pricing: sp.pricing.map((x, j) => j === i ? { ...x, ...changes } : x) });
                                  const features = plan.features ?? [];
                                  return (
                                    <div key={i} className="bg-white border border-[#c3c4c7] rounded p-4 space-y-3 relative shadow-sm">
                                      <button onClick={() => updateSP({ pricing: sp.pricing.filter((_, j) => j !== i) })} className="absolute top-3 right-3 p-1.5 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                      <div className="grid grid-cols-3 gap-3">
                                        <Field label="Plan Name">
                                          <input type="text" value={plan.name} onChange={(e) => updatePlan({ name: e.target.value })} className={inputCls} />
                                        </Field>
                                        <Field label="Price">
                                          <input type="text" value={plan.price} onChange={(e) => updatePlan({ price: e.target.value })} className={inputCls} />
                                        </Field>
                                        <Field label="Short Description">
                                          <input type="text" value={plan.desc} onChange={(e) => updatePlan({ desc: e.target.value })} className={inputCls} />
                                        </Field>
                                      </div>
                                      <label className="flex items-center gap-2 text-sm text-[#646970] cursor-pointer select-none">
                                        <input type="checkbox" checked={!!plan.popular} onChange={(e) => updatePlan({ popular: e.target.checked })} className="accent-[#2271b1] w-4 h-4" />
                                        Mark as "Most Popular"
                                      </label>
                                      <div>
                                        <p className="text-xs font-medium text-[#646970] uppercase tracking-wide mb-2">What's Included (Features)</p>
                                        <div className="space-y-2">
                                          {features.map((feat, fi) => (
                                            <div key={fi} className="flex items-center gap-2">
                                              <input
                                                type="text"
                                                value={feat}
                                                onChange={(e) => updatePlan({ features: features.map((f, k) => k === fi ? e.target.value : f) })}
                                                placeholder={`Feature ${fi + 1}`}
                                                className={`${inputCls} flex-1`}
                                              />
                                              <button onClick={() => updatePlan({ features: features.filter((_, k) => k !== fi) })} className="p-2 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors shrink-0">
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          ))}
                                          <button onClick={() => updatePlan({ features: [...features, ""] })} className="flex items-center gap-1.5 text-xs text-[#2271b1] hover:text-[#135e96] transition-colors mt-1">
                                            <Plus className="w-3.5 h-3.5" /> Add Feature
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                                <button onClick={() => updateSP({ pricing: [...sp.pricing, { name: "", price: "", desc: "", features: [] } as PricingPlan] })} className="flex items-center gap-2 text-sm text-[#2271b1] hover:text-[#135e96] transition-colors">
                                  <Plus className="w-4 h-4" /> Add Plan
                                </button>
                              </div>
                            )}

                            {/* FAQs */}
                            {expandedServiceTab === "faqs" && (
                              <div className="space-y-3">
                                {(sp.faqs ?? []).map((faq, i) => {
                                  const updateFaq = (update: Partial<FaqItem>) =>
                                    updateSP({ faqs: (sp.faqs ?? []).map((x, j) => j === i ? { ...x, ...update } : x) });
                                  return (
                                    <div key={i} className="bg-white border border-[#c3c4c7] rounded p-4 space-y-3 relative shadow-sm">
                                      <button onClick={() => updateSP({ faqs: (sp.faqs ?? []).filter((_, j) => j !== i) })} className="absolute top-3 right-3 p-1.5 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                      <Field label={`Question ${i + 1}`}>
                                        <input type="text" value={faq.q} onChange={(e) => updateFaq({ q: e.target.value })} placeholder="What is your question?" className={inputCls} />
                                      </Field>
                                      <Field label="Answer">
                                        <textarea value={faq.a} onChange={(e) => updateFaq({ a: e.target.value })} rows={3} className={`${inputCls} resize-none`} placeholder="The answer…" />
                                      </Field>
                                    </div>
                                  );
                                })}
                                <button onClick={() => updateSP({ faqs: [...(sp.faqs ?? []), { q: "", a: "" }] })} className="flex items-center gap-2 text-sm text-[#2271b1] hover:text-[#135e96] transition-colors">
                                  <Plus className="w-4 h-4" /> Add FAQ
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── About Us Page ── */}
            {activeSection === "about_page" && (
              <div className="space-y-4">
                <Section title="About Us — Stats Bar" subtitle="The 4 stat cards displayed on the About Us page.">
                  {aboutPage.stats.map((stat, i) => (
                    <div key={i} className="flex gap-3 items-end">
                      <Field label={`Stat ${i + 1} Value`}>
                        <input type="text" value={stat.value} onChange={(e) => setAboutPage({ ...aboutPage, stats: aboutPage.stats.map((s, j) => j === i ? { ...s, value: e.target.value } : s) })} placeholder="3+" className={inputCls} />
                      </Field>
                      <Field label="Label">
                        <input type="text" value={stat.label} onChange={(e) => setAboutPage({ ...aboutPage, stats: aboutPage.stats.map((s, j) => j === i ? { ...s, label: e.target.value } : s) })} placeholder="Global Offices" className={inputCls} />
                      </Field>
                      <button onClick={() => setAboutPage({ ...aboutPage, stats: aboutPage.stats.filter((_, j) => j !== i) })} className="mb-0.5 p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => setAboutPage({ ...aboutPage, stats: [...aboutPage.stats, { value: "", label: "" }] })} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"><Plus className="w-4 h-4" /> Add Stat</button>
                </Section>

                <Section title="About Us — Our Story" subtitle="The story section paragraphs, pull quote, and highlight points.">
                  <p className="text-[#646970] text-xs font-medium uppercase tracking-wide">Story Paragraphs</p>
                  {aboutPage.story_paragraphs.map((para, i) => (
                    <div key={i} className="flex gap-3">
                      <textarea value={para} rows={3} onChange={(e) => setAboutPage({ ...aboutPage, story_paragraphs: aboutPage.story_paragraphs.map((p, j) => j === i ? e.target.value : p) })} className={`${inputCls} flex-1 resize-none`} placeholder={`Paragraph ${i + 1}`} />
                      <button onClick={() => setAboutPage({ ...aboutPage, story_paragraphs: aboutPage.story_paragraphs.filter((_, j) => j !== i) })} className="p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0 self-start mt-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => setAboutPage({ ...aboutPage, story_paragraphs: [...aboutPage.story_paragraphs, ""] })} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"><Plus className="w-4 h-4" /> Add Paragraph</button>
                  <Field label="Pull Quote (shown in blockquote)" hint="Without the outer quote marks.">
                    <textarea value={aboutPage.story_quote} rows={2} onChange={(e) => setAboutPage({ ...aboutPage, story_quote: e.target.value })} className={`${inputCls} resize-none`} />
                  </Field>
                  <p className="text-[#646970] text-xs font-medium uppercase tracking-wide mt-2">Highlight Points Grid</p>
                  {aboutPage.story_points.map((pt, i) => (
                    <div key={i} className="flex gap-3">
                      <input type="text" value={pt} onChange={(e) => setAboutPage({ ...aboutPage, story_points: aboutPage.story_points.map((p, j) => j === i ? e.target.value : p) })} className={`${inputCls} flex-1`} placeholder={`Point ${i + 1}`} />
                      <button onClick={() => setAboutPage({ ...aboutPage, story_points: aboutPage.story_points.filter((_, j) => j !== i) })} className="p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => setAboutPage({ ...aboutPage, story_points: [...aboutPage.story_points, ""] })} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"><Plus className="w-4 h-4" /> Add Point</button>
                </Section>

                <Section title="About Us — Core Values" subtitle="The 4 value cards on the About Us page.">
                  {aboutPage.core_values.map((val, i) => (
                    <div key={i} className="flex gap-3 items-end">
                      <Field label={`Value ${i + 1} Title`}>
                        <input type="text" value={val.title} onChange={(e) => setAboutPage({ ...aboutPage, core_values: aboutPage.core_values.map((v, j) => j === i ? { ...v, title: e.target.value } : v) })} className={inputCls} />
                      </Field>
                      <Field label="Description">
                        <input type="text" value={val.desc} onChange={(e) => setAboutPage({ ...aboutPage, core_values: aboutPage.core_values.map((v, j) => j === i ? { ...v, desc: e.target.value } : v) })} className={inputCls} />
                      </Field>
                      <button onClick={() => setAboutPage({ ...aboutPage, core_values: aboutPage.core_values.filter((_, j) => j !== i) })} className="mb-0.5 p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => setAboutPage({ ...aboutPage, core_values: [...aboutPage.core_values, { title: "", desc: "" } as CoreValueItem] })} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"><Plus className="w-4 h-4" /> Add Value</button>
                </Section>

                <Section title="About Us — Meet The Team" subtitle="Team size and roles shown in the team section.">
                  <Field label="Total Specialists Count (e.g. 15+)">
                    <input type="text" value={aboutPage.team_total} onChange={(e) => setAboutPage({ ...aboutPage, team_total: e.target.value })} placeholder="15+" className={inputCls} />
                  </Field>
                  <p className="text-[#646970] text-xs font-medium uppercase tracking-wide mt-2">Team Roles</p>
                  {aboutPage.team_roles.map((role, i) => (
                    <div key={i} className="flex gap-3 items-end">
                      <Field label={`Role ${i + 1} Label`}>
                        <input type="text" value={role.label} onChange={(e) => setAboutPage({ ...aboutPage, team_roles: aboutPage.team_roles.map((r, j) => j === i ? { ...r, label: e.target.value } : r) })} placeholder="Growth Marketers" className={inputCls} />
                      </Field>
                      <Field label="Count (e.g. 5+)">
                        <input type="text" value={role.count} onChange={(e) => setAboutPage({ ...aboutPage, team_roles: aboutPage.team_roles.map((r, j) => j === i ? { ...r, count: e.target.value } : r) })} placeholder="5+" className={inputCls} />
                      </Field>
                      <button onClick={() => setAboutPage({ ...aboutPage, team_roles: aboutPage.team_roles.filter((_, j) => j !== i) })} className="mb-0.5 p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => setAboutPage({ ...aboutPage, team_roles: [...aboutPage.team_roles, { label: "", count: "" }] })} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"><Plus className="w-4 h-4" /> Add Role</button>
                </Section>

                <Section title="About Us — Why India?" subtitle="The advantage bullet points and stat cards on the dark section.">
                  <p className="text-[#646970] text-xs font-medium uppercase tracking-wide">Advantage Points</p>
                  {aboutPage.india_points.map((pt, i) => (
                    <div key={i} className="flex gap-3">
                      <input type="text" value={pt} onChange={(e) => setAboutPage({ ...aboutPage, india_points: aboutPage.india_points.map((p, j) => j === i ? e.target.value : p) })} className={`${inputCls} flex-1`} placeholder={`Advantage ${i + 1}`} />
                      <button onClick={() => setAboutPage({ ...aboutPage, india_points: aboutPage.india_points.filter((_, j) => j !== i) })} className="p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => setAboutPage({ ...aboutPage, india_points: [...aboutPage.india_points, ""] })} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"><Plus className="w-4 h-4" /> Add Point</button>
                  <p className="text-[#646970] text-xs font-medium uppercase tracking-wide mt-4">Advantage Stats</p>
                  {aboutPage.india_stats.map((stat, i) => (
                    <div key={i} className="bg-slate-50 border border-[#c3c4c7] rounded-lg p-4 relative">
                      <button onClick={() => setAboutPage({ ...aboutPage, india_stats: aboutPage.india_stats.filter((_, j) => j !== i) })} className="absolute top-3 right-3 p-1.5 rounded bg-red-50 text-red-400 hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      <div className="grid grid-cols-3 gap-3">
                        <Field label={`Stat ${i + 1} Value`}><input type="text" value={stat.value} onChange={(e) => setAboutPage({ ...aboutPage, india_stats: aboutPage.india_stats.map((s, j) => j === i ? { ...s, value: e.target.value } : s) })} placeholder="60%" className={inputCls} /></Field>
                        <Field label="Label"><input type="text" value={stat.label} onChange={(e) => setAboutPage({ ...aboutPage, india_stats: aboutPage.india_stats.map((s, j) => j === i ? { ...s, label: e.target.value } : s) })} placeholder="Lower Cost vs Metro" className={inputCls} /></Field>
                        <Field label="Sub-label"><input type="text" value={stat.sub} onChange={(e) => setAboutPage({ ...aboutPage, india_stats: aboutPage.india_stats.map((s, j) => j === i ? { ...s, sub: e.target.value } : s) })} placeholder="Same enterprise quality" className={inputCls} /></Field>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setAboutPage({ ...aboutPage, india_stats: [...aboutPage.india_stats, { value: "", label: "", sub: "" }] })} className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"><Plus className="w-4 h-4" /> Add Stat Card</button>
                </Section>
              </div>
            )}

            {/* ── Case Studies ── */}
            {activeSection === "case_studies" && (
              <div className="space-y-4">
                <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#c3c4c7] bg-[#f6f7f7] flex items-center justify-between">
                    <div>
                      <h2 className="text-[#1d2327] font-semibold text-sm">Case Studies</h2>
                      <p className="text-[#646970] text-xs mt-0.5">Edit all case study cards shown on the Case Studies page. Each card has a detail modal.</p>
                    </div>
                    <button onClick={() => setCaseStudies([...caseStudies, { id: Date.now(), client: "", industry: "", challenge: "", solution: "", metric1: "", label1: "", metric2: "", label2: "", timeline: "", image: "" }])} className="flex items-center gap-1.5 text-xs bg-[#2271b1] text-white px-3 py-1.5 rounded hover:bg-[#135e96] transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Add Case Study
                    </button>
                  </div>
                  <div className="divide-y divide-[#f0f0f1]">
                    {caseStudies.map((cs, i) => (
                      <div key={cs.id} className="p-5 space-y-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[#1d2327] font-semibold text-sm">{cs.client || `Case Study ${i + 1}`}</span>
                          <button onClick={() => setCaseStudies(caseStudies.filter((_, j) => j !== i))} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"><Trash2 className="w-3.5 h-3.5" /> Remove</button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Client Name"><input type="text" value={cs.client} onChange={(e) => setCaseStudies(caseStudies.map((x, j) => j === i ? { ...x, client: e.target.value } : x))} placeholder="Mansi Jewelry" className={inputCls} /></Field>
                          <Field label="Industry"><input type="text" value={cs.industry} onChange={(e) => setCaseStudies(caseStudies.map((x, j) => j === i ? { ...x, industry: e.target.value } : x))} placeholder="E-Commerce" className={inputCls} /></Field>
                        </div>
                        <Field label="The Challenge"><textarea value={cs.challenge} rows={2} onChange={(e) => setCaseStudies(caseStudies.map((x, j) => j === i ? { ...x, challenge: e.target.value } : x))} className={`${inputCls} resize-none`} placeholder="What problem did the client face?" /></Field>
                        <Field label="The Solution"><textarea value={cs.solution} rows={2} onChange={(e) => setCaseStudies(caseStudies.map((x, j) => j === i ? { ...x, solution: e.target.value } : x))} className={`${inputCls} resize-none`} placeholder="How did you solve it?" /></Field>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <Field label="Result 1 Value"><input type="text" value={cs.metric1} onChange={(e) => setCaseStudies(caseStudies.map((x, j) => j === i ? { ...x, metric1: e.target.value } : x))} placeholder="+340%" className={inputCls} /></Field>
                          <Field label="Result 1 Label"><input type="text" value={cs.label1} onChange={(e) => setCaseStudies(caseStudies.map((x, j) => j === i ? { ...x, label1: e.target.value } : x))} placeholder="Organic Traffic" className={inputCls} /></Field>
                          <Field label="Result 2 Value"><input type="text" value={cs.metric2} onChange={(e) => setCaseStudies(caseStudies.map((x, j) => j === i ? { ...x, metric2: e.target.value } : x))} placeholder="+220%" className={inputCls} /></Field>
                          <Field label="Result 2 Label"><input type="text" value={cs.label2} onChange={(e) => setCaseStudies(caseStudies.map((x, j) => j === i ? { ...x, label2: e.target.value } : x))} placeholder="Revenue" className={inputCls} /></Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Timeline (e.g. 8 Months)"><input type="text" value={cs.timeline} onChange={(e) => setCaseStudies(caseStudies.map((x, j) => j === i ? { ...x, timeline: e.target.value } : x))} placeholder="8 Months" className={inputCls} /></Field>
                          <Field label="Image URL"><input type="text" value={cs.image} onChange={(e) => setCaseStudies(caseStudies.map((x, j) => j === i ? { ...x, image: e.target.value } : x))} placeholder="https://images.unsplash.com/..." className={inputCls} /></Field>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Blog Newsletter CTA ── */}
        {activeSection === "blog_newsletter_cta" && (
          <div className="space-y-4">
            <Section title="Blog Page — Newsletter CTA" subtitle='The "Stay Ahead of the Curve" subscription banner at the bottom of the Blog page.'>
              <Field label="Heading">
                <input type="text" value={blogNewsletterCta.heading} onChange={(e) => setBlogNewsletterCta({ ...blogNewsletterCta, heading: e.target.value })} placeholder="Stay Ahead of the Curve" className={inputCls} />
              </Field>
              <Field label="Subheading">
                <textarea rows={2} value={blogNewsletterCta.subheading} onChange={(e) => setBlogNewsletterCta({ ...blogNewsletterCta, subheading: e.target.value })} placeholder="Get our latest marketing insights…" className={`${inputCls} resize-none`} />
              </Field>
              <div className="flex gap-4">
                <Field label="Button Text">
                  <input type="text" value={blogNewsletterCta.button_text} onChange={(e) => setBlogNewsletterCta({ ...blogNewsletterCta, button_text: e.target.value })} placeholder="Subscribe Free" className={inputCls} />
                </Field>
                <Field label="Input Placeholder">
                  <input type="text" value={blogNewsletterCta.placeholder} onChange={(e) => setBlogNewsletterCta({ ...blogNewsletterCta, placeholder: e.target.value })} placeholder="your@email.com" className={inputCls} />
                </Field>
              </div>
            </Section>
          </div>
        )}

        {activeSection === "legal" && (
          <div className="space-y-5">
            <Section title="Legal Pages" subtitle="Edit your Privacy Policy and Terms of Service using the rich text editor. Changes are published immediately on save.">
              <div className="p-6 space-y-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <h3 className="text-sm font-semibold text-[#1d2327]">Privacy Policy</h3>
                  </div>
                  <p className="text-xs text-[#646970] mb-4">Visible at <a href="/privacy-policy" target="_blank" className="text-[#2271b1] hover:underline">/privacy-policy</a>. Leave empty to use the default static content.</p>
                  <div className="border border-[#c3c4c7] rounded overflow-hidden">
                    <RichTextEditor
                      content={privacyHtml}
                      onChange={setPrivacyHtml}
                      placeholder="Enter your Privacy Policy content here..."
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <h3 className="text-sm font-semibold text-[#1d2327]">Terms of Service</h3>
                  </div>
                  <p className="text-xs text-[#646970] mb-4">Visible at <a href="/terms-of-service" target="_blank" className="text-[#2271b1] hover:underline">/terms-of-service</a>. Leave empty to use the default static content.</p>
                  <div className="border border-[#c3c4c7] rounded overflow-hidden">
                    <RichTextEditor
                      content={termsHtml}
                      onChange={setTermsHtml}
                      placeholder="Enter your Terms of Service content here..."
                    />
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        <div className="px-6 pb-6 flex justify-end">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white font-medium px-5 py-2 rounded text-sm transition-colors">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

const inputCls =
  "w-full bg-white border border-[#8c8f94] text-[#1d2327] placeholder-[#a7aaad] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] transition-shadow";

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#c3c4c7] bg-[#f6f7f7]">
        <h2 className="text-[#1d2327] font-semibold text-sm">{title}</h2>
        <p className="text-[#646970] text-xs mt-0.5">{subtitle}</p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex-1 min-w-0">
      <label className="block text-[#1d2327] text-sm font-medium mb-1">{label}</label>
      {children}
      {hint && <p className="text-[#646970] text-xs mt-1">{hint}</p>}
    </div>
  );
}
