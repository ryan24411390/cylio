# Blog Rewrite Report — Cylio LLC

Generated: 2026-03-13

## Summary

- **Articles replaced**: 12 of 12
- **Content approach**: Full body replacement with original Cylio-branded articles
- **Slugs**: Kept as-is for route stability
- **Author**: Cylio Team (previously Hung / Natashya)
- **Brand**: Cylio (previously Envy Design Co.)

---

## Article Mapping

| # | Old Title | New Title | Slug (unchanged) |
|---|-----------|-----------|-------------------|
| 1 | Why Your Website Should Make People Feel Something | Why Emotional Design Converts Better Than Feature Lists | `why-your-website-should-make-people-feel-something` |
| 2 | Top 10 Web Design Agencies in Canada 2026 | What Separates a Good Agency Website From a Great One | `top-web-design-agencies-canada-2026` |
| 3 | Best Web Development Agencies in Canada (2026) | How to Evaluate a Web Development Partner Before You Sign | `best-web-development-agencies-canada` |
| 4 | Canada's Top Graphic Design Agencies to Know in 2026 | Design Systems That Scale: A Practical Guide for Growing Teams | `canadas-top-graphic-design-agencies-to-know-in-2026` |
| 5 | Top Web Design Agencies Worldwide 2026 | Core Web Vitals in 2026: What Changed and What Still Matters | `top-web-design-agencies-worldwide-2026` |
| 6 | HVAC Website Design Checklist: 25 Must-Haves for Calls | The Website Launch Checklist: 25 Things to Verify Before Going Live | `hvac-website-design-checklist-25-must-haves-that-drive-more-calls` |
| 7 | HVAC Service Pages That Rank: How to Structure Pages | How to Structure Service Pages That Rank and Convert | `hvac-service-pages-that-rank-how-to-structure-pages-for-each-service` |
| 8 | HVAC Trust Signals: What to Add to Your Website | Trust Signals That Actually Convert: What to Put on Your Website | `hvac-trust-signals-what-to-add-to-your-website-to-win-more-jobs` |
| 9 | HVAC Website Copy That Converts: What to Say | Writing Website Copy That Converts: What to Say and Where | `hvac-website-copy-that-converts-what-to-say-and-where-to-say-it` |
| 10 | HVAC Booking & Quote Forms: Highest-Converting Layouts | High-Converting Contact Forms: Layout Patterns That Work | `hvac-booking-quote-forms-the-highest-converting-layouts` |
| 11 | HVAC Website Redesign: When to Redesign vs Patch | Website Redesign vs. Incremental Fixes: When Each Makes Sense | `hvac-website-redesign-when-to-redesign-vs-patch-your-current-site` |
| 12 | Why Your HVAC Website Isn't Converting in Canada | Why Your Website Is Not Converting and How to Fix It | `why-your-hvac-website-isnt-converting-in-canada-and-how-to-fix-it` |

---

## Metadata Changes

For each article, the following metadata was updated:

- **`<title>`** — New title + " - Cylio"
- **`og:title`** — New title + " - Cylio"
- **`og:description`** — New excerpt matching article content
- **`meta name="description"`** — Updated where present (3 articles)
- **`article:modified_time`** — Set to 2026-03-13T00:00:00+00:00
- **`twitter:data2`** — Updated reading time estimate
- **JSON-LD schema** — Updated headline, wordCount, dateModified, breadcrumb name, Person caption

### JSON-LD Cleanup
- `Person.name`: Changed from "Hung" to "Cylio Team"
- `Person.image.caption`: Changed from "Hung" to "Cylio Team"
- `WebSite.name`: Confirmed as "Cylio"
- `Organization.name`: Confirmed as "Cylio"
- `WebSite.description`: Updated to reflect Cylio's positioning

---

## Image Changes

- **OG images**: No changes needed (11 of 12 use generic `/assets/img/2022/11/og_image.png`)
- **Article body images**: Existing images retained with Divi lazy-load structure preserved
- **Alt text**: Image elements within article content were replaced as part of the full body replacement
- **No broken image references**: All image paths remain valid

---

## Cross-Reference Updates

| File | Change |
|------|--------|
| 12 blog `index.html` files | Article titles updated in related posts Swiper carousel |
| `index.html` (homepage) | Article titles updated in "Our latest articles" carousel |
| `tests/offline-verification.spec.js` | FAQ accordion test updated from HVAC text to new article FAQ |
| `docs/ROUTE_INVENTORY.md` | Blog article titles updated in route table |

---

## Topic Distribution

| Category | Articles | Coverage |
|----------|----------|----------|
| UX / Emotional Design | 1 | Why emotional design outperforms feature lists |
| Web Strategy | 1 | What makes agency websites effective |
| Vendor Selection | 1 | Evaluating web development partners |
| Design Systems | 1 | Scaling design systems for growing teams |
| Web Performance | 1 | Core Web Vitals in 2026 |
| Launch Process | 1 | 25-item pre-launch checklist |
| SEO / Content | 1 | Structuring service pages for ranking |
| Conversion | 2 | Trust signals; diagnosing conversion problems |
| Copywriting | 1 | Strategic website copy |
| Forms / UX | 1 | High-converting contact form patterns |
| Strategy | 1 | Redesign vs. incremental improvement |

No duplicate topics across the 12 articles.

---

## Files Modified

- `why-your-website-should-make-people-feel-something/index.html`
- `top-web-design-agencies-canada-2026/index.html`
- `best-web-development-agencies-canada/index.html`
- `canadas-top-graphic-design-agencies-to-know-in-2026/index.html`
- `top-web-design-agencies-worldwide-2026/index.html`
- `hvac-website-design-checklist-25-must-haves-that-drive-more-calls/index.html`
- `hvac-service-pages-that-rank-how-to-structure-pages-for-each-service/index.html`
- `hvac-trust-signals-what-to-add-to-your-website-to-win-more-jobs/index.html`
- `hvac-website-copy-that-converts-what-to-say-and-where-to-say-it/index.html`
- `hvac-booking-quote-forms-the-highest-converting-layouts/index.html`
- `hvac-website-redesign-when-to-redesign-vs-patch-your-current-site/index.html`
- `why-your-hvac-website-isnt-converting-in-canada-and-how-to-fix-it/index.html`
- `index.html` (homepage carousel)
- `tests/offline-verification.spec.js`
- `docs/ROUTE_INVENTORY.md`
- `scripts/replace-blog-content.js` (new — replacement script)
- `BLOG_CONTENT_AUDIT.md` (new — audit document)
