/**
 * entry-client.tsx
 * 
 * Client-side hydration entry. Replaces main.tsx.
 * Uses hydrateRoot (not createRoot) so React reuses the SSR HTML
 * instead of throwing it away and re-rendering from scratch.
 * 
 * DEPLOY: rename/replace src/main.tsx with this file, OR
 * update index.html src="/src/entry-client.tsx"
 */
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// __INITIAL_CMS__ is injected by the server into the HTML.
// Pass it explicitly so the CmsProvider's initial useState() matches
// the SSR render exactly — prevents a hydration mismatch / content flash.
const initialCmsData =
  (window as unknown as Record<string, unknown>).__INITIAL_CMS__ as
  | Record<string, unknown>
  | undefined;

hydrateRoot(
  document.getElementById("root")!,
  <App initialCmsData={initialCmsData} />
);
