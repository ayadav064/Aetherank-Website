#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing pnpm..."
npm install -g pnpm

echo "==> Deleting corrupted lockfile..."
# pnpm-lock.yaml has stale checksums from packages republished on npm.
# Deleting it forces pnpm to resolve and download everything fresh.
rm -f pnpm-lock.yaml

echo "==> Installing workspace dependencies..."
pnpm install --no-frozen-lockfile --store-dir /opt/render/project/src/.pnpm-store

echo "==> Building frontend, SSR renderer, and backend..."
cd artifacts/api-server
BASE_PATH=/ NODE_ENV=production pnpm run build
cd ../..

echo "==> Checking SSR output..."
if test -f artifacts/api-server/dist/server/entry-server.mjs; then
  echo "SSR bundle present ✅"
else
  echo "SSR bundle missing — serving SPA with meta injection ⚠️"
fi

echo "==> Syncing database schema..."
node_modules/.bin/drizzle-kit push --config lib/db/drizzle.config.ts || echo "DB push skipped"

echo "==> Build complete!"
ls -lh artifacts/api-server/dist/
