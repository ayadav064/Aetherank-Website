#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing pnpm..."
npm install -g pnpm

echo "==> Removing stale lockfile and pnpm store..."
rm -f pnpm-lock.yaml
rm -rf /root/.local/share/pnpm/store
rm -rf /opt/render/project/src/.pnpm-store
rm -rf ~/.pnpm-store

echo "==> Installing workspace dependencies..."
pnpm install --no-frozen-lockfile

echo "==> Building..."
cd artifacts/api-server
BASE_PATH=/ NODE_ENV=production node build.mjs
cd ../..

echo "==> Checking SSR output..."
if test -f artifacts/api-server/dist/server/entry-server.mjs; then
  echo "SSR bundle present ✅"
else
  echo "SSR bundle missing ⚠️"
fi

echo "==> Syncing database schema..."
node_modules/.bin/drizzle-kit push --config lib/db/drizzle.config.ts || echo "DB push skipped"

echo "==> Build complete!"
ls -lh artifacts/api-server/dist/
