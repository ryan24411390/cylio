# Offline Audit

Complete audit of every external dependency found in the cylio.io source and its disposition in the offline mirror.

---

## Summary

| Category | Count | Status |
|----------|-------|--------|
| JavaScript files | 41 | All self-hosted |
| CSS files | 101 | All self-hosted (1 main + 100 per-page Divi cache) |
| Images | ~895 | All downloaded and self-hosted |
| Font files | 21 | All downloaded and self-hosted |
| Trackers | 9 services | Removed (no-op shims where needed) |

---

## JavaScript Libraries (41 files self-hosted)

All JavaScript files have been downloaded to `assets/js/` and all HTML `<script>` tags rewritten to use local paths.

| # | File | Original Source | Purpose | Status |
|---|------|----------------|---------|--------|
| 1 | `jquery.min.js` | WordPress core (jQuery 3.7.1) | DOM manipulation, plugin dependency | Downloaded, self-hosted |
| 2 | `jquery-migrate.js` | LiteSpeed Cache bundle | jQuery backward compatibility | Downloaded, self-hosted |
| 3 | `jquery-effects-core.js` | WordPress core | jQuery UI effects | Downloaded, self-hosted |
| 4 | `swiper.js` | Swiper CDN / wp-content | Touch slider/carousel library | Downloaded, self-hosted |
| 5 | `brcr-slick.js` | wp-content/plugins | Slick carousel (BRCR wrapper) | Downloaded, self-hosted |
| 6 | `wdc-slick.js` | wp-content/plugins | Slick carousel (WDC wrapper) | Downloaded, self-hosted |
| 7 | `brcr-magnific.js` | wp-content/plugins | Magnific Popup lightbox | Downloaded, self-hosted |
| 8 | `react.js` | WordPress core (React 18) | React library | Downloaded, self-hosted |
| 9 | `react-dom.js` | WordPress core (ReactDOM 18) | React DOM renderer | Downloaded, self-hosted |
| 10 | `gform-gravityforms.js` | Gravity Forms plugin | Form engine core | Downloaded, self-hosted |
| 11 | `gform-json.js` | Gravity Forms plugin | JSON handling for forms | Downloaded, self-hosted |
| 12 | `gform-masked-input.js` | Gravity Forms plugin | Input masking (phone, etc.) | Downloaded, self-hosted |
| 13 | `gform-placeholder.js` | Gravity Forms plugin | Placeholder polyfill | Downloaded, self-hosted |
| 14 | `gform-theme.js` | Gravity Forms plugin | Form theming/styling | Downloaded, self-hosted |
| 15 | `gform-theme-vendors.js` | Gravity Forms plugin | Form theme vendor deps | Downloaded, self-hosted |
| 16 | `gform-utils.js` | Gravity Forms plugin | Form utility functions | Downloaded, self-hosted |
| 17 | `gform-recaptcha-frontend.js` | Gravity Forms plugin | reCAPTCHA integration (shimmed) | Downloaded, self-hosted (uses no-op shim) |
| 18 | `divi-custom-script.js` | Divi theme | Divi framework core JS | Downloaded, self-hosted |
| 19 | `et-core-common.js` | Elegant Themes core | ET framework common utilities | Downloaded, self-hosted |
| 20 | `custom-scripts.js` | Theme customizations | Site-specific custom JavaScript | Downloaded, self-hosted |
| 21 | `loftloader.js` | LoftLoader plugin | Page loading animation | Downloaded, self-hosted |
| 22 | `brain-carousel.js` | Brain Carousel plugin | Custom carousel widget | Downloaded, self-hosted |
| 23 | `brain-conkit.js` | Brain ConKit plugin | Conditional content toolkit | Downloaded, self-hosted |
| 24 | `brainblog.js` | Brain Blog plugin | Blog functionality | Downloaded, self-hosted |
| 25 | `fitvids.js` | FitVids.js library | Responsive video embeds | Downloaded, self-hosted |
| 26 | `smush-lazy-load.js` | Smush plugin | Image lazy loading | Downloaded, self-hosted |
| 27 | `dflip-script.js` | DFlip plugin | PDF/flipbook viewer | Downloaded, self-hosted |
| 28 | `js-divi-area.js` | Divi Areas Pro plugin | Popup/modal areas | Downloaded, self-hosted |
| 29 | `dcp-frontend.js` | Divi Custom Plugins | Frontend plugin logic | Downloaded, self-hosted |
| 30 | `dcp-frontend-lite.js` | Divi Custom Plugins | Frontend plugin (lite) | Downloaded, self-hosted |
| 31 | `bck-public.js` | BCK plugin | Public-facing functionality | Downloaded, self-hosted |
| 32 | `dap-ie.js` | Divi Areas Pro | IE compatibility layer | Downloaded, self-hosted |
| 33 | `akismet-frontend.js` | Akismet plugin | Spam filtering (form integration) | Downloaded, self-hosted |
| 34 | `masks-form-fields.js` | Custom | Form field masking | Downloaded, self-hosted |
| 35 | `jquery-mask-form.js` | jQuery Mask Plugin | Input mask library | Downloaded, self-hosted |
| 36 | `wp-a11y.js` | WordPress core | Accessibility announcements | Downloaded, self-hosted |
| 37 | `wp-consent-api.js` | WordPress core | Consent API framework | Downloaded, self-hosted |
| 38 | `wp-dom-ready.js` | WordPress core | DOM ready utility | Downloaded, self-hosted |
| 39 | `wp-hooks.js` | WordPress core | Hooks/filters system | Downloaded, self-hosted |
| 40 | `wp-i18n.js` | WordPress core | Internationalization | Downloaded, self-hosted |
| 41 | `googlesitekit-consent.js` | Google Site Kit | Consent module (no-op replacement) | Replaced with no-op local file |

---

## CSS Stylesheets (101 files self-hosted)

All CSS files have been downloaded to `assets/css/` and all HTML `<link>` tags rewritten to use local paths.

| Type | Count | Description |
|------|-------|-------------|
| Main stylesheet | 1 | Combined/minified site-wide CSS |
| Divi per-page dynamic CSS | 100 | Divi Builder generates unique CSS per page (50 pages x 2 files each: base + late-load) |

The Divi CSS files follow the naming convention:
```
{pageId}-et-divi-dynamic-tb-{themeBuilderIds}-{pageId}.css
{pageId}-et-divi-dynamic-tb-{themeBuilderIds}-{pageId}-late.css
```

---

## Fonts (21 files self-hosted)

All font files downloaded to `assets/fonts/` with `@font-face` rules rewritten to local paths.

### Google Fonts -- Playfair Display

| File | Format | Weight | Style |
|------|--------|--------|-------|
| `PlayfairDisplay-Regular-400.ttf` | TTF | 400 | Normal |
| `PlayfairDisplay-Regular-500.ttf` | TTF | 500 | Normal |
| `PlayfairDisplay-Regular-600.ttf` | TTF | 600 | Normal |
| `PlayfairDisplay-Regular-700.ttf` | TTF | 700 | Normal |
| `PlayfairDisplay-Regular-800.ttf` | TTF | 800 | Normal |
| `PlayfairDisplay-Regular-900.ttf` | TTF | 900 | Normal |
| `PlayfairDisplay-Regular-latin.woff2` | WOFF2 | Variable | Normal |
| `PlayfairDisplay-Regular.woff2` | WOFF2 | Variable | Normal |
| `PlayfairDisplay-Italic-400.ttf` | TTF | 400 | Italic |
| `PlayfairDisplay-Italic-400.woff2` | WOFF2 | 400 | Italic |
| `PlayfairDisplay-Italic-500.ttf` | TTF | 500 | Italic |
| `PlayfairDisplay-Italic-500.woff2` | WOFF2 | 500 | Italic |
| `PlayfairDisplay-Italic-600.ttf` | TTF | 600 | Italic |
| `PlayfairDisplay-Italic-700.ttf` | TTF | 700 | Italic |
| `PlayfairDisplay-Italic-800.ttf` | TTF | 800 | Italic |
| `PlayfairDisplay-Italic-900.ttf` | TTF | 900 | Italic |

### Custom Fonts -- Metro Sans

| File | Format | Weight | Style |
|------|--------|--------|-------|
| `MetroSans-Book.otf` | OTF | Book (300) | Normal |
| `MetroSans-Regular.otf` | OTF | Regular (400) | Normal |
| `metro-sans-medium.otf` | OTF | Medium (500) | Normal |
| `MetroSans-Bold.otf` | OTF | Bold (700) | Normal |

### Divi Icon Font

| File | Format | Purpose |
|------|--------|---------|
| `modules.woff` | WOFF | Divi Builder module icons (arrows, social, UI) |

---

## Images (~895 files self-hosted)

All images downloaded to `assets/img/` with `src`, `srcset`, `data-src`, and CSS `background-image` references rewritten to local paths.

| Format | Typical Use |
|--------|-------------|
| `.webp` | Primary format for portfolio images, hero backgrounds |
| `.png` | Logos, UI elements, transparency-required images |
| `.jpg` / `.jpeg` | Blog post images, photography |
| `.svg` | Icons, logos, decorative elements |
| `.gif` | Animated elements |

Image sources that were rewritten:
- `cylio.io/wp-content/uploads/` -- WordPress media library
- `cylio.io/wp-content/et-cache/` -- Divi optimized images
- `cylio.io/wp-content/themes/` -- Theme assets
- `cylio.io/wp-content/plugins/` -- Plugin assets

---

## Trackers (Removed, NOT Localized)

These external services were removed entirely rather than self-hosted, because they serve no purpose in an offline mirror.

| Service | Action |
|---------|--------|
| Google Analytics (G-5K108LMY97, G-66H8EQEXKZ, G-626DZ7MW8S) | Removed, no-op `window.gtag` shim |
| Google Tag Manager (GTM-TT8CM27K, GTM-KPDCZ7M) | Removed, no-op `window.dataLayer` shim |
| Microsoft Clarity (nd4z3gxhwv) | Removed, no-op `window.clarity` shim |
| AdTracks Call Tracking | Removed entirely |
| Google reCAPTCHA v3 | Removed, no-op `window.grecaptcha` shim |
| Cloudflare Challenge | Removed entirely |
| Google Site Kit Consent | Replaced with no-op local file |
| Speculation Rules API | Removed entirely |
| Bing Tracking Pixel (via Clarity) | Removed with Clarity |

See `TRACKERS_REMOVED.md` for detailed removal documentation.

---

## Verification

To verify that the mirror makes zero external requests, run:

```bash
npm run audit
```

This scans all HTML files for any remaining references to external domains and reports findings. The expected result is zero external tracking requests, with only intentional external links (social media profiles, client websites) remaining as `<a href>` navigation links.
