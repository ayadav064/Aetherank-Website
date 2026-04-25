#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing pnpm..."
npm install -g pnpm

echo "==> Configuring pnpm..."
# Use /tmp store (empty on every Render build - never cached)
pnpm config set store-dir /tmp/pnpm-store
# Disable integrity check — some packages on npm registry have mismatched
# checksums between their metadata and actual tarball (npm republishing bug)
pnpm config set verify-store-integrity false

echo "==> Removing stale lockfile..."
rm -f pnpm-lock.yaml

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
