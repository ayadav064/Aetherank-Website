/**
 * CmsContext.tsx — SSR-aware version
 *
 * Key change: CmsProvider now accepts an optional `initialData` prop.
 * When provided (server-side pre-fetch or window.__INITIAL_CMS__ from
 * the injected script), the context starts in a loaded state with real
 * data — no loading flash, no hydration mismatch.
 *
 * DEPLOY TO: artifacts/aetherank-website/src/context/CmsContext.tsx
 *
 * All existing hook exports (useCompanyStats, useGrowthPartner, etc.)
 * are unchanged — drop-in replacement.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
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

// ── helpers (unchanged from original) ────────────────────────────────────────

function mergeAboutPage(
  saved: Record<string, unknown>
): CmsSettings["content"]["about_page"] {
  return {
    stats: Array.isArray(saved["stats"])
      ? (saved["stats"] as typeof DEFAULT_ABOUT_PAGE.stats)
      : DEFAULT_ABOUT_PAGE.stats,
    story_paragraphs: Array.isArray(saved["story_paragraphs"])
      ? (saved["story_paragraphs"] as string[])
      : DEFAULT_ABOUT_PAGE.story_paragraphs,
    story_quote:
      typeof saved["story_quote"] === "string"
        ? saved["story_quote"]
        : DEFAULT_ABOUT_PAGE.story_quote,
    story_points: Array.isArray(saved["story_points"])
      ? (saved["story_points"] as string[])
      : DEFAULT_ABOUT_PAGE.story_points,
    core_values: Array.isArray(saved["core_values"])
      ? (saved["core_values"] as typeof DEFAULT_ABOUT_PAGE.core_values)
      : DEFAULT_ABOUT_PAGE.core_values,
    team_total:
      typeof saved["team_total"] === "string"
        ? saved["team_total"]
        : DEFAULT_ABOUT_PAGE.team_total,
    team_roles: Array.isArray(saved["team_roles"])
      ? (saved["team_roles"] as typeof DEFAULT_ABOUT_PAGE.team_roles)
      : DEFAULT_ABOUT_PAGE.team_roles,
    india_points: Array.isArray(saved["india_points"])
      ? (saved["india_points"] as string[])
      : DEFAULT_ABOUT_PAGE.india_points,
    india_stats: Array.isArray(saved["india_stats"])
      ? (saved["india_stats"] as typeof DEFAULT_ABOUT_PAGE.india_stats)
      : DEFAULT_ABOUT_PAGE.india_stats,
  };
}

function mergeNavigation(
  saved: NavigationSettings | undefined
): NavigationSettings {
  if (!saved) return DEFAULT_NAVIGATION;
  return {
    header:
      Array.isArray(saved.header) && saved.header.length > 0
        ? saved.header
        : DEFAULT_NAVIGATION.header,
    footer_columns:
      Array.isArray(saved.footer_columns) && saved.footer_columns.length > 0
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
        ...DEFAULT_SERVICE_PAGES[key],
        ...(typeof sp["hero_title"] === "string"
          ? { hero_title: sp["hero_title"] }
          : {}),
        ...(typeof sp["hero_subtitle"] === "string"
          ? { hero_subtitle: sp["hero_subtitle"] }
          : {}),
        ...(Array.isArray(sp["features"])
          ? { features: sp["features"] as typeof DEFAULT_SERVICE_PAGES[string]["features"] }
          : {}),
        ...(Array.isArray(sp["faqs"])
          ? { faqs: sp["faqs"] as typeof DEFAULT_SERVICE_PAGES[string]["faqs"] }
          : {}),
      };
    } else {
      result[key] = DEFAULT_SERVICE_PAGES[key];
    }
  }
  return result;
}

function parseSettings(raw: Record<string, unknown>): CmsSettings {
  const content = (raw["content"] ?? {}) as Record<string, unknown>;
  const seo = (raw["seo"] ?? {}) as Record<string, unknown>;

  return {
    seo: {
      ...DEFAULT_SEO,
      ...(seo as Partial<typeof DEFAULT_SEO>),
    },
    content: {
      hero: (content["hero"] as typeof DEFAULT_CONTENT.hero) ?? DEFAULT_CONTENT.hero,
      stats: (content["stats"] as typeof DEFAULT_STATS) ?? DEFAULT_STATS,
      page_content:
        (content["page_content"] as typeof DEFAULT_PAGE_CONTENT) ??
        DEFAULT_PAGE_CONTENT,
      growth_partner:
        (content["growth_partner"] as typeof DEFAULT_GROWTH_PARTNER) ??
        DEFAULT_GROWTH_PARTNER,
      ai_advantage:
        (content["ai_advantage"] as typeof DEFAULT_AI_ADVANTAGE) ??
        DEFAULT_AI_ADVANTAGE,
      services_section:
        (content["services_section"] as typeof DEFAULT_SERVICES_SECTION) ??
        DEFAULT_SERVICES_SECTION,
      why_choose_us:
        (content["why_choose_us"] as typeof DEFAULT_WHY_CHOOSE_US) ??
        DEFAULT_WHY_CHOOSE_US,
      about: (content["about"] as typeof DEFAULT_ABOUT) ?? DEFAULT_ABOUT,
      testimonials:
        (content["testimonials"] as typeof DEFAULT_TESTIMONIALS) ??
        DEFAULT_TESTIMONIALS,
      faqs: (content["faqs"] as typeof DEFAULT_FAQS) ?? DEFAULT_FAQS,
      service_pages: mergeServicePages(
        content["service_pages"] as Record<string, unknown>
      ),
      about_page: content["about_page"]
        ? mergeAboutPage(content["about_page"] as Record<string, unknown>)
        : DEFAULT_ABOUT_PAGE,
      case_studies:
        (content["case_studies"] as typeof DEFAULT_CASE_STUDIES) ??
        DEFAULT_CASE_STUDIES,
      blog_newsletter_cta:
        (content["blog_newsletter_cta"] as BlogNewsletterCta) ??
        DEFAULT_BLOG_NEWSLETTER_CTA,
      navigation: mergeNavigation(
        content["navigation"] as NavigationSettings | undefined
      ),
    },
  };
}

// ── Provider ─────────────────────────────────────────────────────────────────

interface CmsProviderProps {
  children: ReactNode;
  /**
   * Pre-fetched CMS data injected by the Express SSR layer.
   * On the client this comes from window.__INITIAL_CMS__ (script injected
   * into the HTML by the server). On the server it's passed directly from
   * the DB query in app.ts.
   */
  initialData?: Record<string, unknown>;
}

export function CmsProvider({ children, initialData }: CmsProviderProps) {
  // On the client, fall back to window.__INITIAL_CMS__ if no prop provided
  const seed =
    initialData ??
    (typeof window !== "undefined"
      ? (window as Record<string, unknown>).__INITIAL_CMS__ as
          | Record<string, unknown>
          | undefined
      : undefined);

  const [settings, setSettings] = useState<CmsSettings>(() =>
    seed ? parseSettings(seed) : defaultSettings
  );
  const [loading, setLoading] = useState(!seed);

  async function load() {
    try {
      const raw = await fetchPublicSettings();
      setSettings(parseSettings(raw as Record<string, unknown>));
    } catch {
      // keep whatever we have
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // If we already have SSR data, skip the initial fetch.
    // Still poll every 5 min so long-lived tabs stay fresh.
    if (!seed) {
      load();
    } else {
      setLoading(false);
    }

    const id = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshSettings() {
    await load();
  }

  return (
    <CmsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </CmsContext.Provider>
  );
}

// ── Hooks (all unchanged) ─────────────────────────────────────────────────────

export function useCmsSettings() {
  return useContext(CmsContext);
}

export function useCompanyStats() {
  const { settings } = useContext(CmsContext);
  return settings.content.stats ?? DEFAULT_STATS;
}

export function useGrowthPartner() {
  const { settings } = useContext(CmsContext);
  return settings.content.growth_partner ?? DEFAULT_GROWTH_PARTNER;
}

export function useAiAdvantage() {
  const { settings } = useContext(CmsContext);
  return settings.content.ai_advantage ?? DEFAULT_AI_ADVANTAGE;
}

export function useServicesSection() {
  const { settings } = useContext(CmsContext);
  return settings.content.services_section ?? DEFAULT_SERVICES_SECTION;
}

export function useWhyChooseUs() {
  const { settings } = useContext(CmsContext);
  return settings.content.why_choose_us ?? DEFAULT_WHY_CHOOSE_US;
}

export function useAboutContent() {
  const { settings } = useContext(CmsContext);
  return settings.content.about ?? DEFAULT_ABOUT;
}

export function useTestimonials() {
  const { settings } = useContext(CmsContext);
  return settings.content.testimonials ?? DEFAULT_TESTIMONIALS;
}

export function useFaqs() {
  const { settings } = useContext(CmsContext);
  return settings.content.faqs ?? DEFAULT_FAQS;
}

export function useContactContent() {
  const { settings } = useContext(CmsContext);
  return settings.content.page_content?.contact ?? DEFAULT_PAGE_CONTENT.contact;
}

export function useCaseStudies() {
  const { settings } = useContext(CmsContext);
  return settings.content.case_studies ?? DEFAULT_CASE_STUDIES;
}

export function useAboutPage() {
  const { settings } = useContext(CmsContext);
  return settings.content.about_page ?? DEFAULT_ABOUT_PAGE;
}

export function useNavigation() {
  const { settings } = useContext(CmsContext);
  return settings.content.navigation ?? DEFAULT_NAVIGATION;
}
