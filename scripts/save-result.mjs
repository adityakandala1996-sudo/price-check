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

function parse() {
  let raw;
  try {
    raw = JSON.parse(readFileSync(process.argv[2], 'utf8'));
  } catch {
    throw new Error('Claude did not return any output (check the CLAUDE_CODE_OAUTH_TOKEN secret).');
  }
  if (raw.is_error) throw new Error(str(raw.result) || 'Claude reported an error.');
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
writeFileSync(`results/${slug}.json`, JSON.stringify(result, null, 2) + '\n');
console.log(result.error ? `Saved error: ${result.error}` : `Saved ${result.offers.length} offers`);
