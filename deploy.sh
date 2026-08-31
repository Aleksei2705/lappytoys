#!/bin/bash
set -e

cd "$(dirname "$0")"

# Common Node.js paths on Plesk hosting
export PATH="/opt/plesk/node/22/bin:/opt/plesk/node/20/bin:/opt/plesk/node/18/bin:/usr/local/bin:$PATH"

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm not found. Enable Node.js in Plesk for lappytoys.kz."
  exit 1
fi

echo "Using node: $(command -v node)"
echo "Using npm: $(command -v npm)"

npm install
npm run build

rm -rf _next
cp -rf out/* .

echo "Deploy complete."
