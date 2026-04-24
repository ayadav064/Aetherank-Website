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
// The CmsProvider reads this via window.__INITIAL_CMS__ to avoid
// a loading flash and ensure hydration matches SSR output exactly.
hydrateRoot(document.getElementById("root")!, <App />);
