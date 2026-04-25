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
