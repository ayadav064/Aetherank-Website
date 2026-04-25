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

// Reusable no-op DOM element stub — framer-motion calls addEventListener on
// document.body, document.documentElement, and ad-hoc elements during layout
// projection setup. Every stub must have it or SSR blows up.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const domElementStub = (): any => ({
  style: {},
  classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
  setAttribute: () => {},
  getAttribute: () => null,
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
  getBoundingClientRect: () => ({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, x: 0, y: 0 }),
  offsetWidth: 0,
  offsetHeight: 0,
  nodeType: 1,
  childNodes: [],
  appendChild: () => {},
  removeChild: () => {},
  contains: () => false,
  ownerDocument: null as unknown,
});

if (typeof globalThis.window === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).window = globalThis;
}

// window needs event methods too (motion-dom calls window.addEventListener)
if (typeof (globalThis as any).addEventListener === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).addEventListener = () => {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).removeEventListener = () => {};
}

if (typeof (globalThis as any).getComputedStyle === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).getComputedStyle = () => ({
    getPropertyValue: () => "",
    setProperty: () => {},
  });
}

if (typeof globalThis.document === "undefined") {
  const body = domElementStub();
  const documentElement = domElementStub();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = {
    createElement: domElementStub,
    createElementNS: domElementStub,
    createTextNode: () => ({ nodeType: 3 }),
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    getElementsByTagName: () => [],
    body,
    documentElement,
    head: { appendChild: () => {}, querySelector: () => null },
    title: "",
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
    readyState: "complete",
    visibilityState: "visible",
  };
  body.ownerDocument = doc;
  documentElement.ownerDocument = doc;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).document = doc;
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
