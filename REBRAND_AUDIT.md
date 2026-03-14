# Rebrand Audit — Envy Design Co. → Cylio

**Date**: 2026-03-12
**Scope**: Full rebrand of static HTML website from "Envy Design Co." to "Cylio LLC"

---

## Automated Replacements (Phase 1)

**Script**: `scripts/rebrand-cylio.js`
**Result**: 2,340 replacements across 116 files

| Old Value | New Value | Count |
|-----------|-----------|-------|
| `Envy Design Co. Inc.` | `Cylio LLC` | ~50 |
| `Envy Design Co.` / `Envy Design` | `Cylio` | ~800 |
| `sales@envydesign.co` | `support@cylio.io` | ~40 |
| `envydesign.co` (domain) | `cylio.io` | ~300 |
| `+1 289-541-9179` | `+1 (718) 781-7927` | ~60 |
| Social media URLs (Facebook, Instagram, LinkedIn) | `https://cylio.io` | ~100 |
| `envydesign-offline` | `cylio-website` | ~10 |
| `© 2026 Envy Design Co. Inc.` | `© 2026 Cylio LLC.` | ~20 |
| Google Site Verification meta tags | Removed | ~18 |
| Performance Lab / Site Kit meta tags | Removed | ~18 |

---

## Structural Changes (Phase 2)

### Deleted
- **`project/` directory** — 32 case study subdirectories removed entirely
- `.playwright-mcp/` — development artifact
- Screenshot files: `envy-homepage.png`, `blog-post-agencies.png`, `stallion-compare-case-study.png`, `homepage-after-fix.jpeg`, `project-page-after-fix.jpeg`
- Log files: `network-requests.log`, `network-after-fix.log`

### Created
- `vercel.json` — Vercel deployment config (cleanUrls, trailingSlash, asset caching)
- `robots.txt` — Search engine directives

---

## Manual Edits by Page

### Homepage (`index.html`)
- Title: `"Web Design & Development | Cylio"`
- Meta description: Updated to Cylio-specific copy
- JSON-LD schema: Organization name, description, removed sameAs social links
- Hero section: New headline "We build digital experiences that perform."
- Testimonials: "Envy" → "Cylio" in review quotes
- FAQ section: All "Toronto web design" → generalized language ("our team", "our design experts")
- FAQ: "across Canada" → "across industries nationwide"
- FAQ: "Do you work with companies outside of Canada?" → "...outside of the US?"
- Footer: Added address (1910 Thomes Ave, Cheyenne, WY 82001), email, phone
- Case study links: All `/project/*` → `/portfolio/`
- Clutch.co link: Removed

### About Us (`about-us/index.html`)
- Title: `"About Us - Cylio"`
- Removed Michael Vince and Natashya Vince founder bios
- Replaced with Cylio company description
- Removed "Southern Ontario" references
- Updated JSON-LD schema

### Contact Us (`contact-us/index.html`)
- Updated displayed address to 1910 Thomes Ave, Cheyenne, WY 82001
- Updated email links to `support@cylio.io`
- Updated phone links to `+1 (718) 781-7927`
- Removed embedded Google Map iframe
- Updated `mailto:` and `tel:` links

### Privacy Policy (`privacy-policy/index.html`)
- All legal entity references → `Cylio LLC`
- Removed Ontario/Canada jurisdiction references
- Updated contact info

### Careers (`careers/index.html`)
- Updated title/meta
- Removed Toronto/Ontario location references
- Generalized position descriptions

### Portfolio (`portfolio/index.html`)
- Title: `"Portfolio - Cylio"`
- Replaced entire case study grid with "Selected projects coming soon" placeholder
- Removed all `/project/*` links
- Removed pagination to project pages

### Blog Articles (12 files)
- Author meta tags: `"Hung"` / `"Natashya"` → `"Cylio Team"` (all 12 files)
- JSON-LD Person schema: name and caption updated (all 12 files)
- Agency-ranking articles (4 files): Location references generalized
  - `"Toronto, Canada"` → `"United States"` or `"Nationwide, US"`
  - `"Canada's Leading..."` → `"Leading..."`
  - Other agencies' location references left untouched

---

## Logo & Asset Replacements

| File | Action |
|------|--------|
| `assets/img/2023/05/Vector-14.svg` | Overwritten with Cylio wordmark SVG |
| `assets/img/misc/envy-design-co.svg` | Overwritten with Cylio dark wordmark |
| `assets/img/2023/05/envy-design-co.svg` | Overwritten with Cylio background text (0.07 opacity) |
| `assets/img/2023/05/envy-design-co.-2.svg` | Overwritten with Cylio white wordmark |
| `assets/img/2020/02/cropped-icon-32x32.svg` | Created — Cylio "C" favicon |
| `assets/img/2020/02/cropped-icon-180x180.svg` | Created — Cylio "C" favicon |
| `assets/img/2020/02/cropped-icon-192x192.svg` | Created — Cylio "C" favicon |
| `assets/img/2020/02/cropped-icon-270x270.svg` | Created — Cylio "C" favicon |
| `assets/img/2022/11/og_image.svg` | Created — Cylio OG image |

---

## Supporting Files

| File | Change |
|------|--------|
| `package.json` | name: `cylio-website`, description: `Cylio LLC official website` |
| `package-lock.json` | Regenerated |
| `server.js` | Console log: `"Cylio website running at..."` |
| `README.md` | Complete rewrite for Cylio |
| `docs/ROUTE_INVENTORY.md` | Removed 32 project entries, updated to 18 pages |
| `tests/offline-verification.spec.js` | Removed project URLs, updated assertions |

---

## Remaining "envy" References (Acceptable)

These are **file paths** and **CSS class names** — not visible text:

1. **Image file paths** — `envy-design-co.-2.svg`, `envy-design-co.svg` (files contain Cylio SVG content)
2. **CSS class** — `envy-form-sec-cust` (internal Divi CSS selector, no user-visible text)

Renaming these files would require updating 18+ HTML files with inline CSS references, with risk of breaking layout. The files themselves contain correct Cylio branding.

---

## Final Verification Results

| Check | Status |
|-------|--------|
| "Envy Design" text in HTML | None found |
| "envydesign" domain | None found (except file paths) |
| "Michael Vince" / "Natashya Vince" | None found |
| Old phone (289-541-9179) | None found |
| Old email (sales@envydesign.co) | None found |
| Social media links | All removed or point to cylio.io |
| `/project/*` broken links | All redirected to `/portfolio/` |
| Toronto/Ontario in meta/titles | None found |
