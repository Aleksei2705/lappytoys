#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

echo "==> Installing dependencies..."
npm install

echo "==> Building static site..."
npm run build

echo "==> Publishing to web root..."
rm -rf _next
cp -rf out/* .

echo "==> Deploy complete."
