#!/usr/bin/env bash
# Runs one price check with a minimal context: our own system prompt and only the two web tools.
# Reads ITEM and POSTCODE from the environment; writes Claude's JSON output to out.json.
set -uo pipefail
cd "$(dirname "$0")/.."
node scripts/prompt.mjs > prompt.txt
claude -p "Find the best current price for the wishlist item described in your instructions." \
  --system-prompt "$(cat prompt.txt)" \
  --tools "WebSearch,WebFetch" \
  --allowedTools "WebSearch,WebFetch" \
  --disable-slash-commands \
  --strict-mcp-config \
  --model sonnet \
  --max-turns 15 \
  --output-format json > out.json || true
