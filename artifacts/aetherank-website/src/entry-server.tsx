/**
 * entry-server.tsx
 *
 * Vite SSR server entry. This file runs on Node.js (inside Express)
 * and exports a single `render()` function that returns the full
 * HTML string for a given URL.
 *
 * DEPLOY TO: artifacts/aetherank-website/src/entry-server.tsx
 */
import { renderToString } from "react-dom/server";
import { Router as WouterRouter } from "wouter";
import { memoryLocation } from "wouter/memory-location";
// NOTE: do NOT import index.css here — Node cannot process CSS files

export interface RenderResult {
  html: string;
  headTags: string;
}

export async function render(
  url: string,
  initialCmsData?: Record<string, unknown>
): Promise<RenderResult> {
  const { hook, searchHook } = memoryLocation({ path: url, static: true });

  // Dynamically import App to avoid CSS/browser-only top-level side effects
  const { default: App } = await import("./App");

  const appHtml = renderToString(
    // WouterRouter provides location context for the Switch/Route inside App
    <WouterRouter hook={hook} searchHook={searchHook}>
      {/* App creates its own QueryClientProvider — do NOT double-wrap here */}
      <App initialCmsData={initialCmsData} />
    </WouterRouter>
  );

  // Serialise CMS data so the client can hydrate without a round-trip fetch
  const serializedCmsData = initialCmsData
    ? JSON.stringify(initialCmsData).replace(/</g, "\\u003c")
    : "";
  const cmsScript = serializedCmsData
    ? `<script>window.__INITIAL_CMS__ = ${serializedCmsData};</script>`
    : "";

  return { html: appHtml, headTags: cmsScript };
}
