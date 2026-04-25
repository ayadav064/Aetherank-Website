/**
 * entry-server.tsx
 * Vite SSR entry — compiled to dist/server/entry-server.mjs by build.mjs
 * Called by Express (app.ts) once per request.
 */
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import App from "./App";

export interface RenderResult {
  html: string;
  headTags: string;
}

export async function render(
  url: string,
  initialCmsData?: Record<string, unknown>
): Promise<RenderResult> {
  // Give framer-motion a no-op IntersectionObserver so whileInView doesn't crash Node
  if (typeof globalThis.IntersectionObserver === "undefined") {
    // @ts-expect-error — Node doesn't have IntersectionObserver
    globalThis.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  const { hook } = memoryLocation({ path: url, static: true });

  const appHtml = renderToString(
    <Router hook={hook}>
      <App initialCmsData={initialCmsData} />
    </Router>
  );

  const cmsScript = initialCmsData
    ? `<script>window.__INITIAL_CMS__=${JSON.stringify(initialCmsData).replace(/</g, "\\u003c")};</script>`
    : "";

  return { html: appHtml, headTags: cmsScript };
}
