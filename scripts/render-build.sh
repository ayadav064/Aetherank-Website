#!/usr/bin/env bash
set -e

echo "==> Installing pnpm..."
npm install -g pnpm

echo "==> Installing workspace dependencies..."
pnpm install

echo "==> Building frontend..."
cd artifacts/aetherank-website
BASE_PATH=/ NODE_ENV=production pnpm run build
cd ../..

echo "==> Building backend..."
cd artifacts/api-server
pnpm run build
cd ../..

echo "==> Copying frontend into backend..."
cp -r artifacts/aetherank-website/dist/public artifacts/api-server/dist/public

echo "==> Build complete!"
ls -lh artifacts/api-server/dist/
