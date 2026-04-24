#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing pnpm..."
npm install -g pnpm

echo "==> Installing workspace dependencies..."
# Use a fresh store dir inside the project so Render's cached store is bypassed.
# This guarantees clean downloads every build — no stale checksum conflicts.
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
