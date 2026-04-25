/**
 * SeoManager.tsx
 *
 * Manages client-side SEO tag updates on route changes.
 * All document.* calls are INSIDE useEffect — they never execute on the server.
 * The server (app.ts) handles SSR head injection directly from the DB.
 */
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useCms } from "@/context/CmsContext";
import { DEFAULT_SEO } from "@/lib/cmsApi";

const SITE_ORIGIN = "https://aetherank.in";
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/opengraph.jpg`;

export default function SeoManager() {
  const [location] = useLocation();
  const { settings, loading } = useCms();

  useEffect(() => {
    if (loading) return;

    // All document.* calls are inside useEffect — safe: never runs on Node.
    function setMeta(name: string, content: string) {
      if (!content) return;
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    }

    function setOgMeta(property: string, content: string) {
      if (!content) return;
      let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.content = content;
    }

    function setCanonical(href: string) {
      let el = document.querySelector<HTMLLinkElement>(`link[rel="canonical"]`);
      if (!el) {
        el = document.createElement("link");
        el.rel = "canonical";
        document.head.appendChild(el);
      }
      el.href = href;
    }

    function injectSchema(json: string, id = "aetherank-schema-ld") {
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement("script");
        el.id = id;
        el.setAttribute("type", "application/ld+json");
        document.head.appendChild(el);
      }
      el.textContent = json;
    }

    const pageSeo = settings.seo[location] ?? DEFAULT_SEO[location];
    if (!pageSeo) return;

    const canonicalUrl = `${SITE_ORIGIN}${location === "/" ? "" : location}`;

    if (pageSeo.title) document.title = pageSeo.title;
    if (pageSeo.description) setMeta("description", pageSeo.description);
    if (pageSeo.keywords) setMeta("keywords", pageSeo.keywords);

    setCanonical(canonicalUrl || SITE_ORIGIN);

    setOgMeta("og:title", pageSeo.title);
    setOgMeta("og:description", pageSeo.description);
    setOgMeta("og:url", canonicalUrl || SITE_ORIGIN);
    setOgMeta("og:type", "website");
    setOgMeta("og:site_name", "Aetherank");
    setOgMeta("og:locale", "en_IN");
    setOgMeta("og:image", DEFAULT_OG_IMAGE);
    setOgMeta("og:image:width", "1200");
    setOgMeta("og:image:height", "630");
    setOgMeta("og:image:alt", "Aetherank Digital Marketing Agency");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:site", "@aetherank");
    setMeta("twitter:title", pageSeo.title);
    setMeta("twitter:description", pageSeo.description);
    setMeta("twitter:image", DEFAULT_OG_IMAGE);

    if (pageSeo.schema) {
      try {
        JSON.parse(pageSeo.schema);
        injectSchema(pageSeo.schema);
      } catch {
        console.warn("Invalid schema JSON for", location);
      }
    }

    if (pageSeo.faq_schema) {
      try {
        JSON.parse(pageSeo.faq_schema);
        injectSchema(pageSeo.faq_schema, "aetherank-faq-schema-ld");
      } catch {
        console.warn("Invalid FAQ schema JSON for", location);
      }
    } else {
      const existing = document.getElementById("aetherank-faq-schema-ld");
      if (existing) existing.remove();
    }
  }, [location, settings, loading]);

  return null;
}
