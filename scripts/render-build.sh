#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing pnpm..."
npm install -g pnpm

echo "==> Clearing stale pnpm stores..."
rm -rf /opt/render/project/src/.pnpm-store 2>/dev/null || true
pnpm store path 2>/dev/null | xargs rm -rf 2>/dev/null || true

echo "==> Installing workspace dependencies..."
pnpm install --no-frozen-lockfile --shamefully-hoist

echo "==> Building..."
cd artifacts/api-server
BASE_PATH=/ NODE_ENV=production node build.mjs
cd ../..

echo "==> SSR check..."
test -f artifacts/api-server/dist/server/entry-server.mjs \
  && echo "SSR ✅" \
  || echo "SSR missing — meta-only fallback ⚠️"

echo "==> Syncing database..."
node_modules/.bin/drizzle-kit push --config lib/db/drizzle.config.ts || echo "DB push skipped"

echo "==> Done!"
ls -lh artifacts/api-server/dist/
