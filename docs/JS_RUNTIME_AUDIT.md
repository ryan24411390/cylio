# JavaScript Runtime Audit — Cylio Offline Mirror

**Date**: 2026-03-11
**Method**: Playwright browser automation with console error capture and network request monitoring.

---

## Before Fixes — Homepage Console Output

**17 errors, 2 warnings captured on initial page load:**

### Errors (17)

| # | Type | Message | Root Cause |
|---|------|---------|------------|
| 1 | 404 | `GET /wp-includes/js/jquery/jquery.min.js?ver=3.7.1` → 404 | jQuery path not rewritten |
| 2 | TypeError | `$(...).on is not a function` | jQuery missing → `$` undefined |
| 3 | TypeError | `jQuery(...).scroll is not a function` | jQuery missing |
| 4 | TypeError | `a.extend is not a function` | jQuery missing (Swiper) |
| 5 | TypeError | `u.each is not a function` | jQuery missing (Slick) |
| 6 | TypeError | `e.each is not a function` | jQuery missing (Magnific) |
| 7 | TypeError | `p.jQuery.extend is not a function` | jQuery missing (Divi Areas) |
| 8 | TypeError | `A.fn.extend is not a function` | jQuery missing (custom-scripts) |
| 9 | TypeError | `Cannot read properties of undefined (reading 'fn')` | jQuery missing (jQuery Effects) |
| 10 | TypeError | `$(...).slick is not a function` | jQuery + Slick both failed |
| 11 | TypeError | `Cannot read properties of undefined (reading 'extend')` | jQuery missing (Brain Carousel) |
| 12 | TypeError | `Cannot read properties of undefined (reading 'fn')` | jQuery missing (Brain Conkit) |
| 13 | ReferenceError | `gforms_recaptcha_recaptcha_strings is not defined` | Missing WordPress-provided global |
| 14 | 404 | `GET /cdn-cgi/challenge-platform/scripts/jsd/main.js` → 404 | Cloudflare IIFE still present |
| 15 | 404 | `GET /cdn-cgi/challenge-platform/scripts/jsd/main.js` → 404 | Cloudflare IIFE (duplicate) |
| 16 | 404 | `GET /wp-content/plugins/wow-divi-carousel/assets/imgs/loading.png` → 404 | Asset not downloaded |
| 17 | 404 | `GET /wp-includes/js/jquery/jquery.min.js?ver=3.7.1` → 404 | jQuery (duplicate request) |

### Warnings (2)

| # | Type | Message | Severity |
|---|------|---------|----------|
| 1 | Warning | `JQMIGRATE: Migrate is installed, version 3.4.1` | Benign (jQuery Migrate info) |
| 2 | Warning | `[LiteSpeed] Start Lazy Load` | Benign (LiteSpeed lazy load init) |

---

## After Fixes — Homepage Console Output

**0 errors, 2 warnings:**

| # | Type | Message | Severity |
|---|------|---------|----------|
| 1 | Warning | `JQMIGRATE: Migrate is installed, version 3.4.1` | Benign |
| 2 | Warning | `[LiteSpeed] Start Lazy Load` | Benign |

---

## After Fixes — Network Requests (Homepage)

**93 requests, all HTTP 200 OK. Zero 404s.**

Previously failing requests now resolved:

| Request | Before | After |
|---------|--------|-------|
| `/wp-includes/js/jquery/jquery.min.js?ver=3.7.1` | 404 | N/A (rewritten to `/assets/js/jquery.min.js` → 200) |
| `/cdn-cgi/challenge-platform/scripts/jsd/main.js` | 404 | N/A (Cloudflare IIFE removed) |
| `/wp-content/plugins/wow-divi-carousel/assets/imgs/loading.png` | 404 | 200 (file downloaded) |

---

## Per-Page Verification Results

| Page | Errors Before | Errors After | Network 404s |
|------|:------------:|:------------:|:------------:|
| `/` (Homepage) | 17 | 0 | 0 |
| `/about-us/` | ~17 | 0 | 0 |
| `/contact-us/` | ~17 | 0 | 0 |
| `/careers/` | ~18 (+1 SVG 404) | 0 | 0 |
| `/portfolio/` | ~17 | 0 | 0 |
| `/project/stallion-compare/` | ~17+ | 0 | 0 |
| `/hvac-website-design-checklist-*` | ~17 | 0 | 0 |

---

## JavaScript Dependency Chain (Verified Working)

The site's JavaScript loads in this order. All scripts now execute without errors:

```
1. jquery.min.js          ← ROOT: must load first (was 404, now fixed)
2. jquery-migrate.js      ← Depends on jQuery
3. dap-ie.js              ← Divi Areas Pro (depends on jQuery)
4. swiper.js              ← Carousel library (depends on jQuery)
5. gform-json.js          ← Gravity Forms JSON (depends on jQuery)
6. gform-gravityforms.js  ← Gravity Forms core (depends on jQuery)
7. gform-utils.js         ← Gravity Forms utils (depends on jQuery)
8. jquery-mask-form.js    ← jQuery plugin (depends on jQuery)
9. masks-form-fields.js   ← Form masks (depends on jQuery + jquery-mask)
10. react.js              ← React (standalone)
11. react-dom.js           ← React DOM (depends on React)
12. dcp-frontend.js        ← Divi Carousel Pro (depends on jQuery + Swiper)
13. dcp-frontend-lite.js   ← Divi Carousel Lite (depends on jQuery)
14. wdc-slick.js           ← Wow Divi Carousel (depends on jQuery)
15. brcr-slick.js          ← Brain Carousel Slick (depends on jQuery)
16. brcr-magnific.js       ← Brain Carousel Magnific (depends on jQuery)
17. bck-public.js          ← Brain Conkit (depends on jQuery)
18. js-divi-area.js        ← Divi Areas Pro (depends on jQuery)
19. custom-scripts.js      ← Theme scripts (depends on jQuery)
20. jquery-effects-core.js ← jQuery UI Effects (depends on jQuery)
21. divi-custom-script.js  ← Divi theme (depends on jQuery + jQuery UI)
22. dflip-script.js        ← DFlip page flip (depends on jQuery)
23. fitvids.js             ← FitVids (depends on jQuery)
24. brain-carousel.js      ← Brain Carousel init (depends on jQuery)
25. brain-conkit.js        ← Brain Conkit init (depends on jQuery)
26. brainblog.js           ← Brain Blog (depends on jQuery)
27. [recaptcha shim]       ← Inline: defines gforms_recaptcha_recaptcha_strings
28. gform-recaptcha-frontend.js ← reCAPTCHA frontend (depends on shim)
29. loftloader.js          ← Page preloader (depends on jQuery)
30-36. wp-dom-ready, wp-hooks, wp-i18n, wp-a11y ← WordPress core JS
37-40. gform-masked-input, gform-placeholder, gform-theme-vendors, gform-theme
41. et-core-common.js      ← Elegant Themes core
42. smush-lazy-load.js     ← Image lazy loading
43. wp-consent-api.js      ← Consent API (no-op shim)
44. akismet-frontend.js    ← Akismet spam detection
```

---

## Restored Functionality

| Component | Library | Before | After |
|-----------|---------|--------|-------|
| Hero carousel | Swiper | Broken (no jQuery) | Working — slides visible, groups functional |
| Project carousels | Slick / Brain Carousel | Broken | Working — prev/next buttons, slide transitions |
| Article carousel | Swiper | Broken | Working — 12 slides, navigation buttons |
| Menu popup | Divi Areas Pro | Broken | Working — opens/closes, links navigate |
| Contact form | Gravity Forms | Broken | Working — all fields render, validation present |
| Careers form | Gravity Forms | Broken | Working — file upload field present |
| FAQ accordions | Divi toggle | Broken | Working — click to expand/collapse |
| Page preloader | LoftLoader | Partially working | Fully working — smooth fade animation |
| Image lazy loading | LiteSpeed/Smush | Broken | Working — images lazy-load on scroll |
| Lightbox/gallery | Magnific Popup | Broken | Working — project gallery images |

---

## Remaining Benign Warnings

These 2 warnings appear on every page and are expected/harmless:

1. **`JQMIGRATE: Migrate is installed, version 3.4.1`** — jQuery Migrate announces itself. This is informational, not an error. jQuery Migrate provides backward compatibility for deprecated jQuery APIs used by WordPress plugins.

2. **`[LiteSpeed] Start Lazy Load`** — The Smush lazy load library (LiteSpeed-compatible) logs when it initializes. This confirms lazy loading is active.

---

## External Runtime Dependencies

**Zero.** After fixes, no page makes any network request to an external domain during load. All assets are served from `localhost:3000`. The only external references are `<a href>` links to social media profiles (LinkedIn, Instagram, Facebook), which are not runtime asset requests.
