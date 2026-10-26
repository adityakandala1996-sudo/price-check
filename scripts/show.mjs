// Prints a saved result as a terminal table.
import { readFileSync } from 'node:fs';

const r = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const money = (v) => (typeof v === 'number' ? '$' + v.toFixed(2) : '—');

if (r.error) {
  console.log('\nError: ' + r.error);
  process.exit(1);
}
console.log('\n' + r.product);
if (r.assumption) console.log('Assumed: ' + r.assumption);
if (r.best?.retailer) console.log(`\nBest buy: ${r.best.retailer} at ${money(r.best.total)} — ${r.best.why}\n${r.best.url}`);

const table = (offers) => console.table(offers.map((o) => ({
  Retailer: o.retailer, Total: money(o.total ?? o.price), Delivery: o.delivery, Stock: o.stock, Notes: o.notes,
})));
const good = r.offers.filter((o) => !o.risky);
const risky = r.offers.filter((o) => o.risky);
if (good.length) table(good);
if (risky.length) { console.log('Cheaper but riskier:'); table(risky); }
for (const t of r.tips || []) console.log('Tip: ' + t);
console.log(`\nSaved to ${process.argv[2]} (checked ${new Date(r.checked_at).toLocaleString('en-AU')})`);
