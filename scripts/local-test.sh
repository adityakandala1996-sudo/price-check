#!/usr/bin/env bash
# Runs the same price check as the GitHub Action, on this machine, and prints the result.
# Usage: scripts/local-test.sh "Sony WH-1000XM5" [postcode]
set -euo pipefail
cd "$(dirname "$0")/.."

export ITEM="${1:?Usage: scripts/local-test.sh \"item name\" [postcode]}"
export POSTCODE="${2:-}"
export SLUG=$(node -e 'console.log(process.env.ITEM.toLowerCase().replace(/https?:\/\/(www\.)?/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "item")')

node scripts/prompt.mjs > prompt.txt
echo "Searching for \"$ITEM\" — usually 3–5 minutes…"
claude -p "$(cat prompt.txt)" \
  --model sonnet \
  --allowedTools "WebSearch,WebFetch" \
  --max-turns 60 \
  --output-format json > out.json || true

node scripts/save-result.mjs out.json
node scripts/show.mjs "results/$SLUG.json"
