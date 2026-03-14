# Asset Audit — Cylio Offline Mirror

**Date**: 2026-03-11
**Scope**: Complete inventory of all assets, their status, and any fixes applied.

---

## Asset Summary

| Category | Total Files | Status |
|----------|------------|--------|
| JavaScript (.js) | 41 | All serving 200 |
| CSS (.css) | 101+ | All serving 200 |
| Images (.webp, .jpg, .png, .svg, .gif) | ~900+ | All serving 200 |
| Fonts (.woff2, .woff, .otf, .ttf, .eot) | 21+ local + 15 plugin | All serving 200 |
| LiteSpeed CSS bundles | 2 | Downloaded & serving 200 |
| LiteSpeed JS bundles | 4 | Downloaded & serving 200 |

---

## Previously Localized Assets (from original archival)

### JavaScript — `/assets/js/` (41 files)

All rewritten from various WordPress plugin/theme paths to flat `/assets/js/` structure:

| File | Original Source | Status |
|------|----------------|--------|
| `jquery.min.js` | `/wp-includes/js/jquery/jquery.min.js` | **Fixed** (path rewritten in HTML) |
| `jquery-migrate.js` | `/wp-includes/js/jquery/jquery-migrate.min.js` | OK |
| `dap-ie.js` | Divi Areas Pro | OK |
| `swiper.js` | Swiper carousel library | OK |
| `gform-json.js` | Gravity Forms | OK |
| `gform-gravityforms.js` | Gravity Forms core | OK |
| `gform-utils.js` | Gravity Forms utilities | OK |
| `jquery-mask-form.js` | jQuery Masked Input | OK |
| `masks-form-fields.js` | Form field masks | OK |
| `react.js` | React 18 production | OK |
| `react-dom.js` | React DOM production | OK |
| `dcp-frontend.js` | Divi Carousel Pro | OK |
| `dcp-frontend-lite.js` | Divi Carousel Pro Lite | OK |
| `wdc-slick.js` | Wow Divi Carousel Slick | OK |
| `brcr-slick.js` | Brain Carousel Slick | OK |
| `brcr-magnific.js` | Brain Carousel Magnific Popup | OK |
| `bck-public.js` | Brain Conkit Public | OK |
| `js-divi-area.js` | Divi Areas Pro | OK |
| `custom-scripts.js` | Theme custom scripts | OK |
| `jquery-effects-core.js` | jQuery UI Effects | OK |
| `divi-custom-script.js` | Divi theme scripts | OK |
| `dflip-script.js` | DFlip (page flip) | OK |
| `fitvids.js` | FitVids responsive video | OK |
| `brain-carousel.js` | Brain Carousel init | OK |
| `brain-conkit.js` | Brain Construction Kit | OK |
| `brainblog.js` | Brain Blog module | OK |
| `gform-recaptcha-frontend.js` | Gravity Forms reCAPTCHA | OK (shim added) |
| `loftloader.js` | LoftLoader page preloader | OK |
| `wp-dom-ready.js` | WordPress DOM Ready | OK |
| `wp-hooks.js` | WordPress Hooks API | OK |
| `wp-i18n.js` | WordPress i18n | OK |
| `wp-a11y.js` | WordPress Accessibility | OK |
| `gform-masked-input.js` | Gravity Forms masks | OK |
| `gform-placeholder.js` | Gravity Forms placeholders | OK |
| `gform-theme-vendors.js` | Gravity Forms theme vendors | OK |
| `gform-theme.js` | Gravity Forms theme | OK |
| `et-core-common.js` | Elegant Themes core | OK |
| `smush-lazy-load.js` | Smush lazy load (LiteSpeed compat) | OK |
| `wp-consent-api.js` | WP Consent API (no-op shim) | OK |
| `akismet-frontend.js` | Akismet spam filter frontend | OK |

### CSS — `/assets/css/` (101+ files)

| Key Files | Status |
|-----------|--------|
| `main.css` | OK — primary stylesheet |
| `228109-et-divi-dynamic-tb-*.css` | OK — Divi dynamic CSS (per-page) |
| Various plugin CSS files | OK |

### Fonts — `/assets/fonts/` (21 files)

| File | Type | Status |
|------|------|--------|
| `PlayfairDisplay-Regular.woff2` | Google Fonts (self-hosted) | OK |
| `PlayfairDisplay-Italic-400.woff2` | Google Fonts (self-hosted) | OK |
| `PlayfairDisplay-Italic-500.woff2` | Google Fonts (self-hosted) | OK |
| `PlayfairDisplay-Regular-latin.woff2` | Google Fonts (self-hosted) | OK |
| `MetroSans-Book.otf` | Custom font | OK |
| `MetroSans-Regular.otf` | Custom font | OK |
| `MetroSans-Bold.otf` | Custom font | OK |
| `metro-sans-medium.otf` | Custom font | OK |
| `modules.woff` | Divi icon font | OK |
| + 12 more font files | Various | OK |

### Images — `/assets/img/` (~900+ files)

Organized by year/month subdirectories (e.g., `2023/05/`, `2024/06/`). All verified serving 200.

---

## Newly Downloaded Assets (this fix session)

### Plugin Assets — `/wp-content/plugins/`

| Path | Type | Size | Why Missing |
|------|------|------|-------------|
| `wow-divi-carousel/assets/imgs/loading.png` | PNG spinner | 294B | CSS url() reference not followed during archival |
| `wow-divi-carousel/assets/fonts/icowdc.eot` | Icon font | 3.8KB | CSS @font-face reference |
| `wow-divi-carousel/assets/fonts/icowdc.ttf` | Icon font | 3.6KB | CSS @font-face reference |
| `wow-divi-carousel/assets/fonts/icowdc.woff` | Icon font | 3.7KB | CSS @font-face reference |
| `wow-divi-carousel/assets/fonts/icowdc.svg` | Icon font | 9.5KB | CSS @font-face reference |
| `brain-carousel/public/fonts/icobrain.ttf` | Icon font | 4.2KB | CSS @font-face reference |
| `brain-carousel/public/fonts/icobrain.woff` | Icon font | 4.3KB | CSS @font-face reference |
| `brain-carousel/public/fonts/icobrain.svg` | Icon font | 11KB | CSS @font-face reference |
| `brain-conkit/public/fonts/icobrain.ttf` | Icon font | 4.2KB | CSS @font-face reference |
| `brain-conkit/public/fonts/icobrain.woff` | Icon font | 4.3KB | CSS @font-face reference |
| `brain-conkit/public/fonts/icobrain.svg` | Icon font | 11KB | CSS @font-face reference |
| `brain-conkit/public/imgs/transparent.jpg` | Placeholder | 1.1KB | CSS/JS reference |
| `popups-for-divi/images/spin.gif` | Popup spinner | 43KB | CSS reference |
| `gravityforms/fonts/gform-icons-theme.woff2` | Form icons | 2.8KB | CSS @font-face reference |
| `gravityforms/fonts/gform-icons-theme.ttf` | Form icons | 5.7KB | CSS @font-face reference |
| `gravityforms/fonts/gform-icons-theme.woff` | Form icons | 3.0KB | CSS @font-face reference |
| `gravityforms/fonts/gform-icons-theme.svg` | Form icons | 15KB | CSS @font-face reference |
| `gravityforms/legacy/css/chosen-sprite.png` | Dropdown sprite | 944B | CSS background-image |
| `gravityforms/legacy/css/chosen-sprite@2x.png` | Retina sprite | 1.6KB | CSS background-image |
| `gravityforms/images/gf-creditcards.svg` | Card icons | 6.4KB | CSS reference |
| `gravityforms/images/gf-creditcards-check.svg` | Card check | 1.9KB | CSS reference |
| `gravityforms/images/list-add.svg` | List add button | 214B | CSS reference |
| `gravityforms/images/list-remove.svg` | List remove button | 217B | CSS reference |
| `gravityforms/images/theme/down-arrow.svg` | Dropdown arrow | 263B | CSS reference |

### Theme Assets — `/wp-content/themes/`

| Path | Type | Size | Why Missing |
|------|------|------|-------------|
| `divi-child/quote.svg` | Quote icon | 955B | CSS url() reference |

### Upload Assets — `/wp-content/uploads/`

| Path | Type | Size | Why Missing |
|------|------|------|-------------|
| `2025/06/angle-right.svg` | Arrow icon | 444B | CSS/HTML reference on careers page |

### LiteSpeed Cache Bundles — `/wp-content/litespeed/`

| Path | Type | Size | Why Missing |
|------|------|------|-------------|
| `css/8653c902c46cb41097d05af715ef1428.css` | Combined CSS | 464KB | LiteSpeed combined bundle |
| `css/7b2a8df06a14ba5f631d44a949d0dbb4.css` | Combined CSS | 523KB | LiteSpeed combined bundle |
| `js/aac645ec0f3c536fc5feb2b044941f03.js` | Combined JS | 5.6KB | LiteSpeed combined bundle |
| `js/c8cd6f733b3b40fcb1d667f809f01807.js` | Combined JS | 3.0KB | LiteSpeed combined bundle |
| `js/deff57b1a4142bf4826b177e4385f254.js` | Combined JS | 141B | LiteSpeed combined bundle |
| `js/fc98740a436a49b8a720406087a594c8.js` | Combined JS | 22.5KB | LiteSpeed combined bundle |

### Divi `et-cache` Late-Loaded CSS — `/wp-content/et-cache/`

49 per-page Divi dynamic CSS files, each in its own numbered subdirectory. These were referenced via absolute URLs to `cylio.io` — downloaded locally and URLs rewritten to relative paths.

| Count | Type | Total Size | Why Missing |
|-------|------|------------|-------------|
| 49 files | Per-page Divi CSS | ~79KB total | Absolute URLs in inline JS pointed to live site |

Example paths: `et-cache/3/et-divi-dynamic-*-late.css`, `et-cache/229136/et-divi-dynamic-*-late.css`, etc.

---

## Removed/Shimmed Trackers (from original archival, verified intact)

| Tracker | Action | File |
|---------|--------|------|
| Google Analytics (gtag.js) | Removed | N/A |
| Google Tag Manager | Removed | N/A |
| Google Site Kit | Replaced with no-op | `googlesitekit-consent.js` |
| Google reCAPTCHA v3 | Removed + shim added | `gform-recaptcha-frontend.js` |
| Google Fonts API (remote) | Self-hosted | `/assets/fonts/` |
| Facebook Pixel | Removed | N/A |
| Cloudflare challenge | Removed from all HTML | 50 files |
| WP Consent API | Replaced with no-op | `wp-consent-api.js` |
| Speculation Rules API | Removed | N/A |

---

## Asset Integrity Verification

All 32 newly downloaded assets were verified using the `file` command to ensure they are genuine files (not Cloudflare challenge HTML pages):

- SVG files: `SVG Scalable Vector Graphics image`
- PNG files: `PNG image data`
- JPG files: `JPEG image data`
- GIF files: `GIF image data`
- Font files: `TrueType font data` / `Web Open Font Format`
- CSS files: `ASCII text` / `UTF-8 Unicode text`
- JS files: `ASCII text` / `UTF-8 Unicode text`

No Cloudflare interception detected on any downloaded asset.
