# Price Check

A wishlist page on GitHub Pages. Tap **Search** on an item and a GitHub Action runs Claude Code with the price-check skill (`.claude/skills/price-check/SKILL.md`). It searches genuine Australian retailers, then commits the result to `results/<item>.json`, and the page shows it.

## One-time setup
1. **Claude token:** on your Mac run `claude setup-token`, then add the token as repo secret `CLAUDE_CODE_OAUTH_TOKEN` (Settings → Secrets and variables → Actions). Runs use your Claude subscription.
2. **Pages:** Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
3. **GitHub token for the page:** create a fine-grained personal access token (GitHub → Settings → Developer settings) with access to this repo only. Give it *Actions: Read and write* and *Contents: Read and write*. Paste it into ⚙️ Settings on the page. It's stored only in that browser.

## Files
- `index.html`: the page
- `.github/workflows/price-check.yml`: the search job
- `scripts/prompt.mjs`, `scripts/save-result.mjs`: build the prompt, validate and save Claude's JSON
- `wishlist.json`, `results/`: data (written by the page and the job)
