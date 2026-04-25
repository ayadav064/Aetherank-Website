import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { rm, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const websiteDir  = path.resolve(artifactDir, "../aetherank-website");
const distDir     = path.resolve(artifactDir, "dist");

// Use node_modules/.bin/vite directly — avoids pnpm exec which needs lockfile
const viteBin = path.resolve(websiteDir, "node_modules/.bin/vite");

function runVite(extraEnv = {}) {
  return (args) =>
    execSync(`"${viteBin}" ${args}`, {
      cwd: websiteDir,
      stdio: "inherit",
      env: { ...process.env, NODE_ENV: "production", BASE_PATH: "/", ...extraEnv },
      shell: true,
    });
}

async function buildAll() {
  await rm(distDir, { recursive: true, force: true });

  // ── 1. Vite client build ──────────────────────────────────────────────────
  console.log("\n🔨 Vite client build…");
  runVite()("build --config vite.config.ts");
  const clientSrc = path.resolve(websiteDir, "dist/public");
  await cp(clientSrc, path.resolve(distDir, "public"), { recursive: true });
  console.log("✅ Client → dist/public/");

  // ── 2. Vite SSR build ─────────────────────────────────────────────────────
  console.log("\n🔨 Vite SSR build…");
  try {
    runVite({ BUILD_SSR: "1" })("build --config vite.config.ts");
    const ssrSrc  = path.resolve(websiteDir, "dist/server");
    const ssrDest = path.resolve(distDir, "server");
    await cp(ssrSrc, ssrDest, { recursive: true });
    console.log("✅ SSR → dist/server/entry-server.mjs");
  } catch (err) {
    console.warn("⚠️  SSR build failed — server falls back to SPA+meta:", err.message);
  }

  // ── 3. esbuild API server ─────────────────────────────────────────────────
  console.log("\n🔨 esbuild Express server…");
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
      "pg-native","oracledb","mongodb-client-encryption","nodemailer",
      "handlebars","knex","typeorm","protobufjs","onnxruntime-node",
      "@tensorflow/*","@prisma/client","@mikro-orm/*","@grpc/*","@swc/*",
      "@aws-sdk/*","@azure/*","@opentelemetry/*","@google-cloud/*","@google/*",
      "googleapis","firebase-admin","@parcel/watcher","@sentry/profiling-node",
      "@tree-sitter/*","aws-sdk","classic-level","dd-trace","ffi-napi","grpc",
      "hiredis","kerberos","leveldown","miniflare","mysql2","newrelic","odbc",
      "piscina","realm","ref-napi","rocksdb","sass-embedded","sequelize",
      "serialport","snappy","tinypool","usb","workerd","wrangler","zeromq",
      "zeromq-prebuilt","playwright","puppeteer","puppeteer-core","electron",
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

  console.log("\n✅ Build complete");
  console.log("   Client → dist/public/");
  console.log("   SSR    → dist/server/entry-server.mjs");
  console.log("   Server → dist/index.mjs");
}

buildAll().catch((err) => { console.error(err); process.exit(1); });
