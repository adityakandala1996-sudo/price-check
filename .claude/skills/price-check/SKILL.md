---
name: price-check
description: Find the best current price in Australia for wishlist items. Use when the user sends a product name or link (or a list) and asks for the best price/deal, says "price check", "wishlist", "where's it cheapest", or invokes /price-check.
---

# Price check (Australia)

The user sends one or more wishlist items (name, model number or link). Find the lowest **genuine** price available to buy in Australia right now and report it in a table.

## 1. Pin down the exact product
- Extract brand + exact model / SKU / variant (size, colour, storage, generation). If a link was given, fetch it to read the model.
- If the item is too vague to compare (e.g. "a good vacuum"), ask one short question or pick the most likely model and say so.
- Compare like for like only. Different variant, older generation, refurbished or bundle → list separately or exclude.

## 2. Search
Run searches in parallel (WebSearch standard; WebFetch product pages to confirm price and stock). Cover:
- **Aggregators first** to find candidates fast: Google Shopping AU, StaticICE (staticice.com.au, tech), PriceHipster, PriceSpy AU, getprice.
- **OzBargain** (ozbargain.com.au) for live deals, coupon codes and recent lows.
- **Then confirm on the retailers' own pages.** Genuine AU retailers by category:
  - General / electronics: JB Hi-Fi, Harvey Norman, The Good Guys, Officeworks, Bing Lee, Amazon.com.au (sold by Amazon AU or the brand's official store), Big W, Target, Kmart, Costco AU, Myer, David Jones, the brand's own AU store (Apple, Samsung, Dyson, etc.)
  - PC / tech parts: Scorptec, PC Case Gear, Mwave, Centre Com, Umart, MSY
  - Home / hardware: Bunnings, Amart, IKEA, Temple & Webster
  - Health / beauty: Chemist Warehouse, Priceline, Adore Beauty, Mecca, Sephora AU
  - Fashion / sport: The Iconic, Rebel Sport, brand stores
  - Groceries / liquor: Woolworths, Coles, Dan Murphy's, BWS
  - eBay AU only from official brand or major-retailer stores. Kogan is legit but often sells grey imports, so flag it.

## 3. Genuine-seller rules
- Only report AU-based retailers or official AU stores selling new stock with AU warranty.
- **Flag grey imports** (no AU warranty, overseas stock, wrong plug) and marketplace third-party sellers. Show them in a separate "cheaper but riskier" line, never as the best price.
- Exclude any site that looks like a scam: unknown domain, price far below every major retailer, no ABN, only bank-transfer payment.
- Never invent a price. If a page can't be confirmed, mark it "unverified" or leave it out.

## 4. Work out the real cost
For each option: item price + delivery to the user's location (ask their postcode once and remember it if they share it) or "free click & collect". Note in-stock vs backorder. Apply any working public coupon code.

## 5. Reply format
For each item:

**<Exact product name>**

| Retailer | Price | Delivery | Total | Stock | Notes |
|---|---|---|---|---|---|

- Sort by total, cheapest first; 4–8 rows max.
- Then one line: **Best buy: <retailer> at $X** — and why (cheapest genuine, in stock).
- **Price-match tip** when it saves money: JB Hi-Fi, Harvey Norman, The Good Guys and Bing Lee price match; Officeworks beats by 5%, Bunnings beats by 10% (on identical in-stock items from a local competitor; check current policy).
- Mention cashback (ShopBack, Cashrewards) or an upcoming sale (Click Frenzy, Black Friday, EOFY, Boxing Day) only if relevant to the date.
- End with "Prices checked <date>; they change quickly — confirm at checkout." and the source links.

For several items, do each item in turn, then a short total at the end.
