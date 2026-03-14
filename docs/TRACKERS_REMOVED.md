# Trackers Removed

Complete log of all tracking, analytics, and surveillance scripts removed from the cylio.io offline mirror.

---

## Summary

All trackers have been removed from every HTML page and replaced with no-op JavaScript shims where necessary to prevent console errors from dependent code. No tracking data leaves the local machine.

**No-op shims injected:**
- `window.gtag = function() {}` -- prevents Google Analytics calls
- `window.dataLayer = []` -- prevents GTM push errors
- `window.clarity = function() {}` -- prevents Clarity calls
- `window.grecaptcha = { ready: function(cb) { cb(); }, execute: function() { return Promise.resolve('offline'); } }` -- prevents reCAPTCHA errors in Gravity Forms

---

## Tracker Details

| Tracker | ID(s) / Config | Domain(s) Blocked | Where Found | Why Removed | Replacement |
|---------|----------------|-------------------|-------------|-------------|-------------|
| **Google Analytics 4** | G-5K108LMY97 | `www.googletagmanager.com/gtag/js`, `www.google-analytics.com` | All pages (inline `<script>` in `<head>`) | User tracking, page view collection, audience profiling | No-op `window.gtag` shim |
| **Google Analytics 4** | G-66H8EQEXKZ | `www.googletagmanager.com/gtag/js` | All pages (secondary GA4 property) | Duplicate analytics tracking | No-op `window.gtag` shim |
| **Google Analytics 4** | G-626DZ7MW8S | `www.googletagmanager.com/gtag/js` | All pages (third GA4 property) | Triplicate analytics tracking | No-op `window.gtag` shim |
| **Google Tag Manager** | GTM-TT8CM27K | `www.googletagmanager.com/gtm.js` | All pages (`<head>` script + `<noscript>` iframe) | Tag injection container, loads additional trackers dynamically | No-op `window.dataLayer` shim; `<noscript>` iframe removed |
| **Google Tag Manager** | GTM-KPDCZ7M | `www.googletagmanager.com/gtm.js` | All pages (second GTM container) | Second tag injection container | No-op `window.dataLayer` shim; `<noscript>` iframe removed |
| **Microsoft Clarity** | nd4z3gxhwv | `www.clarity.ms/tag/`, `www.clarity.ms/eus2-b/collect` | All pages (inline `<script>` in `<head>`) | Session recording, heatmaps, user behavior tracking | No-op `window.clarity` shim |
| **Bing Tracking Pixel** | (via Clarity) | `c.bing.com/c.gif` | Loaded by Clarity script | Cross-platform ad tracking | Removed with Clarity |
| **AdTracks Call Tracking** | -- | `call.adtracks.com` | Contact page, homepage | Phone call tracking and attribution | Removed entirely; phone numbers remain as plain links |
| **Google reCAPTCHA v3** | Site key embedded | `www.google.com/recaptcha/`, `www.gstatic.com/recaptcha/` | Contact page, careers page (Gravity Forms) | Invisible user scoring, Google tracking cookie, visual badge | No-op `window.grecaptcha` shim; badge CSS removed |
| **Cloudflare Challenge** | -- | `challenges.cloudflare.com` | All pages (bot detection script) | Bot fingerprinting, Cloudflare telemetry | Removed entirely |
| **Google Site Kit Consent** | -- | (inline script) | All pages (`googlesitekit-consent.js`) | Consent framework for Google tracking services | Replaced with no-op local file (`assets/js/googlesitekit-consent.js`) |
| **Speculation Rules API** | -- | (inline `<script type="speculationrules">`) | All pages | Prefetch/prerender rules that trigger external requests | Removed entirely |

---

## Removal Method

### Phase 1: Script Tag Removal

All `<script>` tags with `src` attributes pointing to tracking domains were removed from every HTML file:

```
www.googletagmanager.com/*
www.google-analytics.com/*
www.clarity.ms/*
www.google.com/recaptcha/*
www.gstatic.com/recaptcha/*
challenges.cloudflare.com/*
call.adtracks.com/*
```

### Phase 2: Inline Script Removal

Inline `<script>` blocks containing tracking initialization code were identified by pattern matching and removed:

- GTM container snippets (`(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-...')`)
- GA4 config calls (`gtag('config', 'G-...')`)
- Clarity initialization (`(function(c,l,a,r,i,t,y){...})`)
- Speculation rules JSON blocks

### Phase 3: Noscript Fallback Removal

GTM `<noscript>` iframe fallbacks were removed from all pages:

```html
<!-- REMOVED -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-..."
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

### Phase 4: No-Op Shim Injection

A single shim block was added to each page to prevent JavaScript errors from code that references tracking globals:

```javascript
/* Tracker shims — prevent errors from removed analytics */
window.gtag = function() {};
window.dataLayer = window.dataLayer || [];
window.clarity = function() {};
window.grecaptcha = {
  ready: function(cb) { if (typeof cb === 'function') cb(); },
  execute: function() { return Promise.resolve('offline'); }
};
```

### Phase 5: CSS Cleanup

The reCAPTCHA badge CSS (`.grecaptcha-badge`) was set to `display: none` to remove the floating badge from the bottom-right corner.

---

## Verification

Run the external request audit to confirm zero outbound tracking calls:

```bash
npm run audit
```

This script scans every HTML file for remaining references to external tracking domains and reports any findings.
