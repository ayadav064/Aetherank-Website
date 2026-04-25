/**
 * entry-client.tsx
 * Client hydration — reuses SSR HTML from the server instead of re-rendering.
 */
import { hydrateRoot } from "react-dom/client";
import { Router } from "wouter";
import App from "./App";
import "./index.css";

const initialCmsData =
  (window as unknown as Record<string, unknown>).__INITIAL_CMS__ as
  | Record<string, unknown>
  | undefined;

hydrateRoot(
  document.getElementById("root")!,
  // Router wrapper MUST match entry-server.tsx to avoid hydration mismatch
  <Router>
    <App initialCmsData={initialCmsData} />
  </Router>
);
