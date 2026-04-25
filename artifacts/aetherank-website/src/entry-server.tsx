/**
 * entry-server.tsx
 * Vite SSR entry — compiled to dist/server/entry-server.mjs by build.mjs
 * Called by Express (app.ts) once per request.
 *
 * POLYFILLS: framer-motion and other packages read window/document/IntersectionObserver
 * at module-evaluation time when bundled for SSR. We patch globalThis FIRST so those
 * reads return safe stubs instead of throwing ReferenceError.
 */

// ─── Browser API polyfills (must be before any component import) ─────────────

if (typeof globalThis.window === "undefined") {
  // Minimal window stub — just enough to stop framer-motion from throwing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).window = globalThis;
}

if (typeof globalThis.document === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).document = {
    createElement: () => ({ style: {}, setAttribute: () => {}, addEventListener: () => {} }),
    createElementNS: () => ({ style: {}, setAttribute: () => {}, addEventListener: () => {} }),
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    body: { style: {}, classList: { add: () => {}, remove: () => {}, contains: () => false } },
    head: { appendChild: () => {} },
    title: "",
    addEventListener: () => {},
    removeEventListener: () => {},
  };
}

if (typeof globalThis.navigator === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).navigator = { userAgent: "Node.js SSR", language: "en" };
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (typeof globalThis.ResizeObserver === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (typeof globalThis.MutationObserver === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).MutationObserver = class {
    observe() {}
    disconnect() {}
    takeRecords() { return []; }
  };
}

if (typeof globalThis.matchMedia === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).matchMedia = () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  });
}

// ─── React SSR ───────────────────────────────────────────────────────────────

import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";

export interface RenderResult {
  html: string;
  headTags: string;
}

/**
 * A minimal static location hook for wouter SSR.
 *
 * wouter's built-in memoryLocation uses useSyncExternalStore without
 * providing getServerSnapshot, which React 18's renderToString requires.
 * This hook avoids the external store entirely — it just returns the URL
 * as a constant, which is all SSR needs.
 */
function staticLocation(url: string) {
  // Strip query string / hash — wouter only needs the pathname
  const path = url.split("?")[0].split("#")[0] || "/";
  // Hook signature: () => [currentPath, navigate]
  return (): [string, (to: string) => void] => [path, () => {}];
}

export async function render(
  url: string,
  initialCmsData?: Record<string, unknown>
): Promise<RenderResult> {
  const hook = staticLocation(url);

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
