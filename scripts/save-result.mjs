// Extracts Claude's JSON answer, validates it and writes results/<slug>.json.
import { readFileSync, writeFileSync } from 'node:fs';

const slug = process.env.SLUG || '';
if (!/^[a-z0-9-]{1,80}$/.test(slug)) {
  console.error('Invalid slug');
  process.exit(1);
}

const base = {
  item: (process.env.ITEM || '').slice(0, 500),
  postcode: (process.env.POSTCODE || '').replace(/\D/g, '').slice(0, 4),
  checked_at: new Date().toISOString(),
};

const str = (v, n = 300) => (typeof v === 'string' ? v.slice(0, n) : '');
const num = (v) => (typeof v === 'number' && isFinite(v) ? Math.round(v * 100) / 100 : null);
const url = (v) => (typeof v === 'string' && /^https?:\/\//.test(v) ? v.slice(0, 1000) : '');

// Total tokens across every model the run used (Sonnet plus the Haiku page reader).
function readUsage(raw) {
  let tokens = 0;
  for (const m of Object.values(raw.modelUsage || {})) {
    tokens += (m.inputTokens || 0) + (m.outputTokens || 0) + (m.cacheReadInputTokens || 0) + (m.cacheCreationInputTokens || 0);
  }
  if (!tokens) return null;
  return {
    tokens,
    cost_usd: num(raw.total_cost_usd),
    turns: num(raw.num_turns),
    seconds: Math.round((raw.duration_ms || 0) / 1000),
  };
}

let usage = null;
function parse() {
  let raw;
  try {
    raw = JSON.parse(readFileSync(process.argv[2], 'utf8'));
  } catch {
    throw new Error('Claude did not return any output (check the CLAUDE_CODE_OAUTH_TOKEN secret).');
  }
  usage = readUsage(raw);
  if (raw.is_error || /not logged in|\/login/i.test(String(raw.result || ''))) {
    if (/not logged in|\/login|auth/i.test(String(raw.result || ''))) {
      throw new Error('Claude is not logged in: the repo secret CLAUDE_CODE_OAUTH_TOKEN is missing or wrong. Run `claude setup-token` and add it under Settings → Secrets and variables → Actions → Secrets.');
    }
    throw new Error(str(raw.result) || 'Claude reported an error.');
  }
  const text = String(raw.result || '');
  const fenced = text.match(/```json\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  const d = JSON.parse(body);
  const offers = (Array.isArray(d.offers) ? d.offers : []).slice(0, 12).map((o) => ({
    retailer: str(o.retailer, 80),
    price: num(o.price),
    delivery: str(o.delivery, 60),
    total: num(o.total),
    stock: str(o.stock, 40),
    url: url(o.url),
    notes: str(o.notes),
    risky: o.risky === true,
    verified: o.verified === true,
  }));
  const b = d.best || {};
  return {
    product: str(d.product, 200),
    assumption: str(d.assumption),
    best: { retailer: str(b.retailer, 80), total: num(b.total), url: url(b.url), why: str(b.why) },
    offers,
    tips: (Array.isArray(d.tips) ? d.tips : []).slice(0, 6).map((t) => str(t)),
    sources: (Array.isArray(d.sources) ? d.sources : []).map(url).filter(Boolean).slice(0, 20),
  };
}

let result;
try {
  result = { ...base, ...parse() };
} catch (e) {
  result = { ...base, error: str(e.message, 500) || 'Could not read the result.' };
}
if (usage) result.usage = usage;
writeFileSync(`results/${slug}.json`, JSON.stringify(result, null, 2) + '\n');
console.log(result.error ? `Saved error: ${result.error}` : `Saved ${result.offers.length} offers`);
