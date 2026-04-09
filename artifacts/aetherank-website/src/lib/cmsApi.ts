/**
 * Blog source priority (set in Netlify environment variables):
 *
 * 1. VITE_WP_API_URL  — WordPress REST API root, e.g. https://yoursite.com/wp-json
 *    Posts are fetched live from WordPress. No backend needed.
 *
 * 2. VITE_API_BASE_URL — Railway Express backend, e.g. https://your-app.up.railway.app
 *    Used when WordPress is not configured.
 *
 * 3. Static fallback — 22 built-in articles baked into the bundle.
 *    Used automatically when neither env var is set.
 */
const API_BASE: string = (import.meta as unknown as { env: Record<string, string> }).env.VITE_API_BASE_URL ?? "";
const WP_API: string = (import.meta as unknown as { env: Record<string, string> }).env.VITE_WP_API_URL ?? "";

export interface SeoPageSettings {
  title: string;
  description: string;
  keywords: string;
  schema: string;
  faq_schema?: string;
}

export interface PageHeroContent {
  headline: string;
  headline_highlight?: string;
  subheadline: string;
  cta_text?: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  cta_primary: string;
  cta_secondary: string;
}

export interface ContactContent {
  email: string;
  phone: string;
  address_1: string;
  address_2: string;
  address_3?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  logo_url?: string;
  favicon_url?: string;
  footer_tagline?: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface TestimonialItem {
  name: string;
  company: string;
  text: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface AiAdvantageCard {
  title: string;
  desc: string;
  stat: string;
  statLabel: string;
}

export interface HomeServiceCard {
  title: string;
  desc: string;
  link: string;
}

export interface WhyChooseUsFeature {
  title: string;
  desc: string;
}

export interface WhyChooseUsContent {
  headline: string;
  subheadline: string;
  features: WhyChooseUsFeature[];
  big_stat: string;
  big_label: string;
  stat2: string;
  stat2_label: string;
  stat3: string;
  stat3_label: string;
}

export interface GrowthPartnerPillar {
  title: string;
  desc: string;
}

export interface GrowthPartnerContent {
  headline: string;
  subheadline: string;
  pillars: GrowthPartnerPillar[];
}

export interface AiAdvantageSectionContent {
  section_headline: string;
  section_subheadline: string;
  cards: AiAdvantageCard[];
}

export interface ServicesSectionContent {
  headline: string;
  subheadline: string;
  cards: HomeServiceCard[];
}

export interface AboutContent {
  headline: string;
  subheadline: string;
  points: string[];
}

export interface CoreValueItem {
  title: string;
  desc: string;
}

export interface TeamRoleItem {
  label: string;
  count: string;
}

export interface IndiaStatItem {
  value: string;
  label: string;
  sub: string;
}

export interface AboutPageContent {
  stats: StatItem[];
  story_paragraphs: string[];
  story_quote: string;
  story_points: string[];
  core_values: CoreValueItem[];
  team_total: string;
  team_roles: TeamRoleItem[];
  india_points: string[];
  india_stats: IndiaStatItem[];
}

export interface CaseStudyItem {
  id: number;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  metric1: string;
  label1: string;
  metric2: string;
  label2: string;
  timeline: string;
  image: string;
}

export interface BenefitItem {
  title: string;
  desc: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  desc: string;
  popular?: boolean;
  features?: string[];
}

export interface ServicePageData {
  benefits: BenefitItem[];
  process_steps: ProcessStep[];
  pricing: PricingPlan[];
  faqs?: FaqItem[];
}

export interface BlogNewsletterCta {
  heading: string;
  subheading: string;
  button_text: string;
  placeholder: string;
}

export interface NavigationLink {
  label: string;
  path: string;
}

export interface FooterColumn {
  heading: string;
  links: NavigationLink[];
}

export interface NavigationSettings {
  header: NavigationLink[];
  footer_columns: FooterColumn[];
}

export const DEFAULT_NAVIGATION: NavigationSettings = {
  header: [
    { label: "Home", path: "/" },
    { label: "Case Studies", path: "/case-studies" },
    { label: "About Us", path: "/about-us" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ],
  footer_columns: [
    {
      heading: "Services",
      links: [
        { label: "SEO & GEO Optimization", path: "/services/seo" },
        { label: "Google Ads (PPC)", path: "/services/ppc" },
        { label: "Meta Ads", path: "/services/meta-ads" },
        { label: "Social Media", path: "/services/social-media" },
        { label: "Web Design & Development", path: "/services/web-design-development" },
        { label: "Content Marketing", path: "/services/content-marketing" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About Us", path: "/about-us" },
        { label: "Case Studies", path: "/case-studies" },
        { label: "Blog", path: "/blog" },
        { label: "Contact", path: "/contact" },
      ],
    },
  ],
};

export interface CmsSettings {
  seo: Record<string, SeoPageSettings>;
  content: {
    hero: HeroContent;
    contact: ContactContent;
    pages: Record<string, PageHeroContent>;
    stats: StatItem[];
    growth_partner: GrowthPartnerContent;
    ai_advantage: AiAdvantageSectionContent;
    services_section: ServicesSectionContent;
    why_choose_us: WhyChooseUsContent;
    about: AboutContent;
    testimonials: TestimonialItem[];
    faqs: FaqItem[];
    service_pages: Record<string, ServicePageData>;
    privacy_html?: string;
    terms_html?: string;
    about_page?: AboutPageContent;
    case_studies?: CaseStudyItem[];
    blog_newsletter_cta?: BlogNewsletterCta;
  };
  technical?: {
    robots_txt?: string;
    sitemap_site_url?: string;
  };
  navigation?: NavigationSettings;
}

const TOKEN_KEY = "aetherank_admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function adminLogin(password: string): Promise<string> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? "Login failed");
  }
  const data = (await res.json()) as { token: string };
  return data.token;
}

export async function fetchPublicSettings(): Promise<CmsSettings | null> {
  try {
    const res = await fetch("/api/settings");
    if (!res.ok) return null;
    return (await res.json()) as CmsSettings;
  } catch {
    return null;
  }
}

export async function fetchSettings(): Promise<CmsSettings | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch("/api/admin/settings", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as CmsSettings;
  } catch {
    return null;
  }
}

export async function saveSettings(settings: CmsSettings): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch("/api/admin/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settings),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? "Save failed");
  }
}

const S = (obj: object) => JSON.stringify(obj, null, 2);

const SHARED_FAQ_SCHEMA = S({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What services does Aetherank offer?", "acceptedAnswer": { "@type": "Answer", "text": "We offer SEO & GEO Optimization, Google Ads (PPC), Social Media Marketing, Web Design & Development, Content Marketing, and Online Reputation Management — all tailored for Indian businesses." } },
    { "@type": "Question", "name": "How is GEO different from traditional SEO?", "acceptedAnswer": { "@type": "Answer", "text": "Traditional SEO optimises for keyword rankings on Google. GEO (Generative Engine Optimization) goes further — it optimises your content to appear inside AI-generated answers on ChatGPT, Perplexity, and Google's AI Overviews, capturing the next wave of search traffic." } },
    { "@type": "Question", "name": "How long before I see results?", "acceptedAnswer": { "@type": "Answer", "text": "PPC campaigns can generate leads within days. SEO & GEO typically shows measurable growth in 3–6 months. Social media and content marketing build momentum over 60–90 days. We set clear milestones so you always know where you stand." } },
    { "@type": "Question", "name": "Do you work with small and mid-sized businesses?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — most of our clients are SMEs and growing startups across India. We design packages around your budget and scale with you as you grow." } },
    { "@type": "Question", "name": "What does a free audit include?", "acceptedAnswer": { "@type": "Answer", "text": "Your free audit covers a full SEO health check, competitor gap analysis, Google Ads efficiency review, social media presence score, and a personalised growth roadmap — delivered within 48 hours, no strings attached." } },
    { "@type": "Question", "name": "How do I get started?", "acceptedAnswer": { "@type": "Answer", "text": "Simply click 'Get Free Website Audit' or 'Book a Free Strategy Call'. Our team will reach out within one business day to schedule a discovery call and understand your goals." } },
  ],
});

export const DEFAULT_SEO: Record<string, SeoPageSettings> = {
  "/": {
    title: "Aetherank | Digital Marketing Agency in Mumbai",
    description: "Aetherank is a results-driven digital marketing agency in Mumbai. We specialise in SEO, GEO, PPC, Social Media, Web Design & Content Marketing.",
    keywords: "digital marketing agency mumbai, seo agency india, ppc management, social media marketing agency",
    schema: S({ "@context": "https://schema.org", "@graph": [{ "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com", "logo": { "@type": "ImageObject", "url": "https://aetherank.com/favicon.svg" }, "contactPoint": { "@type": "ContactPoint", "telephone": "+91-80109-60269", "contactType": "customer service" }, "address": { "@type": "PostalAddress", "streetAddress": "Tardeo AC Market", "addressLocality": "Mumbai", "addressRegion": "Maharashtra", "postalCode": "400034", "addressCountry": "IN" }, "sameAs": ["https://www.instagram.com/aetherank", "https://www.linkedin.com/company/aetherank"] }, { "@type": "WebSite", "name": "Aetherank", "url": "https://aetherank.com" }, { "@type": "LocalBusiness", "name": "Aetherank Digital Marketing Agency", "@id": "https://aetherank.com/#localbusiness", "url": "https://aetherank.com", "telephone": "+91-80109-60269", "address": { "@type": "PostalAddress", "streetAddress": "Tardeo AC Market", "addressLocality": "Mumbai", "addressRegion": "Maharashtra", "postalCode": "400034", "addressCountry": "IN" }, "priceRange": "₹₹", "openingHours": "Mo-Fr 09:00-18:00" }] }),
    faq_schema: SHARED_FAQ_SCHEMA,
  },
  "/about-us": {
    title: "About Us | Aetherank Digital Marketing Agency",
    description: "Learn about Aetherank — a Mumbai-based digital marketing agency with 5+ years experience scaling 100+ brands across India.",
    keywords: "about aetherank, digital marketing company mumbai, marketing team india",
    schema: S({ "@context": "https://schema.org", "@type": "AboutPage", "name": "About Aetherank Digital Marketing Agency", "url": "https://aetherank.com/about-us", "description": "Aetherank is an AI-powered digital marketing agency headquartered in India, scaling ambitious brands with data-driven strategies.", "publisher": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com" } }),
  },
  "/services": {
    title: "Digital Marketing Services in Mumbai, India | Aetherank",
    description: "Explore Aetherank's full suite of digital marketing services: SEO, GEO, PPC, Social Media, Web Design, Content Marketing & ORM.",
    keywords: "digital marketing services, seo services india, ppc agency, social media management",
    schema: S({ "@context": "https://schema.org", "@type": "CollectionPage", "name": "Digital Marketing Services | Aetherank", "url": "https://aetherank.com/services", "description": "End-to-end digital marketing services to elevate your brand, drive qualified traffic, and multiply revenue.", "provider": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com" } }),
  },
  "/services/seo": {
    title: "SEO & GEO Optimization Services in Mumbai | Aetherank",
    description: "Rank higher on Google and AI search engines with Aetherank's SEO and GEO services. Data-driven strategies for sustainable organic growth.",
    keywords: "seo services mumbai, geo optimization, search engine optimization india, organic growth",
    schema: S({ "@context": "https://schema.org", "@type": "Service", "name": "SEO & GEO Services", "serviceType": "Search Engine Optimisation", "provider": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com" }, "areaServed": { "@type": "Country", "name": "India" }, "description": "Rank higher on Google and AI search engines. Data-driven SEO and GEO strategies for sustainable organic growth.", "url": "https://aetherank.com/services/seo", "offers": { "@type": "Offer", "priceCurrency": "INR", "availability": "https://schema.org/InStock" } }),
    faq_schema: SHARED_FAQ_SCHEMA,
  },
  "/services/ppc": {
    title: "PPC & Google Ads Management Services India | Aetherank",
    description: "Maximise your ROI with Aetherank's PPC and paid advertising services. Google Ads, Meta Ads, and performance-driven campaigns.",
    keywords: "ppc agency mumbai, google ads management, meta ads india, paid advertising",
    schema: S({ "@context": "https://schema.org", "@type": "Service", "name": "PPC & Google Ads Management", "serviceType": "Pay-Per-Click Advertising", "provider": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com" }, "areaServed": { "@type": "Country", "name": "India" }, "description": "Hyper-targeted PPC campaigns that maximise ROAS and generate high-quality leads instantly.", "url": "https://aetherank.com/services/ppc", "offers": { "@type": "Offer", "priceCurrency": "INR", "availability": "https://schema.org/InStock" } }),
    faq_schema: SHARED_FAQ_SCHEMA,
  },
  "/services/social-media": {
    title: "Social Media Marketing Services in India | Aetherank",
    description: "Build your brand on Instagram, Facebook, LinkedIn, and YouTube with Aetherank's social media marketing services.",
    keywords: "social media marketing mumbai, instagram marketing, facebook ads, linkedin marketing india",
    schema: S({ "@context": "https://schema.org", "@type": "Service", "name": "Social Media Marketing", "serviceType": "Social Media Management", "provider": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com" }, "areaServed": { "@type": "Country", "name": "India" }, "description": "Build a loyal community and turn followers into customers across Instagram, LinkedIn, Facebook, and YouTube.", "url": "https://aetherank.com/services/social-media" }),
    faq_schema: SHARED_FAQ_SCHEMA,
  },
  "/services/web-design-development": {
    title: "Web Design & Development Services Mumbai | Aetherank",
    description: "Get a stunning, high-converting website designed and developed by Aetherank. Landing pages, corporate sites, and e-commerce stores.",
    keywords: "web design mumbai, website development india, landing page design, e-commerce website",
    schema: S({ "@context": "https://schema.org", "@type": "Service", "name": "Web Design & Development", "serviceType": "Web Development", "provider": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com" }, "areaServed": { "@type": "Country", "name": "India" }, "description": "Stunning, fast, and conversion-optimised websites that turn visitors into customers.", "url": "https://aetherank.com/services/web-design-development", "offers": [{ "@type": "Offer", "name": "Landing Page", "price": "10000", "priceCurrency": "INR" }, { "@type": "Offer", "name": "Corporate Website", "price": "25000", "priceCurrency": "INR" }, { "@type": "Offer", "name": "E-Commerce Store", "price": "45000", "priceCurrency": "INR" }] }),
    faq_schema: SHARED_FAQ_SCHEMA,
  },
  "/services/content-marketing": {
    title: "Content Marketing Services | Aetherank",
    description: "Drive organic traffic and build authority with Aetherank's content marketing services. Blogs, videos, infographics & more.",
    keywords: "content marketing agency india, blog writing service, content strategy mumbai",
    schema: S({ "@context": "https://schema.org", "@type": "Service", "name": "Content Marketing", "serviceType": "Content Marketing", "provider": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com" }, "areaServed": { "@type": "Country", "name": "India" }, "description": "Strategic content that drives organic traffic, builds authority, and supports SEO and GEO efforts.", "url": "https://aetherank.com/services/content-marketing" }),
    faq_schema: SHARED_FAQ_SCHEMA,
  },
  "/services/orm": {
    title: "Online Reputation Management | Aetherank",
    description: "Protect and build your brand reputation online with Aetherank's ORM services. Monitor, manage, and improve how you appear online.",
    keywords: "online reputation management india, orm services mumbai, brand reputation management",
    schema: S({ "@context": "https://schema.org", "@type": "Service", "name": "Online Reputation Management", "serviceType": "Reputation Management", "provider": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com" }, "areaServed": { "@type": "Country", "name": "India" }, "description": "Protect your brand image, suppress negative search results, and build a 5-star reputation online.", "url": "https://aetherank.com/services/orm" }),
    faq_schema: SHARED_FAQ_SCHEMA,
  },
  "/services/meta-ads": {
    title: "Meta Ads Management (Facebook & Instagram) | Aetherank",
    description: "Expert Meta Ads management for Facebook & Instagram. Drive targeted traffic, generate quality leads, and scale your sales with ROI-focused ad campaigns.",
    keywords: "meta ads agency india, facebook ads management, instagram ads agency, meta advertising mumbai, facebook marketing india",
    schema: S({ "@context": "https://schema.org", "@type": "Service", "name": "Meta Ads Management", "serviceType": "Social Media Advertising", "provider": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com" }, "areaServed": { "@type": "Country", "name": "India" }, "description": "Expert Meta Ads management for Facebook & Instagram — precision targeting, high-converting creatives, and relentless optimisation.", "url": "https://aetherank.com/services/meta-ads" }),
    faq_schema: SHARED_FAQ_SCHEMA,
  },
  "/case-studies": {
    title: "Case Studies | Aetherank Digital Marketing",
    description: "See real results from real brands. Explore Aetherank's case studies showing measurable growth in traffic, leads, and revenue.",
    keywords: "digital marketing case studies india, seo results, marketing success stories",
    schema: S({ "@context": "https://schema.org", "@type": "CollectionPage", "name": "Aetherank Case Studies", "url": "https://aetherank.com/case-studies", "description": "Real results from real brands — measurable growth in traffic, leads, and revenue.", "publisher": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com" } }),
  },
  "/blog": {
    title: "Digital Marketing Blog | Expert SEO & Growth Insights | Aetherank",
    description: "Stay ahead with expert insights on SEO, GEO, PPC, social media, and digital marketing trends from the Aetherank team.",
    keywords: "digital marketing blog india, seo tips, marketing insights, geo optimization blog",
    schema: S({ "@context": "https://schema.org", "@type": "Blog", "name": "Aetherank Digital Marketing Blog", "url": "https://aetherank.com/blog", "description": "Expert insights on SEO, GEO, PPC, social media, and digital marketing trends.", "publisher": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com", "logo": { "@type": "ImageObject", "url": "https://aetherank.com/logo.svg" } } }),
  },
  "/contact": {
    title: "Contact Us | Aetherank Digital Marketing Agency",
    description: "Get in touch with Aetherank. Our team in Mumbai is ready to help you grow your business online. Call, email, or visit us.",
    keywords: "contact aetherank, digital marketing agency contact mumbai, marketing consultation",
    schema: S({ "@context": "https://schema.org", "@type": "ContactPage", "name": "Contact Aetherank", "url": "https://aetherank.com/contact", "description": "Reach out to Aetherank's team in Mumbai for digital marketing consultations.", "contactOption": { "@type": "ContactPoint", "telephone": "+91-80109-60269", "email": "help@aetherank.com", "contactType": "customer support" } }),
  },
  "/free-audit": {
    title: "Free Digital Marketing Audit | Aetherank",
    description: "Get a free comprehensive audit of your website's SEO, social media, and digital presence. No commitment required.",
    keywords: "free seo audit india, website audit, digital marketing audit mumbai",
    schema: S({ "@context": "https://schema.org", "@type": "Service", "name": "Free Digital Marketing Audit", "serviceType": "Digital Marketing Audit", "provider": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com" }, "description": "Free comprehensive audit of your website's SEO, social media, and digital presence.", "url": "https://aetherank.com/free-audit", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "availability": "https://schema.org/InStock" } }),
  },
  "/request-proposal": {
    title: "Request a Custom Digital Marketing Proposal | Aetherank",
    description: "Ready to grow? Request a custom digital marketing proposal from Aetherank tailored to your business goals and budget.",
    keywords: "digital marketing proposal india, marketing quote mumbai, hire digital marketing agency",
    schema: S({ "@context": "https://schema.org", "@type": "WebPage", "name": "Request a Proposal | Aetherank", "url": "https://aetherank.com/request-proposal", "description": "Request a custom digital marketing proposal tailored to your business goals and budget.", "publisher": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com" } }),
  },
  "/privacy-policy": {
    title: "Privacy Policy | Aetherank Digital Marketing Agency",
    description: "Read Aetherank's privacy policy to understand how we collect, use, and protect your personal data in compliance with applicable laws.",
    keywords: "aetherank privacy policy, data protection, personal data",
    schema: S({ "@context": "https://schema.org", "@type": "WebPage", "name": "Privacy Policy | Aetherank", "url": "https://aetherank.com/privacy-policy", "description": "How Aetherank collects, uses, and protects your personal data.", "publisher": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com" } }),
  },
  "/terms-of-service": {
    title: "Terms of Service | Aetherank Digital Marketing Agency",
    description: "Review Aetherank's terms of service governing use of our website and digital marketing services.",
    keywords: "aetherank terms of service, terms and conditions, service agreement",
    schema: S({ "@context": "https://schema.org", "@type": "WebPage", "name": "Terms of Service | Aetherank", "url": "https://aetherank.com/terms-of-service", "description": "Terms governing use of Aetherank's website and digital marketing services.", "publisher": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com" } }),
  },
  "/digital-marketing-company-india": {
    title: "Best Digital Marketing Company in India | Aetherank",
    description: "Aetherank is India's leading AI-powered digital marketing agency. SEO, Google Ads, Meta Ads, Social Media & Content Marketing for Indian businesses. Free audit available.",
    keywords: "digital marketing company india, digital marketing agency india, best digital marketing agency india, seo company india, online marketing india",
    schema: S({ "@context": "https://schema.org", "@type": "Service", "name": "Digital Marketing Services in India", "serviceType": "Digital Marketing", "provider": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com" }, "areaServed": { "@type": "Country", "name": "India" }, "description": "AI-powered SEO, Google Ads, Meta Ads, and Social Media Marketing for Indian businesses. Transparent results, no lock-in contracts.", "url": "https://aetherank.com/digital-marketing-company-india", "offers": { "@type": "Offer", "priceCurrency": "INR", "price": "15000", "availability": "https://schema.org/InStock" } }),
    faq_schema: S({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "Why should I choose a digital marketing agency in India?", "acceptedAnswer": { "@type": "Answer", "text": "India offers world-class talent at competitive prices. Agencies like Aetherank combine deep local market knowledge with global best practices to deliver measurable ROI." } }, { "@type": "Question", "name": "What digital marketing services do you offer in India?", "acceptedAnswer": { "@type": "Answer", "text": "We offer SEO & GEO, Google PPC, Meta & Instagram Ads, Social Media Management, Content Marketing, Web Design & Development, and Online Reputation Management." } }, { "@type": "Question", "name": "How long before we see results?", "acceptedAnswer": { "@type": "Answer", "text": "PPC and Meta Ads can deliver leads within the first week. SEO typically shows meaningful improvements in 3–6 months." } }] }),
  },
  "/digital-marketing-company-mumbai": {
    title: "Best Digital Marketing Company in Mumbai | Aetherank",
    description: "Aetherank is Mumbai's #1 AI-powered digital marketing agency. SEO, Google Ads, Meta & Instagram Ads for Mumbai businesses. Free Mumbai marketing audit.",
    keywords: "digital marketing company mumbai, digital marketing agency mumbai, seo agency mumbai, google ads mumbai, social media marketing mumbai",
    schema: S({ "@context": "https://schema.org", "@type": "Service", "name": "Digital Marketing Services in Mumbai", "serviceType": "Digital Marketing", "provider": { "@type": "Organization", "name": "Aetherank", "url": "https://aetherank.com" }, "areaServed": { "@type": "City", "name": "Mumbai" }, "description": "AI-powered SEO, Google Ads, Meta & Instagram Ads for Mumbai businesses. Covering Andheri, Bandra, Powai, Thane, Navi Mumbai and all of Greater Mumbai.", "url": "https://aetherank.com/digital-marketing-company-mumbai", "offers": { "@type": "Offer", "priceCurrency": "INR", "price": "15000", "availability": "https://schema.org/InStock" } }),
    faq_schema: S({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "Why hire a digital marketing agency in Mumbai?", "acceptedAnswer": { "@type": "Answer", "text": "Mumbai is India's commercial capital with intense competition. A Mumbai-focused agency understands local consumers and hyper-local competition, giving campaigns an immediate edge." } }, { "@type": "Question", "name": "Do you offer local SEO for specific Mumbai areas?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We optimise for hyper-local searches in Andheri, Bandra, Lower Parel, Powai, Thane, Navi Mumbai and all Mumbai neighbourhoods." } }, { "@type": "Question", "name": "What is your pricing for Mumbai clients?", "acceptedAnswer": { "@type": "Answer", "text": "Packages start at ₹15,000/month for startups and SMEs. Growth plans with full-funnel management start at ₹35,000/month." } }] }),
  },
};

export const DEFAULT_PAGE_CONTENT: Record<string, PageHeroContent> = {
  "/services": {
    headline: "Comprehensive Digital",
    headline_highlight: "Marketing Services",
    subheadline: "End-to-end solutions to elevate your brand, drive qualified traffic, and multiply your revenue.",
    cta_text: "Get Free Audit",
  },
  "/services/seo": {
    headline: "Search Engine",
    headline_highlight: "Optimization",
    subheadline: "Dominate the first page of Google. We use data-driven strategies to increase your organic visibility and drive high-intent traffic to your website.",
    cta_text: "Get Free SEO, GEO Audit",
  },
  "/services/ppc": {
    headline: "PPC &",
    headline_highlight: "Google Ads",
    subheadline: "Stop wasting ad spend. We create hyper-targeted campaigns that maximize your Return on Ad Spend (ROAS) and generate high-quality leads instantly.",
    cta_text: "Get Free Ads Audit",
  },
  "/services/social-media": {
    headline: "Social Media",
    headline_highlight: "Management",
    subheadline: "Build a loyal community, enhance brand awareness, and turn followers into paying customers across Instagram, LinkedIn, Facebook, and Twitter.",
    cta_text: "Get Free Social Audit",
  },
  "/services/web-design-development": {
    headline: "Web Design &",
    headline_highlight: "Development",
    subheadline: "Your website is your 24/7 salesperson. We build stunning, fast, and conversion-optimized websites that turn visitors into customers.",
    cta_text: "Request a Proposal",
  },
  "/services/content-marketing": {
    headline: "Content",
    headline_highlight: "Marketing",
    subheadline: "Words that sell. Engage your audience, build unquestionable authority, and support your SEO, GEO efforts with high-quality, strategic content.",
    cta_text: "Get Content Audit",
  },
  "/services/orm": {
    headline: "Online Reputation",
    headline_highlight: "Management",
    subheadline: "Control the narrative. We protect your brand image, suppress negative search results, and build a 5-star reputation online.",
    cta_text: "Get Free Brand Audit",
  },
  "/services/meta-ads": {
    headline: "Meta Ads That",
    headline_highlight: "Drive Revenue",
    subheadline: "Facebook & Instagram advertising built for ROI — precise audience targeting, scroll-stopping creatives, and relentless optimisation to scale your business.",
    cta_text: "Get Free Meta Ads Audit",
  },
  "/about-us": {
    headline: "Engineering Growth for",
    headline_highlight: "Ambitious Brands",
    subheadline: "An AI-powered digital marketing agency headquartered in India — blending data science with creative brilliance to deliver measurable ROI.",
    cta_text: "Work With Us",
  },
  "/case-studies": {
    headline: "Our",
    headline_highlight: "Success Stories",
    subheadline: "Discover how we've helped ambitious brands scale their revenue, dominate search, and build lasting digital authority.",
  },
  "/blog": {
    headline: "Digital Marketing",
    headline_highlight: "Insights",
    subheadline: "Expert articles, case studies, and strategies from the Aetherank team to help you stay ahead in the digital landscape.",
  },
  "/free-audit": {
    headline: "Get Your FREE Comprehensive Website &",
    headline_highlight: "SEO, GEO Audit",
    subheadline: "Discover hidden issues costing you leads & traffic. Receive a detailed 15+ page audit report in 48 hours, plus a personalized strategy call.",
    cta_text: "Claim Free Audit Now",
  },
  "/request-proposal": {
    headline: "Request Your",
    headline_highlight: "Custom Proposal",
    subheadline: "Tell us about your goals and we'll craft a bespoke digital marketing strategy tailored to your business.",
    cta_text: "Submit Proposal Request",
  },
  "/contact": {
    headline: "Let's Grow",
    headline_highlight: "Together",
    subheadline: "Our team in Mumbai is ready to help you dominate your market. Reach out and let's start a conversation.",
    cta_text: "Send Message",
  },
  "/digital-marketing-company-india": {
    headline: "Best Digital Marketing",
    headline_highlight: "Company in India",
    subheadline: "AI-powered SEO, Google Ads, Meta Ads, and social media marketing that drives real leads and revenue for Indian businesses — with full transparency and no lock-in contracts.",
    cta_text: "Get Free Marketing Audit",
  },
  "/digital-marketing-company-mumbai": {
    headline: "Digital Marketing Company",
    headline_highlight: "in Mumbai",
    subheadline: "AI-powered SEO, Google Ads, Meta & Instagram Ads for Mumbai businesses. More leads, more revenue — with zero guesswork and complete transparency.",
    cta_text: "Get Free Mumbai Audit",
  },
};

export const DEFAULT_STATS: StatItem[] = [
  { value: "5+", label: "Years of Excellence" },
  { value: "100+", label: "Brands Scaled" },
  { value: "3+", label: "Global Offices" },
  { value: "98%", label: "Client Retention" },
];

export const DEFAULT_GROWTH_PARTNER: GrowthPartnerContent = {
  headline: "We Don't Just Run Campaigns. We Build Brands.",
  subheadline: "Aetherank isn't a vendor — we're embedded partners in your growth story. We learn your business inside-out, craft strategies that fit your goals, and obsess over results that actually move the needle.",
  pillars: [
    { title: "Data-First Approach", desc: "Every decision is backed by real analytics — no guesswork, no vanity metrics." },
    { title: "AI-Powered Execution", desc: "We use cutting-edge AI tools to stay 3 steps ahead of your competition." },
    { title: "Radical Transparency", desc: "Weekly reports & live dashboards. You always know exactly where your money goes." },
  ],
};

export const DEFAULT_AI_ADVANTAGE: AiAdvantageSectionContent = {
  section_headline: "Every Service Engineered to Drive Revenue",
  section_subheadline: "We don't offer cookie-cutter packages. Every strategy is custom-built for your business, your city, your goals.",
  cards: [
    { title: "SEO, GEO & Content", desc: "Rank on Google and AI search engines — get found by the right customers every day, on autopilot.", stat: "+340%", statLabel: "avg. traffic growth" },
    { title: "Social Media & Reels", desc: "Viral-worthy content on Instagram & YouTube that converts followers into buyers.", stat: "3×", statLabel: "engagement increase" },
    { title: "Google & Meta Ads", desc: "Data-backed PPC campaigns with a clear ROI — not a single rupee wasted.", stat: "₹4.2", statLabel: "avg. return per ₹1 spent" },
    { title: "Website & Landing Pages", desc: "High-converting sites that turn visitors into paying customers within seconds.", stat: "58%", statLabel: "higher conversion rate" },
  ],
};

export const DEFAULT_SERVICES_SECTION: ServicesSectionContent = {
  headline: "Full-Funnel Services to Scale Your Brand",
  subheadline: "We don't just drive traffic; we drive revenue. Our comprehensive digital marketing services are tailored to dominate your specific market.",
  cards: [
    { title: "SEO, GEO Optimization", desc: "Dominate search rankings and AI answer engines with data-driven on-page, off-page, and technical SEO, GEO.", link: "/services/seo" },
    { title: "PPC & Google Ads", desc: "Maximize your ROI with precision-targeted paid campaigns and smart bidding.", link: "/services/ppc" },
    { title: "Social Media", desc: "Build brand authority and engaged communities across all major platforms.", link: "/services/social-media" },
    { title: "Web Design & Development", desc: "Convert visitors into customers with high-performance, conversion-optimized websites.", link: "/services/web-design-development" },
    { title: "Content Marketing", desc: "Engage your audience and build trust with compelling, high-quality content.", link: "/services/content-marketing" },
    { title: "Reputation Mgmt", desc: "Protect and enhance your brand image with proactive review and sentiment management.", link: "/services/orm" },
  ],
};

export const DEFAULT_WHY_CHOOSE_US: WhyChooseUsContent = {
  headline: "Why Top Indian Brands Choose Aetherank",
  subheadline: "We replace guesswork with data. Our AI-driven approach ensures every rupee you spend is optimized for maximum return.",
  features: [
    { title: "AI-Powered Strategies", desc: "Leveraging predictive analytics to stay ahead of market trends." },
    { title: "Pan-India Reach", desc: "Deep understanding of regional markets and consumer behavior." },
    { title: "Results-First Approach", desc: "We tie our success directly to your bottom-line growth." },
    { title: "Dedicated Account Managers", desc: "One point of contact for transparent, daily communication." },
  ],
  big_stat: "500%",
  big_label: "Average Client ROI",
  stat2: "98%",
  stat2_label: "Client Retention",
  stat3: "14+",
  stat3_label: "Years Experience",
};

export const DEFAULT_ABOUT: AboutContent = {
  headline: "India's Most Trusted AI Marketing Agency",
  subheadline: "Founded on a simple promise — digital marketing should be measurable, transparent, and tied directly to your revenue.",
  points: [
    "We treat your budget like our own — zero waste, maximum ROI.",
    "Real-time dashboards so you always know exactly what's happening.",
    "AI-driven strategies built for the Indian market, not copy-pasted templates.",
    "Dedicated account manager. One point of contact. Full accountability.",
  ],
};

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  { name: "Rahul Sharma", company: "TechNova India", text: "Aetherank completely overhauled our SEO, GEO strategy. We saw a 3x increase in inbound leads within just 4 months. Their team is transparent and highly skilled." },
  { name: "Priya Patel", company: "Luxe Boutiques", text: "The ROAS on our Google Ads campaigns went through the roof after Aetherank took over. They understand the Indian market dynamics perfectly." },
  { name: "Amit Kumar", company: "BuildRight Realty", text: "Our social media presence was non-existent. Aetherank built a community around our brand that directly translates into site visits and sales." },
  { name: "Sneha Reddy", company: "HealthPlus Clinics", text: "Professional, data-driven, and incredibly responsive. The new website they developed for us has a conversion rate we didn't think was possible." },
];

export const DEFAULT_FAQS: FaqItem[] = [
  { q: "What services does Aetherank offer?", a: "We offer SEO & GEO Optimization, Google Ads (PPC), Social Media Marketing, Web Design & Development, Content Marketing, and Online Reputation Management — all tailored for Indian businesses." },
  { q: "How is GEO different from traditional SEO?", a: "Traditional SEO optimises for keyword rankings on Google. GEO (Generative Engine Optimization) goes further — it optimises your content to appear inside AI-generated answers on ChatGPT, Perplexity, and Google's AI Overviews, capturing the next wave of search traffic." },
  { q: "How long before I see results?", a: "PPC campaigns can generate leads within days. SEO & GEO typically shows measurable growth in 3–6 months. Social media and content marketing build momentum over 60–90 days. We set clear milestones so you always know where you stand." },
  { q: "Do you work with small and mid-sized businesses?", a: "Yes — most of our clients are SMEs and growing startups across India. We design packages around your budget and scale with you as you grow." },
  { q: "What does a free audit include?", a: "Your free audit covers a full SEO health check, competitor gap analysis, Google Ads efficiency review, social media presence score, and a personalised growth roadmap — delivered within 48 hours, no strings attached." },
  { q: "How do I get started?", a: "Simply click 'Get Free Website Audit' or 'Book a Free Strategy Call'. Our team will reach out within one business day to schedule a discovery call and understand your goals." },
];

export const DEFAULT_SERVICE_PAGES: Record<string, ServicePageData> = {
  "/services/seo": {
    benefits: [
      { title: "Targeted Traffic", desc: "Attract visitors actively searching for your products or services." },
      { title: "Long-term ROI", desc: "Build an organic growth engine that compounds over time." },
      { title: "Local Dominance", desc: "Capture customers in your immediate geographic area." },
      { title: "Technical Excellence", desc: "Fast, mobile-friendly websites that Google loves." },
      { title: "Data-Driven", desc: "Every decision backed by comprehensive analytics." },
      { title: "Brand Authority", desc: "Establish your brand as the industry leader." },
    ],
    process_steps: [
      { step: "01", title: "Comprehensive Audit", desc: "We analyze your site's current standing, technical health, and competitor landscape." },
      { step: "02", title: "Keyword Strategy", desc: "Identifying high-value, low-competition keywords to target." },
      { step: "03", title: "On-Page & Technical Fixes", desc: "Optimizing structure, content, speed, and mobile usability." },
      { step: "04", title: "Content & Link Building", desc: "Creating valuable content and earning authoritative backlinks." },
    ],
    pricing: [
      { name: "Starter", price: "₹15,000/mo", desc: "Perfect for local businesses starting out.", features: ["Up to 20 target keywords", "On-page optimisation", "Google My Business setup", "Monthly ranking report"] },
      { name: "Standard", price: "₹35,000/mo", desc: "For growing brands needing aggressive growth.", popular: true, features: ["Up to 60 keywords", "Technical SEO + Core Web Vitals", "6 SEO-optimised blog posts/mo", "Link building (DA 30+)", "GEO / AI visibility optimisation", "Fortnightly strategy calls"] },
      { name: "Premium", price: "₹75,000+/mo", desc: "Enterprise-grade national campaigns.", features: ["Unlimited keywords", "Full technical + international SEO", "12+ blog posts & content assets/mo", "Premium link building (DA 50+)", "GEO + AI Overview optimisation", "Dedicated account manager"] },
    ],
    faqs: [
      { q: "What is the difference between SEO and GEO (Generative Engine Optimisation)?", a: "SEO (Search Engine Optimisation) focuses on ranking your website on traditional search engines like Google and Bing. GEO (Generative Engine Optimisation) is a newer discipline that optimises your brand's presence in AI-generated answers from tools like ChatGPT, Google AI Overviews, and Perplexity. At Aetherank we deliver both together so you capture traffic from every search touchpoint." },
      { q: "How long does it take to see results from SEO?", a: "SEO is a long-term investment. Most clients start seeing measurable improvements in rankings and organic traffic within 3–6 months. Highly competitive industries or brand-new websites may take 6–12 months. We set realistic milestones from day one and provide monthly reports so you can track progress transparently." },
      { q: "Do you provide local SEO services for Indian cities?", a: "Absolutely. We optimise your Google Business Profile, build location-specific citations, and create localised content targeting your city — whether that's Mumbai, Delhi, Bangalore, Hyderabad, or Tier-2 and Tier-3 markets. Local SEO is one of the fastest ways to drive footfall and calls for location-based businesses." },
      { q: "What does your monthly SEO reporting include?", a: "Every month you receive a detailed report covering keyword ranking movements, organic traffic trends, Core Web Vitals scores, backlink profile health, new content performance, and a list of completed technical fixes. We also include a clear plan of what we're working on next so you're never left guessing." },
      { q: "Can you guarantee first-page rankings on Google?", a: "No ethical SEO agency can guarantee specific rankings — and any that do should raise a red flag. What we can guarantee is a proven, white-hat methodology, complete transparency in our work, and a relentless focus on the metrics that matter most to your business: traffic, leads, and revenue." },
      { q: "Do you perform technical SEO audits before starting?", a: "Yes. Every engagement begins with a full technical audit covering site speed, crawlability, indexation, schema markup, mobile usability, duplicate content, and internal linking architecture. We fix the foundation first so your content and link-building efforts compound over time." },
    ],
  },
  "/services/ppc": {
    benefits: [
      { title: "Instant Visibility", desc: "Appear at the top of search results immediately." },
      { title: "Hyper-Targeting", desc: "Reach users based on exact intent, location, and behavior." },
      { title: "Cost Control", desc: "Pay only when someone clicks on your ad." },
      { title: "Measurable ROI", desc: "Track exactly how much revenue each ad generates." },
      { title: "Scalability", desc: "Easily scale up profitable campaigns." },
      { title: "A/B Testing", desc: "Continuous optimization of ad copy and landing pages." },
    ],
    process_steps: [
      { step: "01", title: "Account Audit & Setup", desc: "Reviewing existing campaigns or building a structured foundation from scratch." },
      { step: "02", title: "Keyword & Audience Research", desc: "Identifying the most profitable search terms and demographic segments." },
      { step: "03", title: "Ad Creation & Landing Pages", desc: "Crafting compelling ad copy and designing high-converting landing pages." },
      { step: "04", title: "Optimization & Scaling", desc: "Daily bid adjustments, negative keywords, and budget reallocation." },
    ],
    pricing: [
      { name: "Starter", price: "₹20,000/mo", desc: "Up to ₹1L Ad Spend. Google Search Only.", features: ["Google Search campaigns", "Up to 3 ad groups", "Keyword research & negative list", "Monthly performance report"] },
      { name: "Standard", price: "15% of Spend", desc: "₹1L - ₹5L Ad Spend. Search + Display.", popular: true, features: ["Google Search + Display + YouTube", "Conversion tracking setup", "A/B ad copy testing", "Landing page optimisation", "Fortnightly reporting calls", "Audience retargeting"] },
      { name: "Premium", price: "10% of Spend", desc: "₹5L+ Ad Spend. Full Google Suite.", features: ["Full Google Suite (Search, Display, YouTube, Shopping)", "Meta & LinkedIn Ads management", "Dedicated PPC strategist", "Daily bid management", "Custom dashboard & reporting", "CRO consulting included"] },
    ],
    faqs: [
      { q: "How much ad budget do I need to start running Google Ads?", a: "There's no hard minimum, but we generally recommend a starting budget of ₹30,000–₹50,000 per month to gather enough data for meaningful optimisation. We manage campaigns at all budget levels and make sure every rupee is working as hard as possible from day one." },
      { q: "How is your PPC management fee structured?", a: "We charge a flat monthly management fee based on the scope of work and the number of campaigns managed — not a percentage of your ad spend. This means our incentives align with your results, not with inflating your budget." },
      { q: "How quickly can I see results from paid search campaigns?", a: "Unlike SEO, PPC can drive traffic almost immediately after launch. Most clients see their first conversions within the first week. However, the first 30–60 days are a learning and optimisation phase — performance typically improves significantly from month 2 onwards as we refine audiences, bids, and ad copy." },
      { q: "Do you manage Meta Ads and LinkedIn Ads in addition to Google?", a: "Yes. We manage full-funnel paid media including Google Search, Google Display, YouTube, Meta (Facebook & Instagram), and LinkedIn. We recommend the right platform mix based on your audience, product, and goals — not based on where it's easiest for us to run ads." },
      { q: "How do you prevent wasted spend on irrelevant clicks?", a: "We implement robust negative keyword lists from day one, use tightly themed ad groups, enable ad scheduling to run only during peak hours, set up audience exclusions, and run regular search-term audits to catch and eliminate wasteful spend every week." },
      { q: "What kind of reporting do PPC clients receive?", a: "You get weekly performance snapshots and a full monthly report covering impressions, clicks, CTR, CPC, conversions, ROAS, Quality Scores, and a breakdown of spend by campaign. We also flag anomalies proactively so there are never unpleasant surprises." },
    ],
  },
  "/services/social-media": {
    benefits: [
      { title: "Community Building", desc: "Foster deep relationships with your audience." },
      { title: "Brand Identity", desc: "Establish a consistent, recognizable voice." },
      { title: "Direct Engagement", desc: "Communicate directly with prospects and customers." },
      { title: "Visual Storytelling", desc: "High-quality graphics and video content." },
      { title: "Customer Loyalty", desc: "Turn casual buyers into brand advocates." },
      { title: "Social Proof", desc: "Showcase testimonials and user-generated content." },
    ],
    process_steps: [
      { step: "01", title: "Strategy & Audit", desc: "Analyzing current performance and defining platform-specific strategies." },
      { step: "02", title: "Content Creation", desc: "Designing stunning graphics, writing captions, and producing reels/shorts." },
      { step: "03", title: "Publishing & Community Management", desc: "Optimal posting times and active response to comments/messages." },
      { step: "04", title: "Analytics & Reporting", desc: "Monthly deep-dives into engagement rates, reach, and follower growth." },
    ],
    pricing: [
      { name: "Starter", price: "₹25,000/mo", desc: "12 posts/month. 2 platforms. Basic community management.", features: ["12 posts/month", "2 platforms (Instagram + Facebook)", "Custom graphics & captions", "Basic community management", "Monthly analytics report"] },
      { name: "Standard", price: "₹45,000/mo", desc: "20 posts + 4 Reels/mo. 3 platforms. Advanced engagement.", popular: true, features: ["20 posts + 4 Reels/month", "3 platforms of your choice", "Advanced community management", "Story content included", "Meta Ads management (add spend)", "Fortnightly performance reports"] },
      { name: "Premium", price: "₹80,000/mo", desc: "Daily posting. Omni-channel. Influencer outreach.", features: ["Daily posting across all platforms", "Full omni-channel management", "Short-form video production", "Influencer outreach & coordination", "Paid social ads management", "Dedicated social media manager"] },
    ],
    faqs: [
      { q: "Which social media platforms do you manage?", a: "We manage Instagram, Facebook, LinkedIn, X (Twitter), YouTube, and Pinterest. Most clients start with Instagram and LinkedIn, and we recommend a platform strategy based on where your target audience actually spends time — not on every channel at once." },
      { q: "How many posts per week do you create?", a: "Our packages typically cover 3–5 posts per week per platform. This includes static graphics, carousel posts, Reels/short-form video, and story content. Every post is planned in advance and shared with you for approval before publishing." },
      { q: "Do you handle paid social advertising as well as organic?", a: "Yes. We offer integrated packages that combine organic content management with paid social campaigns (Meta Ads, LinkedIn Ads, etc.). Running paid and organic together dramatically amplifies results — your ads get warm audiences from your organic content, and your organic reach benefits from paid amplification." },
      { q: "Do you create the design and captions, or just post what we give you?", a: "We handle everything end-to-end — concept, copywriting, graphic design, video editing, scheduling, and community management (replying to comments and DMs). You simply review and approve the content calendar before anything goes live." },
      { q: "How do you measure social media ROI?", a: "Beyond vanity metrics like likes and followers, we track website traffic from social, lead form completions, story link taps, DM enquiries, and conversion events using Meta Pixel and UTM tracking. We report on metrics that connect directly to your business outcomes." },
      { q: "Can you help grow our Instagram following organically?", a: "Yes. Organic follower growth is driven by consistent high-quality content, strategic use of hashtags and keywords, Reels-first strategy, and active community engagement. While paid ads can accelerate growth, we build a sustainable organic presence that continues to deliver even without ad spend." },
    ],
  },
  "/services/web-design-development": {
    benefits: [
      { title: "Custom Design", desc: "Bespoke UI/UX that aligns perfectly with your brand." },
      { title: "Mobile-First", desc: "Flawless experience across all devices and screen sizes." },
      { title: "Lightning Fast", desc: "Optimized performance to keep users engaged and please Google." },
      { title: "Conversion Focused", desc: "Strategic layouts designed to drive leads and sales." },
      { title: "Clean Code", desc: "Scalable, secure, and maintainable development architectures." },
      { title: "CMS Integration", desc: "Easy-to-use backends so you can manage your content." },
    ],
    process_steps: [
      { step: "01", title: "Discovery & Wireframing", desc: "Understanding your goals and mapping out the user journey." },
      { step: "02", title: "UI/UX Design", desc: "Creating high-fidelity mockups of exactly how the site will look." },
      { step: "03", title: "Development", desc: "Writing clean, efficient code to bring the designs to life." },
      { step: "04", title: "Testing & Launch", desc: "Rigorous QA testing across devices before going live." },
    ],
    pricing: [
      { name: "Landing Page", price: "Starts ₹10,000", desc: "High-converting single page for campaigns.", features: ["1-page custom design", "Mobile-responsive layout", "On-page SEO setup", "Contact / lead capture form", "2 rounds of revisions", "Delivered in 7–10 days"] },
      { name: "Corporate Website", price: "Starts ₹25,000", desc: "Full 5-10 page custom website with CMS.", popular: true, features: ["5–10 fully custom pages", "CMS integration (edit content yourself)", "Mobile-first & fast loading", "On-page SEO + schema markup", "Blog setup included", "4 weeks delivery"] },
      { name: "E-Commerce", price: "Starts ₹45,000", desc: "Full store setup, payment gateways, complex catalogs.", features: ["Unlimited product catalog", "Payment gateway integration", "Inventory management", "Mobile-optimised checkout", "Product SEO optimisation", "Post-launch support (30 days)"] },
    ],
    faqs: [
      { q: "How long does it take to design and build a website?", a: "A standard informational or service website takes 4–6 weeks from kickoff to launch. E-commerce or custom web applications typically take 8–12 weeks depending on complexity. We share a detailed timeline at the start and keep you updated at every milestone." },
      { q: "Will my website be mobile-friendly and fast?", a: "Yes — all our websites are built mobile-first and optimised for Core Web Vitals. We target a Google PageSpeed score of 90+ on both mobile and desktop. Fast, responsive websites are non-negotiable for both user experience and SEO performance." },
      { q: "Do you build on WordPress, or do you write custom code?", a: "We work with both. WordPress is ideal for content-heavy sites and clients who want to manage their own blog or pages. For high-performance, fully custom experiences we build with React and modern frameworks. We recommend the right technology for your specific needs and budget." },
      { q: "Does the website come with on-page SEO optimisation?", a: "Yes. Every website we deliver is SEO-ready: clean semantic HTML, proper heading hierarchy, optimised meta tags, schema markup, fast load times, mobile responsiveness, and an XML sitemap. This gives you a strong SEO foundation from day one." },
      { q: "What happens after the website goes live — do you offer maintenance?", a: "We offer ongoing maintenance retainers that cover security patches, plugin and CMS updates, performance monitoring, uptime alerts, regular backups, and minor content updates. We also offer dedicated support hours if you need new pages or design changes after launch." },
      { q: "Will I be able to update the website content myself?", a: "Absolutely. We build websites with a user-friendly CMS so you can update text, images, blog posts, and more without any coding knowledge. We also provide a handover session and documentation so your team feels confident managing the site independently." },
    ],
  },
  "/services/content-marketing": {
    benefits: [
      { title: "Thought Leadership", desc: "Position your brand as the expert in your industry." },
      { title: "SEO, GEO Synergy", desc: "Content designed specifically to rank on Google and AI answer engines." },
      { title: "Brand Voice", desc: "Communicate consistently across all touchpoints." },
      { title: "Lead Magnets", desc: "E-books and whitepapers that capture emails." },
      { title: "Shareability", desc: "Viral potential across social networks." },
      { title: "Trust Building", desc: "Educate prospects so they are ready to buy." },
    ],
    process_steps: [
      { step: "01", title: "Topic Research", desc: "Discovering what your audience actually wants to read and know." },
      { step: "02", title: "Content Calendar", desc: "Planning topics, formats, and publishing dates months in advance." },
      { step: "03", title: "Creation & Editing", desc: "Expert writers crafting compelling copy, reviewed for quality and SEO, GEO." },
      { step: "04", title: "Distribution", desc: "Promoting the content across email, social, and other channels." },
    ],
    pricing: [
      { name: "Starter", price: "₹20,000/mo", desc: "4 SEO, GEO blog posts (1000 words each) + basic distribution.", features: ["4 SEO-optimised blog posts/mo", "Keyword research included", "Basic social media distribution", "Monthly performance report"] },
      { name: "Standard", price: "₹45,000/mo", desc: "8 blog posts, 1 long-form guide/ebook per quarter.", popular: true, features: ["8 blog posts/mo (1,500–2,500 words)", "1 long-form guide or e-book per quarter", "Email newsletter content (2/mo)", "Social media repurposing", "GEO / AI-answer optimisation", "Content performance analytics"] },
      { name: "Premium", price: "₹90,000/mo", desc: "Complete thought-leadership engine. PR & outreach.", features: ["12+ blog posts & content assets/mo", "Pillar pages + topic cluster strategy", "PR outreach & guest posting", "Video script writing", "Influencer collaboration content", "Dedicated content strategist"] },
    ],
    faqs: [
      { q: "How many blog posts or articles do you write per month?", a: "Our packages typically include 4–8 long-form articles per month (1,500–3,000 words each), plus supporting content like infographics, social media snippets, email newsletters, or video scripts. The volume depends on your niche, goals, and budget." },
      { q: "Do you research keywords before writing content?", a: "Always. Every piece of content begins with keyword research and competitor gap analysis. We identify topics with a realistic chance of ranking based on your domain authority, target audience search intent, and competition level — so your content investments go to work immediately." },
      { q: "What types of content do you create beyond blog posts?", a: "We produce a full range of content: long-form articles, pillar pages, case studies, white papers, email sequences, video scripts, LinkedIn thought-leadership posts, infographics, product descriptions, landing page copy, and press releases." },
      { q: "How long does it take for content to start ranking on Google?", a: "New content typically begins moving in rankings within 3–6 months as Google indexes and evaluates it. Well-optimised content targeting low-competition keywords can rank within weeks. We track keyword movements monthly and refresh underperforming content to accelerate results." },
      { q: "Do you write content for all industries?", a: "We work across a wide range of industries including e-commerce, SaaS, real estate, healthcare, education, fintech, professional services, and more. For highly technical sectors, we have subject-matter expert writers and always include a client review step before publishing." },
      { q: "How do you measure content marketing success?", a: "We track organic traffic, keyword rankings, time-on-page, bounce rate, backlinks earned, leads generated from content, and revenue-attributed traffic (via UTM tracking and Google Analytics). You get a monthly content performance report alongside our ongoing recommendations." },
    ],
  },
  "/services/orm": {
    benefits: [
      { title: "Review Generation", desc: "Proactively collect positive reviews from happy customers." },
      { title: "Negative Suppression", desc: "Push down harmful links in Google search results." },
      { title: "Brand Monitoring", desc: "24/7 tracking of mentions across the web and social media." },
      { title: "Trust & Credibility", desc: "Ensure your brand looks flawless to prospects." },
      { title: "Crisis Management", desc: "Rapid response strategies for PR issues." },
      { title: "Profile Optimization", desc: "Enhance Google My Business and other directories." },
    ],
    process_steps: [
      { step: "01", title: "Assessment", desc: "Deep dive into search results, reviews, and social mentions." },
      { step: "02", title: "Suppression & Defense", desc: "Creating powerful, optimized positive assets to push down negatives." },
      { step: "03", title: "Review Campaigns", desc: "Implementing automated systems to gather genuine 5-star reviews." },
      { step: "04", title: "Ongoing Shielding", desc: "Continuous monitoring to alert and respond to new mentions instantly." },
    ],
    pricing: [
      { name: "Monitoring", price: "₹15,000/mo", desc: "24/7 web & social monitoring with monthly reporting.", features: ["24/7 brand mention monitoring", "Google & social review tracking", "Monthly reputation audit report", "Alert notifications for new mentions"] },
      { name: "Proactive ORM", price: "₹40,000/mo", desc: "Review generation + Google My Business management.", popular: true, features: ["Review generation campaigns", "Google Business Profile management", "Negative review response strategy", "Reputation content creation", "Directory citation building", "Fortnightly ORM reports"] },
      { name: "Crisis & Suppression", price: "Custom", desc: "Aggressive link suppression and PR recovery campaigns.", features: ["Emergency response strategy", "Negative SERP suppression", "PR crisis content campaign", "High-DA positive asset creation", "Social media narrative management", "Dedicated ORM crisis manager"] },
    ],
    faqs: [
      { q: "What exactly is Online Reputation Management (ORM)?", a: "ORM is the practice of monitoring, influencing, and improving how your brand appears online. This includes managing Google reviews, suppressing negative search results, amplifying positive mentions, building authoritative content that ranks for your brand name, and responding to customer feedback across review platforms." },
      { q: "Can you remove negative Google reviews permanently?", a: "We can flag and request removal of reviews that violate Google's policies (spam, fake reviews, off-topic content). For legitimate negative reviews, we employ a proven response and resolution strategy that minimises their impact. We also work to generate a high volume of genuine positive reviews so your overall rating improves significantly." },
      { q: "How long does it take to improve a brand's online reputation?", a: "Visible improvements typically take 3–6 months. Quick wins like responding professionally to reviews and generating new positive ones can shift perception within 4–8 weeks. Suppressing negative search results or news articles through content displacement is a 6–12 month process, depending on how entrenched the content is." },
      { q: "Do you help businesses generate more genuine positive reviews?", a: "Yes. We implement a systematic review-generation strategy that prompts satisfied customers to share their experience at exactly the right moment in the customer journey. This is done ethically and in full compliance with Google's and other platforms' review policies." },
      { q: "Which platforms do you manage for ORM — just Google, or others too?", a: "We manage your reputation across all major platforms: Google Business Profile, Trustpilot, Glassdoor, MouthShut, JustDial, Facebook, LinkedIn, Yelp, and industry-specific review sites. We also monitor news articles, forums, and social media mentions using real-time brand tracking tools." },
      { q: "Can ORM help a business recover after a PR crisis?", a: "Absolutely. Crisis ORM is one of our specialities. We deploy a structured approach: immediate damage assessment, professional response strategy, content creation to take control of the narrative, and proactive promotion of positive press to push negative content down in search results." },
    ],
  },
  "/services/meta-ads": {
    benefits: [
      { title: "Precision Audience Targeting", desc: "Reach the exact demographics, interests, and behaviours of your ideal customer across 2B+ Meta users." },
      { title: "Full-Funnel Strategy", desc: "Awareness to conversion campaigns that nurture prospects at every stage of the buying journey." },
      { title: "Creative That Converts", desc: "Scroll-stopping ad creatives and compelling copy crafted to drive clicks, leads, and purchases." },
      { title: "Retargeting Mastery", desc: "Re-engage warm audiences and website visitors with personalised ads that close more sales." },
      { title: "Transparent ROAS Reporting", desc: "Crystal-clear metrics on every rupee spent, every lead generated, and every sale attributed." },
      { title: "Continuous A/B Testing", desc: "Non-stop creative and audience testing to find winning combinations and scale them aggressively." },
    ],
    process_steps: [
      { step: "01", title: "Discovery & Audit", desc: "Audit your existing accounts, competitors, and target audience to build a winning strategy from day one." },
      { step: "02", title: "Pixel & Tracking Setup", desc: "Install Meta Pixel, Conversion API, and custom events to ensure every conversion is tracked accurately." },
      { step: "03", title: "Creative & Copy Production", desc: "Design high-converting ad creatives and write compelling copy tailored to each audience segment." },
      { step: "04", title: "Campaign Launch & Learning", desc: "Launch structured campaigns and allow the Meta algorithm to gather performance data in its learning phase." },
      { step: "05", title: "Optimise & Scale", desc: "Analyse results daily, eliminate underperformers, and scale winning ad sets to maximise your ROAS." },
    ],
    pricing: [
      { name: "Starter", price: "₹15,000/mo", desc: "Ideal for new advertisers or small ad budgets up to ₹50k/month.", features: ["Up to ₹50k monthly ad spend", "2 active campaigns", "Facebook + Instagram placements", "Monthly performance report", "Pixel setup & verification"] },
      { name: "Growth", price: "₹28,000/mo", desc: "For scaling brands with ad budgets up to ₹2L/month.", popular: true, features: ["Up to ₹2L monthly ad spend", "5 active campaigns", "Full creative production", "Retargeting & lookalike audiences", "Bi-weekly strategy calls", "Weekly performance snapshots", "A/B creative testing"] },
      { name: "Scale", price: "₹55,000/mo", desc: "Aggressive scaling for high-budget performance advertisers.", features: ["Unlimited ad spend", "Unlimited campaigns", "Full creative studio support", "Conversion API setup", "CRM integration & lead sync", "Daily optimisation", "Dedicated account manager"] },
    ],
    faqs: [
      { q: "What is Meta Ads and how is it different from Google Ads?", a: "Meta Ads (formerly Facebook Ads) runs on Facebook and Instagram, targeting users based on demographics, interests, and behaviours. Google Ads targets people actively searching for something. Meta Ads excels at demand generation — reaching people before they search, building brand awareness, and driving social commerce. Both are powerful, and we often recommend running them together for full-funnel coverage." },
      { q: "How much budget do I need to start running Meta Ads?", a: "We recommend a minimum ad spend of ₹20,000–₹30,000 per month to generate enough data for meaningful optimisation. Campaigns can technically run on less, but the Meta algorithm needs volume to learn efficiently. Our management fee is separate from your ad spend, and we make every rupee work as hard as possible." },
      { q: "Can you create the ad creatives or do I need to provide them?", a: "We handle end-to-end creative production — including graphic design, video editing, carousel ads, and ad copywriting. You provide your product images, brand guidelines, and any raw footage, and we craft conversion-focused creatives. We A/B test multiple creative variants to find what resonates best with your audience." },
      { q: "How long does it take to see results from Meta Ads?", a: "Meta Ads can drive traffic and leads from day one, but the algorithm needs 7–14 days in a 'learning phase' before performance stabilises. Meaningful ROAS and conversion optimisation typically happens from week 3 onwards. We set realistic expectations and provide weekly performance updates throughout." },
      { q: "Do you manage both Facebook and Instagram ads together?", a: "Yes. Meta's Ads Manager lets us run campaigns across Facebook, Instagram, Messenger, and the Audience Network from a single interface. We tailor creative formats to each placement — Reels for Instagram, Feed posts for Facebook, Stories for both — to maximise engagement and conversions on every surface." },
      { q: "How do you track conversions and ROI from Meta Ads?", a: "We install and verify the Meta Pixel and Conversion API on your website, set up custom conversion events (purchases, leads, sign-ups), and connect your ad account to your CRM where applicable. This gives us accurate attribution data, closing the loop between ad spend and actual revenue — not just clicks." },
    ],
  },
  "/digital-marketing-company-india": {
    benefits: [
      { title: "SEO + AI Search (GEO)", desc: "Rank on Google AND appear in ChatGPT, Perplexity, and Google AI Overviews so you capture every type of search intent across India." },
      { title: "Performance-Driven PPC", desc: "ROI-focused Google Ads and Meta campaigns with granular targeting by city, language, and device for the Indian market." },
      { title: "Pan-India Local SEO", desc: "Dominate Google Maps and local packs in every city you operate — Mumbai, Delhi, Bangalore, Hyderabad, Pune and beyond." },
      { title: "Data-Backed Strategy", desc: "Every decision is driven by analytics. We connect Google Analytics 4, Search Console, and custom dashboards for real-time insights." },
      { title: "Social Media Growth", desc: "Instagram, LinkedIn, YouTube, and Facebook strategies that build audiences and convert followers into paying customers." },
      { title: "AI-Powered Content", desc: "High-quality blog posts, landing pages, and ad creatives produced at scale with AI assistance and human expertise." },
    ],
    process_steps: [
      { step: "01", title: "Free Website & Marketing Audit", desc: "We analyse your current website, SEO rankings, ad spend, and competitors across India — completely free." },
      { step: "02", title: "Custom Strategy Blueprint", desc: "A tailored 90-day plan covering channels, budget allocation, and KPIs specific to your industry and target cities." },
      { step: "03", title: "Campaign Launch", desc: "Our team sets up and launches all campaigns within 7 days — ads, content, SEO, and social media in parallel." },
      { step: "04", title: "Monthly Reporting & Optimisation", desc: "Detailed monthly reports with keyword rankings, traffic, leads, ROAS, and a clear plan for the month ahead." },
    ],
    pricing: [
      { name: "Starter", price: "₹15,000/mo", desc: "Perfect for small businesses and startups entering digital marketing.", features: ["SEO – 10 keywords", "Google Ads management", "Monthly report", "Email support"] },
      { name: "Growth", price: "₹35,000/mo", desc: "Full-funnel marketing for growing brands ready to scale across India.", popular: true, features: ["SEO + GEO – 30 keywords", "Google & Meta Ads", "Social Media (2 platforms)", "Bi-weekly strategy call", "Priority support"] },
      { name: "Enterprise", price: "Custom", desc: "Comprehensive multi-city campaigns for established businesses.", features: ["Unlimited keywords", "Full-channel campaigns", "Dedicated account manager", "Weekly calls + live dashboard", "CRO & landing pages"] },
    ],
    faqs: [
      { q: "Why should I choose a digital marketing agency in India?", a: "India offers world-class talent at competitive prices. Agencies like Aetherank combine deep local market knowledge with global best practices — covering SEO, PPC, Meta Ads, content, and AI-driven strategies — to deliver measurable ROI for Indian and international brands." },
      { q: "Which cities do you serve across India?", a: "We serve clients pan-India including Mumbai, Delhi NCR, Bangalore, Hyderabad, Pune, Chennai, Ahmedabad, Kolkata, Surat, and all Tier-2 and Tier-3 cities. All campaign management is done remotely with weekly video calls and monthly reporting." },
      { q: "What digital marketing services do you offer in India?", a: "We offer SEO & GEO (AI search), Google PPC, Meta & Instagram Ads, Social Media Management, Content Marketing, Web Design & Development, and Online Reputation Management. Every engagement begins with a free website audit." },
      { q: "How long before we see results?", a: "PPC and Meta Ads can deliver leads within the first week. SEO typically shows meaningful ranking improvements in 3–6 months. We track 25+ KPIs monthly and share transparent reports so you always know what's working." },
      { q: "Do you work with small businesses and startups in India?", a: "Yes. Our starter plans begin at ₹15,000/month, making professional digital marketing accessible to SMEs and startups. We scale your campaigns as your business grows." },
      { q: "What makes Aetherank different from other Indian digital marketing agencies?", a: "We integrate AI-powered tools into every campaign — from ChatGPT-optimised content to AI-driven ad bidding — giving you an unfair advantage in 2026. All work is done in-house with full transparency; no outsourcing." },
    ],
  },
  "/digital-marketing-company-mumbai": {
    benefits: [
      { title: "Mumbai-Focused SEO", desc: "Rank for high-intent local searches in Andheri, Bandra, Powai, Lower Parel, Thane, Navi Mumbai, and across Greater Mumbai." },
      { title: "Meta & Instagram Ads", desc: "Mumbai's consumers are social-first. Our Instagram and Facebook campaigns deliver leads at the lowest possible cost-per-acquisition." },
      { title: "AI Search (GEO)", desc: "Get your brand recommended by ChatGPT and Google AI Overviews when Mumbai users ask for your type of product or service." },
      { title: "Google Ads & PPC", desc: "ROI-driven Google Search and Display campaigns targeting Mumbai's competitive keywords with proven bidding strategies." },
      { title: "Real Estate Marketing", desc: "Specialised campaigns for Mumbai builders, brokers, and co-working spaces — driving quality inquiries for premium and affordable projects." },
      { title: "Fast Results, Full Transparency", desc: "Weekly progress updates, live dashboards, and no lock-in contracts. See exactly what you're getting for every rupee spent." },
    ],
    process_steps: [
      { step: "01", title: "Free Mumbai Market Audit", desc: "Comprehensive analysis of your website, keyword rankings, competitors in Mumbai, and existing ad performance." },
      { step: "02", title: "Localised Strategy Blueprint", desc: "A custom plan targeting the right Mumbai neighbourhoods, audiences, and platforms — aligned to your budget and goals." },
      { step: "03", title: "7-Day Campaign Launch", desc: "We go live with SEO, paid ads, content, and social media — simultaneously — within one week of sign-off." },
      { step: "04", title: "Monthly Reports & Growth Reviews", desc: "Detailed reports covering traffic, leads, rankings, ROAS, and next-month priorities. You always know what's next." },
    ],
    pricing: [
      { name: "Starter", price: "₹15,000/mo", desc: "Ideal for small Mumbai businesses entering digital marketing.", features: ["Local SEO – 10 keywords", "Google My Business optimisation", "Google Ads management", "Monthly report"] },
      { name: "Growth", price: "₹35,000/mo", desc: "Full-funnel campaigns for Mumbai brands ready to scale.", popular: true, features: ["SEO + GEO – 30 keywords", "Google & Meta Ads", "Instagram management", "Bi-weekly strategy call", "Priority support"] },
      { name: "Enterprise", price: "Custom", desc: "Aggressive multi-platform marketing for established Mumbai businesses.", features: ["Unlimited keywords", "All ad platforms", "Dedicated account manager", "Weekly calls + live dashboard", "CRO & landing pages"] },
    ],
    faqs: [
      { q: "Why hire a digital marketing agency in Mumbai?", a: "Mumbai is India's commercial capital, home to some of the most competitive industries — real estate, finance, fashion, hospitality, and retail. A Mumbai-focused agency understands the local consumer, Marathi-speaking audience segments, and hyper-local competition, giving your campaigns an immediate edge." },
      { q: "What digital marketing services do you offer in Mumbai?", a: "We offer SEO, GEO (AI search optimisation), Google Ads, Meta & Instagram Ads, LinkedIn Ads for B2B, Social Media Management, Content Marketing, Web Design, and Online Reputation Management — all tailored for the Mumbai market." },
      { q: "Do you offer local SEO for specific Mumbai areas?", a: "Absolutely. We optimise for hyper-local searches like 'digital marketing agency in Andheri', 'SEO company in Bandra', and 'Google Ads expert in Lower Parel'. We build and manage your Google Business Profile, local citations, and neighbourhood-level content." },
      { q: "How quickly can you start campaigns in Mumbai?", a: "We launch within 7 business days of onboarding. We start with a free audit, build your strategy, and begin campaign execution — all simultaneously to minimise time-to-results." },
      { q: "What industries do you serve in Mumbai?", a: "Real estate, retail & e-commerce, hospitality & restaurants, finance & fintech, fashion & lifestyle, healthcare & clinics, education & coaching, and professional services (legal, CA, consulting)." },
      { q: "What is your pricing for Mumbai clients?", a: "Packages start at ₹15,000/month for startups and SMEs. Growth plans with full-funnel management start at ₹35,000/month. We offer a 100% free audit before you commit to anything." },
    ],
  },
};

export const DEFAULT_ABOUT_PAGE: AboutPageContent = {
  stats: [
    { value: "3+", label: "Global Offices" },
    { value: "14+", label: "Years Combined Experience" },
    { value: "100+", label: "Successful Projects" },
    { value: "98%", label: "Client Retention Rate" },
  ],
  story_paragraphs: [
    "Founded in India, Aetherank started with a simple observation: most businesses were guessing with their marketing budgets.",
    "We saw agencies reporting on 'vanity metrics' like likes and impressions, while founders were left wondering where the revenue was. We decided to change that.",
    "Today, we leverage advanced AI tools and strict analytical rigor to ensure every rupee spent translates into business growth — for local startups and pan-India enterprises alike.",
  ],
  story_quote: "Every rupee you spend on marketing should be accountable — that's the standard we hold ourselves to.",
  story_points: ["100+ brands grown", "3+ Global Offices", "SEO, GEO, PPC & Social", "AI-first approach"],
  core_values: [
    { title: "Results Obsessed", desc: "We don't care about vanity metrics. We care about leads, sales, and ROI." },
    { title: "Radical Transparency", desc: "You'll always know exactly what we're doing and why we're doing it." },
    { title: "Speed of Execution", desc: "In the digital world, speed wins. We move fast and iterate faster." },
    { title: "Client Empathy", desc: "We treat your business and your budget as if it were our own." },
  ],
  team_total: "15+",
  team_roles: [
    { label: "Growth Marketers", count: "5+" },
    { label: "Creative Designers", count: "3+" },
    { label: "Web Developers", count: "4+" },
    { label: "SEO, GEO Specialists", count: "3+" },
  ],
  india_points: [
    "Deep understanding of Tier-2 and Tier-3 market dynamics",
    "Enterprise-quality work without metro-city overhead costs",
    "Agile, hungry, and dedicated team culture",
    "Central location to serve clients Pan-India efficiently",
  ],
  india_stats: [
    { value: "60%", label: "Lower Cost vs Metro Agencies", sub: "Same enterprise quality" },
    { value: "500M+", label: "Addressable Market", sub: "Tier-1, 2 & 3 cities" },
    { value: "14+", label: "Years Combined Experience", sub: "Across all disciplines" },
    { value: "24/7", label: "Client Support", sub: "Always in your timezone" },
  ],
};

export const DEFAULT_CASE_STUDIES: CaseStudyItem[] = [
  {
    id: 1,
    client: "Mansi Jewelry",
    industry: "E-Commerce",
    challenge: "Low organic rankings for high-intent jewelry keywords, heavy reliance on paid ads, under-optimized product pages, and mobile conversion bottlenecks.",
    solution: "Full-funnel SEO & CRO program: technical audit with schema markup, 40+ buying guides targeting commercial keywords, product page optimisation, and high-DA link building across fashion and lifestyle publications.",
    metric1: "+340%", label1: "Organic Traffic",
    metric2: "+220%", label2: "Revenue",
    timeline: "8 Months",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=70&auto=format",
  },
  {
    id: 2,
    client: "HealthPlus Clinics",
    industry: "Healthcare",
    challenge: "High cost-per-acquisition on Google Ads, struggling to compete with local hospitals.",
    solution: "Restructured PPC campaigns, hyper-local targeting, and optimized landing pages for appointments.",
    metric1: "6.2x", label1: "Google Ads ROAS",
    metric2: "-45%", label2: "Cost Per Lead",
    timeline: "3 Months",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=70&auto=format",
  },
  {
    id: 3,
    client: "BuildRight Realty",
    industry: "Real Estate",
    challenge: "Zero social media presence and relying heavily on expensive offline brokers.",
    solution: "Aggressive Meta ads strategy with video tours and lead generation forms.",
    metric1: "+500%", label1: "Social Reach",
    metric2: "+95%", label2: "Qualified Inquiries",
    timeline: "6 Months",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=70&auto=format",
  },
  {
    id: 4,
    client: "Arsha Vidya Ananda",
    industry: "Online Education",
    challenge: "Slow page load times (~3.2s), low organic visibility for course searches, high bounce rates on course pages, and poor mobile experience limiting global student conversions.",
    solution: "4-month technical + CRO sprint: Core Web Vitals overhaul reducing load time to 0.8s, redesigned course landing pages with trust signals, SEO targeting high-intent keywords, and full mobile responsiveness upgrades.",
    metric1: "+180%", label1: "Course Signups",
    metric2: "0.8s", label2: "Page Load Time",
    timeline: "4 Months",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=600&q=70&auto=format",
  },
  {
    id: 5,
    client: "SpiceRoute Dining",
    industry: "Restaurant",
    challenge: "Negative online reviews affecting footfall and brand perception.",
    solution: "Proactive ORM strategy, review generation campaigns, and local SEO, GEO push.",
    metric1: "4.8★", label1: "Google Rating",
    metric2: "+40%", label2: "Table Bookings",
    timeline: "5 Months",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=70&auto=format",
  },
  {
    id: 6,
    client: "CloudSync Solutions",
    industry: "SaaS",
    challenge: "Struggling to educate enterprise clients and generate inbound leads.",
    solution: "Content marketing engine featuring in-depth whitepapers, webinars, and SEO, GEO blogs.",
    metric1: "15k+", label1: "Email Subs",
    metric2: "+3x", label2: "Demo Requests",
    timeline: "12 Months",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=70&auto=format",
  },
];

export const DEFAULT_BLOG_NEWSLETTER_CTA: BlogNewsletterCta = {
  heading: "Stay Ahead of the Curve",
  subheading: "Get our latest marketing insights delivered to your inbox. No spam — just actionable tips.",
  button_text: "Subscribe Free",
  placeholder: "your@email.com",
};

export const DEFAULT_CONTENT: CmsSettings["content"] = {
  hero: {
    headline: "We Drive Real Growth for Ambitious Brands",
    subheadline: "We help Indian businesses get more leads from Google, Instagram, YouTube & ChatGPT — with zero guesswork and full transparency.",
    cta_primary: "Get Free Audit",
    cta_secondary: "View Our Work",
  },
  contact: {
    email: "contact@aetherank.com",
    phone: "+91 80109 60269",
    address_1: "Tardeo AC Market, 239, Near Mumbai Central, Tardeo, Mumbai, Maharashtra, India - 400034",
    address_2: "Rustomjee Global City, J/27 163, near ClubOne, Virar West, Maharashtra, India - 401303",
    address_3: "2906 Bull Run Ct, Missouri City, TX, USA 77459",
    linkedin: "https://www.linkedin.com/company/aetherank",
    twitter: "https://x.com/aetherank",
    instagram: "https://www.instagram.com/aetherank",
    facebook: "https://www.facebook.com/aetherank",
    whatsapp: "+91 80109 60269",
    logo_url: "",
    favicon_url: "",
    footer_tagline: "India's premier AI-powered digital marketing agency. We turn clicks into clients.",
  },
  pages: DEFAULT_PAGE_CONTENT,
  stats: DEFAULT_STATS,
  growth_partner: DEFAULT_GROWTH_PARTNER,
  ai_advantage: DEFAULT_AI_ADVANTAGE,
  services_section: DEFAULT_SERVICES_SECTION,
  why_choose_us: DEFAULT_WHY_CHOOSE_US,
  about: DEFAULT_ABOUT,
  testimonials: DEFAULT_TESTIMONIALS,
  faqs: DEFAULT_FAQS,
  service_pages: DEFAULT_SERVICE_PAGES,
  about_page: DEFAULT_ABOUT_PAGE,
  case_studies: DEFAULT_CASE_STUDIES,
  blog_newsletter_cta: DEFAULT_BLOG_NEWSLETTER_CTA,
};

// ── Blog Post API ───────────────────────────────────────────────────────────

export interface BlogPostSeo {
  title: string;
  description: string;
  keywords: string;
  schema: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  image: string;
  status: "draft" | "published";
  readTime: string;
  seo: BlogPostSeo;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

const BLOG_BASE = `${API_BASE}/api/blog/posts`;

// --------------- WordPress REST API helpers ---------------

interface WpPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    author?: Array<{ name: string }>;
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ name: string }>>;
  };
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, "\u201c")
    .replace(/&#8221;/g, "\u201d")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function estimateReadTime(html: string): string {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function wpPostToBlogPost(wp: WpPost): BlogPost {
  const author = wp._embedded?.author?.[0]?.name ?? "Aetherank Team";
  const image = wp._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "";
  const category = wp._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "General";
  const tags = (wp._embedded?.["wp:term"]?.[1] ?? []).map((t) => t.name);
  const excerpt = stripHtml(wp.excerpt.rendered);
  const content = wp.content.rendered;
  const date = new Date(wp.date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return {
    id: String(wp.id),
    title: stripHtml(wp.title.rendered),
    slug: wp.slug,
    excerpt,
    content,
    category,
    tags,
    author,
    date,
    image,
    status: "published",
    readTime: estimateReadTime(content),
    seo: {
      title: stripHtml(wp.title.rendered),
      description: excerpt.slice(0, 160),
      keywords: tags.join(", "),
      schema: "",
    },
    sortOrder: 0,
    createdAt: wp.date,
    updatedAt: wp.date,
  };
}

async function fetchFromWordPress(): Promise<BlogPost[]> {
  const res = await fetch(
    `${WP_API}/wp/v2/posts?_embed&per_page=100&status=publish`,
  );
  if (!res.ok) throw new Error(`WP ${res.status}`);
  const posts = (await res.json()) as WpPost[];
  return posts.map(wpPostToBlogPost);
}

async function fetchOneFromWordPress(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${WP_API}/wp/v2/posts?_embed&slug=${encodeURIComponent(slug)}`);
  if (!res.ok) return null;
  const posts = (await res.json()) as WpPost[];
  return posts.length > 0 ? wpPostToBlogPost(posts[0]) : null;
}

// --------------- Public blog API (priority: WP → Railway → static) ---------------

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  if (WP_API) {
    try {
      return await fetchFromWordPress();
    } catch {
      // fall through to Railway
    }
  }
  try {
    const res = await fetch(BLOG_BASE);
    if (!res.ok) return [];
    return (await res.json()) as BlogPost[];
  } catch {
    return [];
  }
}

export async function fetchBlogPost(idOrSlug: string): Promise<BlogPost | null> {
  if (WP_API) {
    try {
      const post = await fetchOneFromWordPress(idOrSlug);
      if (post) return post;
    } catch {
      // fall through to Railway
    }
  }
  try {
    const res = await fetch(`${BLOG_BASE}/${idOrSlug}`);
    if (!res.ok) return null;
    return (await res.json()) as BlogPost;
  } catch {
    return null;
  }
}

export async function createBlogPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
  const token = getToken();
  const res = await fetch(BLOG_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(post),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as BlogPost;
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
  const token = getToken();
  const res = await fetch(`${BLOG_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(post),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as BlogPost;
}

export async function reorderBlogPosts(ids: string[]): Promise<void> {
  const token = getToken();
  const res = await fetch(`${BLOG_BASE}/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function deleteBlogPost(id: string): Promise<void> {
  const token = getToken();
  const res = await fetch(`${BLOG_BASE}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
}
