/**
 * build.mjs — Full build pipeline
 * 1. Vite client  → dist/public/
 * 2. Vite SSR     → dist/server/entry-server.mjs
 * 3. esbuild      → dist/index.mjs (Express server)
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { rm, cp } from "node:fs/promises";
import { execSync } from "node:child_process";

globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const websiteDir  = path.resolve(artifactDir, "../aetherank-website");
const distDir     = path.resolve(artifactDir, "dist");

// Use vite's actual JS entry, not the shell wrapper at .bin/vite
const viteBin = path.resolve(websiteDir, "node_modules/vite/bin/vite.js");

function vite(env = {}) {
  execSync(`node "${viteBin}" build --config vite.config.ts`, {
    cwd: websiteDir,
    stdio: "inherit",
    shell: false,
    env: { ...process.env, NODE_ENV: "production", BASE_PATH: "/", ...env },
  });
}

async function buildAll() {
  await rm(distDir, { recursive: true, force: true });

  // 1. Client build
  console.log("\n🔨 Client build…");
  vite();
  await cp(
    path.resolve(websiteDir, "dist/public"),
    path.resolve(distDir, "public"),
    { recursive: true }
  );
  console.log("✅ dist/public/");

  // 2. SSR build
  console.log("\n🔨 SSR build…");
  try {
    vite({ BUILD_SSR: "1" });
    await cp(
      path.resolve(websiteDir, "dist/server"),
      path.resolve(distDir, "server"),
      { recursive: true }
    );
    console.log("✅ dist/server/entry-server.mjs");
  } catch (e) {
    console.warn("⚠️  SSR build failed — site falls back to SPA+meta:", e.message);
  }

  // 3. API server
  console.log("\n🔨 Express API server…");
  await esbuild({
    entryPoints: [path.resolve(artifactDir, "src/index.ts")],
    platform: "node",
    bundle: true,
    format: "esm",
    outdir: distDir,
    outExtension: { ".js": ".mjs" },
    logLevel: "info",
    external: [
      "*.node","sharp","better-sqlite3","sqlite3","canvas","bcrypt","argon2",
      "fsevents","re2","farmhash","xxhash-addon","bufferutil","utf-8-validate",
      "ssh2","cpu-features","dtrace-provider","isolated-vm","lightningcss",
      "pg-native","oracledb","mongodb-client-encryption","nodemailer","handlebars",
      "knex","typeorm","protobufjs","onnxruntime-node","@tensorflow/*",
      "@prisma/client","@mikro-orm/*","@grpc/*","@swc/*","@aws-sdk/*","@azure/*",
      "@opentelemetry/*","@google-cloud/*","@google/*","googleapis","firebase-admin",
      "@parcel/watcher","@sentry/profiling-node","@tree-sitter/*","aws-sdk",
      "classic-level","dd-trace","ffi-napi","grpc","hiredis","kerberos","leveldown",
      "miniflare","mysql2","newrelic","odbc","piscina","realm","ref-napi","rocksdb",
      "sass-embedded","sequelize","serialport","snappy","tinypool","usb","workerd",
      "wrangler","zeromq","zeromq-prebuilt","playwright","puppeteer","puppeteer-core","electron",
    ],
    sourcemap: "linked",
    plugins: [esbuildPluginPino({ transports: ["pino-pretty"] })],
    banner: {
      js: `import { createRequire as __cr } from 'node:module';
import __p from 'node:path';
import __u from 'node:url';
globalThis.require = __cr(import.meta.url);
globalThis.__filename = __u.fileURLToPath(import.meta.url);
globalThis.__dirname = __p.dirname(globalThis.__filename);`,
    },
  });

  console.log("\n✅ Build complete → dist/public | dist/server | dist/index.mjs");
}

buildAll().catch((e) => { console.error(e); process.exit(1); });
