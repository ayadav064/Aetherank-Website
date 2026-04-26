import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  fetchPublicSettings,
  type CmsSettings,
  type BlogNewsletterCta,
  type NavigationSettings,
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
  DEFAULT_NAVIGATION,
} from "@/lib/cmsApi";

interface CmsContextValue {
  settings: CmsSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: CmsSettings = {
  seo: DEFAULT_SEO,
  content: DEFAULT_CONTENT,
};

const CmsContext = createContext<CmsContextValue>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {},
});

function mergeAboutPage(saved: Record<string, unknown>): CmsSettings["content"]["about_page"] {
  return {
    stats: Array.isArray(saved["stats"]) ? saved["stats"] as typeof DEFAULT_ABOUT_PAGE.stats : DEFAULT_ABOUT_PAGE.stats,
    story_paragraphs: Array.isArray(saved["story_paragraphs"]) ? saved["story_paragraphs"] as string[] : DEFAULT_ABOUT_PAGE.story_paragraphs,
    story_quote: typeof saved["story_quote"] === "string" ? saved["story_quote"] : DEFAULT_ABOUT_PAGE.story_quote,
    story_points: Array.isArray(saved["story_points"]) ? saved["story_points"] as string[] : DEFAULT_ABOUT_PAGE.story_points,
    core_values: Array.isArray(saved["core_values"]) ? saved["core_values"] as typeof DEFAULT_ABOUT_PAGE.core_values : DEFAULT_ABOUT_PAGE.core_values,
    team_total: typeof saved["team_total"] === "string" ? saved["team_total"] : DEFAULT_ABOUT_PAGE.team_total,
    team_roles: Array.isArray(saved["team_roles"]) ? saved["team_roles"] as typeof DEFAULT_ABOUT_PAGE.team_roles : DEFAULT_ABOUT_PAGE.team_roles,
    india_points: Array.isArray(saved["india_points"]) ? saved["india_points"] as string[] : DEFAULT_ABOUT_PAGE.india_points,
    india_stats: Array.isArray(saved["india_stats"]) ? saved["india_stats"] as typeof DEFAULT_ABOUT_PAGE.india_stats : DEFAULT_ABOUT_PAGE.india_stats,
  };
}

function mergeNavigation(saved: NavigationSettings | undefined): NavigationSettings {
  if (!saved) return DEFAULT_NAVIGATION;
  return {
    header: Array.isArray(saved.header) && saved.header.length > 0
      ? saved.header
      : DEFAULT_NAVIGATION.header,
    footer_columns: Array.isArray(saved.footer_columns) && saved.footer_columns.length > 0
      ? saved.footer_columns
      : DEFAULT_NAVIGATION.footer_columns,
  };
}

function mergeServicePages(
  saved: Record<string, unknown> | undefined
): CmsSettings["content"]["service_pages"] {
  if (!saved || typeof saved !== "object") return DEFAULT_SERVICE_PAGES;
  const result: CmsSettings["content"]["service_pages"] = {};
  for (const key of Object.keys(DEFAULT_SERVICE_PAGES)) {
    const s = (saved as Record<string, unknown>)[key];
    if (s && typeof s === "object") {
      const sp = s as Record<string, unknown>;
      result[key] = {
        benefits: Array.isArray(sp["benefits"]) ? sp["benefits"] as CmsSettings["content"]["service_pages"][string]["benefits"] : DEFAULT_SERVICE_PAGES[key].benefits,
        process_steps: Array.isArray(sp["process_steps"]) ? sp["process_steps"] as CmsSettings["content"]["service_pages"][string]["process_steps"] : DEFAULT_SERVICE_PAGES[key].process_steps,
        pricing: Array.isArray(sp["pricing"]) ? sp["pricing"] as CmsSettings["content"]["service_pages"][string]["pricing"] : DEFAULT_SERVICE_PAGES[key].pricing,
        faqs: Array.isArray(sp["faqs"]) && (sp["faqs"] as unknown[]).length > 0 ? sp["faqs"] as CmsSettings["content"]["service_pages"][string]["faqs"] : DEFAULT_SERVICE_PAGES[key].faqs ?? [],
      };
    } else {
      result[key] = DEFAULT_SERVICE_PAGES[key];
    }
  }
  return result;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeSettings(s: Partial<CmsSettings>): CmsSettings {
  const c = (s.content ?? {}) as Partial<CmsSettings["content"]>;
  const growthPartner = asRecord(c.growth_partner);
  const aiAdvantage = asRecord(c.ai_advantage);
  const servicesSection = asRecord(c.services_section);
  const whyChooseUs = asRecord(c.why_choose_us);
  const about = asRecord(c.about);

  return {
    seo: { ...DEFAULT_SEO, ...(s.seo ?? {}) },
    content: {
      hero: { ...DEFAULT_CONTENT.hero, ...(c.hero ?? {}) },
      contact: { ...DEFAULT_CONTENT.contact, ...(c.contact ?? {}) },
      pages: { ...DEFAULT_PAGE_CONTENT, ...(c.pages ?? {}) },
      stats: Array.isArray(c.stats) && c.stats.length > 0 ? c.stats : DEFAULT_STATS,
      growth_partner: c.growth_partner
        ? { ...DEFAULT_GROWTH_PARTNER, ...c.growth_partner, pillars: Array.isArray(growthPartner["pillars"]) ? growthPartner["pillars"] as CmsSettings["content"]["growth_partner"]["pillars"] : DEFAULT_GROWTH_PARTNER.pillars }
        : DEFAULT_GROWTH_PARTNER,
      ai_advantage: c.ai_advantage
        ? { ...DEFAULT_AI_ADVANTAGE, ...c.ai_advantage, cards: Array.isArray(aiAdvantage["cards"]) ? aiAdvantage["cards"] as CmsSettings["content"]["ai_advantage"]["cards"] : DEFAULT_AI_ADVANTAGE.cards }
        : DEFAULT_AI_ADVANTAGE,
      services_section: c.services_section
        ? { ...DEFAULT_SERVICES_SECTION, ...c.services_section, cards: Array.isArray(servicesSection["cards"]) ? servicesSection["cards"] as CmsSettings["content"]["services_section"]["cards"] : DEFAULT_SERVICES_SECTION.cards }
        : DEFAULT_SERVICES_SECTION,
      why_choose_us: c.why_choose_us
        ? { ...DEFAULT_WHY_CHOOSE_US, ...c.why_choose_us, features: Array.isArray(whyChooseUs["features"]) ? whyChooseUs["features"] as CmsSettings["content"]["why_choose_us"]["features"] : DEFAULT_WHY_CHOOSE_US.features }
        : DEFAULT_WHY_CHOOSE_US,
      about: c.about
        ? { ...DEFAULT_ABOUT, ...c.about, points: Array.isArray(about["points"]) ? about["points"] as string[] : DEFAULT_ABOUT.points }
        : DEFAULT_ABOUT,
      testimonials: Array.isArray(c.testimonials) && c.testimonials.length > 0 ? c.testimonials : DEFAULT_TESTIMONIALS,
      faqs: Array.isArray(c.faqs) && c.faqs.length > 0 ? c.faqs : DEFAULT_FAQS,
      service_pages: mergeServicePages(c.service_pages as Record<string, unknown> | undefined),
      privacy_html: typeof c.privacy_html === "string" ? c.privacy_html : undefined,
      terms_html: typeof c.terms_html === "string" ? c.terms_html : undefined,
      about_page: c.about_page ? mergeAboutPage(c.about_page as unknown as Record<string, unknown>) : DEFAULT_ABOUT_PAGE,
      case_studies: Array.isArray(c.case_studies) && c.case_studies.length > 0
        ? c.case_studies as CmsSettings["content"]["case_studies"]
        : DEFAULT_CASE_STUDIES,
      blog_newsletter_cta: c.blog_newsletter_cta
        ? { ...DEFAULT_BLOG_NEWSLETTER_CTA, ...(c.blog_newsletter_cta as BlogNewsletterCta) }
        : DEFAULT_BLOG_NEWSLETTER_CTA,
    },
    navigation: mergeNavigation(s.navigation),
  };
}

function applyRawSettings(s: CmsSettings, setSettings: (v: CmsSettings) => void) {
  setSettings(normalizeSettings(s));
}

// ── SSR-aware Provider ────────────────────────────────────────────────────────
// The only change vs the original: accepts optional `initialData` prop.
// When provided (server pre-fetch), the context starts loaded with real data —
// no loading flash, no hydration mismatch, crawlers see full content.

interface CmsProviderProps {
  children: ReactNode;
  /**
   * Pre-fetched raw CMS data from the server.
   * On the client, falls back to window.__INITIAL_CMS__ injected by the SSR HTML.
   */
  initialData?: Record<string, unknown>;
}

export function CmsProvider({ children, initialData }: CmsProviderProps) {
  // On the client, use window.__INITIAL_CMS__ if no prop provided
  const seed =
    initialData ??
    (typeof window !== "undefined"
      ? ((window as unknown as Record<string, unknown>).__INITIAL_CMS__ as CmsSettings | undefined)
      : undefined);

  const [settings, setSettings] = useState<CmsSettings>(() => {
    if (seed) {
      return normalizeSettings(seed as Partial<CmsSettings>);
    }
    return defaultSettings;
  });
  const [loading, setLoading] = useState(!seed);

  const refreshSettings = async () => {
    const s = await fetchPublicSettings();
    if (s) applyRawSettings(s, setSettings);
  };

  useEffect(() => {
    if (!seed) {
      // No SSR data — fetch normally
      fetchPublicSettings().then((s) => {
        if (s) applyRawSettings(s, setSettings);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    // Refresh every 5 minutes so long-lived tabs stay fresh
    const id = setInterval(refreshSettings, 5 * 60 * 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CmsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </CmsContext.Provider>
  );
}

// ── All hooks — identical to original ────────────────────────────────────────

export function useHero() {
  const { settings } = useCms();
  return settings.content.hero;
}

export function useCms() {
  return useContext(CmsContext);
}

export function usePageContent(path: string) {
  const { settings } = useCms();
  return settings.content.pages[path] ?? DEFAULT_PAGE_CONTENT[path] ?? { headline: "", subheadline: "" };
}

export function usePageSeo(path: string) {
  const { settings } = useCms();
  return settings.seo[path] ?? DEFAULT_SEO[path] ?? { title: "", description: "", keywords: "", schema: "" };
}

export function useCompanyStats() {
  const { settings } = useCms();
  return settings.content.stats;
}

export function useGrowthPartner() {
  const { settings } = useCms();
  return settings.content.growth_partner;
}

export function useAiAdvantage() {
  const { settings } = useCms();
  return settings.content.ai_advantage;
}

export function useServicesSection() {
  const { settings } = useCms();
  return settings.content.services_section;
}

export function useWhyChooseUs() {
  const { settings } = useCms();
  return settings.content.why_choose_us;
}

export function useAboutContent() {
  const { settings } = useCms();
  return settings.content.about;
}

export function useTestimonials() {
  const { settings } = useCms();
  return settings.content.testimonials;
}

export function useFaqs() {
  const { settings } = useCms();
  return settings.content.faqs;
}

export function useServicePageData(path: string) {
  const { settings } = useCms();
  return settings.content.service_pages[path] ?? DEFAULT_SERVICE_PAGES[path] ?? { benefits: [], process_steps: [], pricing: [] };
}

export function useAboutPageContent() {
  const { settings } = useCms();
  return settings.content.about_page ?? DEFAULT_ABOUT_PAGE;
}

export function useCaseStudies() {
  const { settings } = useCms();
  return settings.content.case_studies ?? DEFAULT_CASE_STUDIES;
}

export function useContactContent() {
  const { settings } = useCms();
  return settings.content.contact;
}

export function useBlogNewsletterCta() {
  const { settings } = useCms();
  return settings.content.blog_newsletter_cta ?? DEFAULT_BLOG_NEWSLETTER_CTA;
}

export function useNavigation(): NavigationSettings {
  const { settings } = useCms();
  return settings.navigation ?? DEFAULT_NAVIGATION;
}
