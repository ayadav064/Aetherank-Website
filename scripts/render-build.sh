#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing pnpm..."
npm install -g pnpm

echo "==> Installing workspace dependencies..."
pnpm store prune || true
pnpm install --no-frozen-lockfile

echo "==> Building frontend, SSR renderer, and backend..."
cd artifacts/api-server
BASE_PATH=/ NODE_ENV=production pnpm run build
cd ../..

echo "==> Verifying SSR output..."
test -f artifacts/api-server/dist/server/entry-server.mjs

echo "==> Syncing database schema..."
node_modules/.bin/drizzle-kit push --config lib/db/drizzle.config.ts || echo "DB push skipped (no DATABASE_URL or already in sync)"

echo "==> Build complete!"
ls -lh artifacts/api-server/dist/
ls -lh artifacts/api-server/dist/server/
