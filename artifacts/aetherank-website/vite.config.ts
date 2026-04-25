/**
 * vite.config.ts — SSR-enabled
 *
 * Adds a second SSR build target (entry-server.tsx) alongside the
 * existing client build. The Express server imports the compiled
 * entry-server.mjs to run renderToString per request.
 *
 * DEPLOY TO: artifacts/aetherank-website/vite.config.ts
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;
const isBuild = process.argv.includes("build");
const isSSR = process.env.BUILD_SSR === "1";

if (!isBuild && !rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided."
  );
}

const port = rawPort ? Number(rawPort) : 3000;

if (!isBuild && (Number.isNaN(port) || port <= 0)) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base: basePath,

  plugins: [
    react(),
    tailwindcss(),
    // Only include dev-only plugins when not building SSR bundle
    ...(!isSSR ? [runtimeErrorOverlay()] : []),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined &&
    !isSSR
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            })
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner()
          ),
        ]
      : []),
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(
        import.meta.dirname,
        "..",
        "..",
        "attached_assets"
      ),
    },
    dedupe: ["react", "react-dom"],
  },

  root: path.resolve(import.meta.dirname),

  build: isSSR
    ? {
        // ── SSR bundle ───────────────────────────────────────────────────────
        // Outputs a single Node-compatible ESM file that Express imports.
        ssr: "src/entry-server.tsx",
        outDir: path.resolve(import.meta.dirname, "dist/server"),
        emptyOutDir: true,
        rollupOptions: {
          output: {
            format: "esm",
            entryFileNames: "entry-server.mjs",
          },
        },
      }
    : {
        // ── Client bundle (existing, unchanged) ──────────────────────────────
        outDir: path.resolve(import.meta.dirname, "dist/public"),
        emptyOutDir: true,
      },

  ssr: {
    // Bundle wouter so Vite resolves its conditional ESM exports correctly
    noExternal: ["wouter"],
    // framer-motion reads window/document at module-evaluation time when
    // bundled by Vite SSR (it does feature-detection in its module root).
    // Keeping it external means Node loads it as a real ESM package whose
    // own package.json conditions pick the server-safe code path.
    // recharts uses browser canvas — also must stay external.
    external: ["framer-motion", "recharts"],
  },

  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },

  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
