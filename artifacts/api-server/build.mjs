/**
 * build.mjs — builds the API server + Vite client + Vite SSR bundle
 *
 * Build orders:
 *   1. Vite client build  → aetherank-website/dist/public/
 *   2. Vite SSR build     → aetherank-website/dist/server/entry-server.mjs
 *   3. esbuild API server → api-server/dist/index.mjs
 *
 * DEPLOY TO: artifacts/api-server/build.mjs
 */

import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { rm, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const websiteDir = path.resolve(artifactDir, "../aetherank-website");

function runPnpm(args, options) {
  const npmExecPath = process.env.npm_execpath;
  const command = npmExecPath ? process.execPath : "pnpm";
  const commandArgs = npmExecPath ? [npmExecPath, ...args] : args;
  execFileSync(command, commandArgs, options);
}

async function buildAll() {
  // ── 1. Clean API dist ─────────────────────────────────────────────────────
  const distDir = path.resolve(artifactDir, "dist");
  await rm(distDir, { recursive: true, force: true });

  // ── 2. Vite client build ──────────────────────────────────────────────────
  console.log("\n🔨 Building Vite client bundle…");
  runPnpm(["exec", "vite", "build", "--config", "vite.config.ts"], {
    cwd: websiteDir,
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  });
  console.log("✅ Vite client build complete");

  // ── 3. Vite SSR build ─────────────────────────────────────────────────────
  console.log("\n🔨 Building Vite SSR bundle…");
  runPnpm(["exec", "vite", "build", "--config", "vite.config.ts"], {
    cwd: websiteDir,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
      BUILD_SSR: "1",
    },
  });
  console.log("✅ Vite SSR build complete");

  // ── 4. Copy SSR bundle next to client dist so Express can find it ─────────
  // Express looks for: dist/public/../server/entry-server.mjs
  // which resolves to:  dist/server/entry-server.mjs
  const ssrSrc = path.resolve(websiteDir, "dist/server");
  const ssrDest = path.resolve(artifactDir, "dist/server");
  const ssrEntry = path.resolve(ssrSrc, "entry-server.mjs");
  if (!existsSync(ssrEntry)) {
    throw new Error(`SSR entry was not generated: ${ssrEntry}`);
  }
  await cp(ssrSrc, ssrDest, { recursive: true });
  console.log("✅ SSR bundle copied to api-server/dist/server/");

  // ── 5. Copy client dist (static assets) next to API dist ─────────────────
  // Express also looks for dist/public relative to __dirname (api dist)
  const clientSrc = path.resolve(websiteDir, "dist/public");
  const clientDest = path.resolve(artifactDir, "dist/public");
  if (!existsSync(path.resolve(clientSrc, "index.html"))) {
    throw new Error(`Client index.html was not generated: ${clientSrc}`);
  }
  await cp(clientSrc, clientDest, { recursive: true });
  console.log("✅ Client assets copied to api-server/dist/public/");

  // ── 6. esbuild API server ─────────────────────────────────────────────────
  console.log("\n🔨 Building Express API server…");
  await esbuild({
    entryPoints: [path.resolve(artifactDir, "src/index.ts")],
    platform: "node",
    bundle: true,
    format: "esm",
    outdir: distDir,
    outExtension: { ".js": ".mjs" },
    logLevel: "info",
    external: [
      "*.node",
      "sharp",
      "better-sqlite3",
      "sqlite3",
      "canvas",
      "bcrypt",
      "argon2",
      "fsevents",
      "re2",
      "farmhash",
      "xxhash-addon",
      "bufferutil",
      "utf-8-validate",
      "ssh2",
      "cpu-features",
      "dtrace-provider",
      "isolated-vm",
      "lightningcss",
      "pg-native",
      "oracledb",
      "mongodb-client-encryption",
      "nodemailer",
      "handlebars",
      "knex",
      "typeorm",
      "protobufjs",
      "onnxruntime-node",
      "@tensorflow/*",
      "@prisma/client",
      "@mikro-orm/*",
      "@grpc/*",
      "@swc/*",
      "@aws-sdk/*",
      "@azure/*",
      "@opentelemetry/*",
      "@google-cloud/*",
      "@google/*",
      "googleapis",
      "firebase-admin",
      "@parcel/watcher",
      "@sentry/profiling-node",
      "@tree-sitter/*",
      "aws-sdk",
      "classic-level",
      "dd-trace",
      "ffi-napi",
      "grpc",
      "hiredis",
      "kerberos",
      "leveldown",
      "miniflare",
      "mysql2",
      "newrelic",
      "odbc",
      "piscina",
      "realm",
      "ref-napi",
      "rocksdb",
      "sass-embedded",
      "sequelize",
      "serialport",
      "snappy",
      "tinypool",
      "usb",
      "workerd",
      "wrangler",
      "zeromq",
      "zeromq-prebuilt",
      "playwright",
      "puppeteer",
      "puppeteer-core",
      "electron",
      // SSR bundle is loaded dynamically at runtime — don't bundle it
      "./dist/server/entry-server.mjs",
    ],
    sourcemap: "linked",
    plugins: [esbuildPluginPino({ transports: ["pino-pretty"] })],
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
    `,
    },
  });

  console.log("\n✅ All builds complete");
  console.log("   ├── Client:  dist/public/");
  console.log("   ├── SSR:     dist/server/entry-server.mjs");
  console.log("   └── Server:  dist/index.mjs");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
