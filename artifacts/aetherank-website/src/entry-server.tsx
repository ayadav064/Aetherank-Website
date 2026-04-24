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
import { staticLocation } from "wouter/static";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

export interface RenderResult {
  html: string;
  headTags: string;
}

/**
 * Render the app to an HTML string for a given URL path.
 * initialCmsData is pre-fetched by the Express server and injected
 * so CmsContext has real data during the SSR pass (no loading state).
 */
export async function render(
  url: string,
  initialCmsData?: Record<string, unknown>
): Promise<RenderResult> {
  // Fresh QueryClient per request to avoid state bleeding between users
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // On the server we never retry — either we have data or we don't
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  // Inject CMS data into a global so CmsProvider can read it synchronously
  // during the SSR render pass. This prevents the "loading" flash and
  // ensures the HTML Googlebot receives matches what the user sees.
  if (initialCmsData) {
    (globalThis as Record<string, unknown>).__INITIAL_CMS__ = initialCmsData;
  }

  const appHtml = renderToString(
    <WouterRouter hook={staticLocation(url)}>
      <QueryClientProvider client={queryClient}>
        <App ssrUrl={url} initialCmsData={initialCmsData} />
      </QueryClientProvider>
    </WouterRouter>
  );

  // Clean up global after render
  delete (globalThis as Record<string, unknown>).__INITIAL_CMS__;

  // Serialise CMS data so the client can hydrate without a round-trip
  const cmsScript = initialCmsData
    ? `<script>window.__INITIAL_CMS__ = ${JSON.stringify(initialCmsData)};</script>`
    : "";

  return {
    html: appHtml,
    headTags: cmsScript,
  };
}
