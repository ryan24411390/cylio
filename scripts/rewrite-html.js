#!/usr/bin/env node
/**
 * rewrite-html.js
 * Rewrites all HTML files in the offline site to:
 * 1. Replace remote asset URLs with local paths
 * 2. Remove tracker/analytics scripts
 * 3. Add no-op shims
 * 4. Fix internal navigation links
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Find all HTML files recursively
function findHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', '.git', 'assets', 'docs', 'tests', 'scripts', '.playwright-mcp'].includes(entry.name)) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

// Build the et-cache CSS mapping: original URL path -> local filename
function buildEtCacheMap() {
  const cssDir = path.join(ROOT, 'assets', 'css');
  const files = fs.readdirSync(cssDir).filter(f => f.startsWith('et-') || f.match(/^\d/));
  const map = {};
  // Files are named like: 228109-et-divi-dynamic-tb-227427-tb-227114-228109.css
  // Original URL: /wp-content/et-cache/228109/et-divi-dynamic-tb-227427-tb-227114-228109.css?ver=xxx
  return map; // We'll use regex replacement instead
}

// JS file mapping: original URL -> local filename
const jsMap = {
  'wp-includes/js/jquery/jquery.min.js': 'jquery.min.js',
  'litespeed/js/8fbed8ed231964a5e73772b3721ca69a.js': 'jquery-migrate.js',
  'litespeed/js/948a88097710f458caba48167df43843.js': 'dap-ie.js',
  'litespeed/js/80df827c713fc1658191261a8639ed60.js': 'swiper.js',
  'plugins/gravityforms/js/jquery.json.min.js': 'gform-json.js',
  'litespeed/js/ab923702074301093edfb778f185bcca.js': 'gform-gravityforms.js',
  'litespeed/js/237a8b5307a8f75aa84777f4e8d95d59.js': 'gform-utils.js',
  'litespeed/js/b785f9848985de5d05f80bfdf15ba9eb.js': 'jquery-mask-form.js',
  'litespeed/js/7ab22843df81a280041d89645f2dfde7.js': 'masks-form-fields.js',
  'litespeed/js/a8fbc8bb8d2d698d488d481742b1ebb0.js': 'react.js',
  'litespeed/js/0e0083c3fa47133f1de3bc8e5fa5b7b9.js': 'react-dom.js',
  'litespeed/js/4a87a9b19024e2852e0a08448bb4c225.js': 'dcp-frontend.js',
  'litespeed/js/427fcc9cc810754d11d3ded00b152b55.js': 'dcp-frontend-lite.js',
  'litespeed/js/053bc24b9869326a5df35dc0e71cb00d.js': 'wdc-slick.js',
  'litespeed/js/83715860e405a4cb69ab8e0b41464014.js': 'brcr-slick.js',
  'litespeed/js/0ee8a02b326b1122ae99090b050be8dd.js': 'brcr-magnific.js',
  'litespeed/js/b6a561945c236b01047eddd7bc7b2369.js': 'bck-public.js',
  'litespeed/js/52cc7d35daa1e5afb46a325288325d49.js': 'js-divi-area.js',
  'litespeed/js/9f66623b4b0e587240c078a7f47688d5.js': 'custom-scripts.js',
  'litespeed/js/0f489ae0b4027eb2b8532321a56e7d3b.js': 'jquery-effects-core.js',
  'litespeed/js/8bce997054b98a55ccdd5f54c52f1d7d.js': 'divi-custom-script.js',
  'litespeed/js/6b84caeb6be3e75af181e404fe8171f5.js': 'googlesitekit-consent.js',
  'litespeed/js/a142789a0f519791fe347515528f5610.js': 'dflip-script.js',
  'litespeed/js/66de33a2d446e56b1d2633f15e8f8f71.js': 'fitvids.js',
  'litespeed/js/9b76b86004108e2827d265514676c3c3.js': 'brain-carousel.js',
  'litespeed/js/0fa981357d638d57f37e8eef7f19d03d.js': 'brain-conkit.js',
  'litespeed/js/2088f29c190dc7e103d2e05ae0a37c1d.js': 'brainblog.js',
  'litespeed/js/5f5e34d0731bf0ccc7ad2ff4f89c807b.js': 'gform-recaptcha-frontend.js',
  'litespeed/js/a9eec6d0a9502a13469317610690e8ab.js': 'loftloader.js',
  'litespeed/js/ba8338d941bc187c6a9643905ef64afc.js': 'wp-dom-ready.js',
  'litespeed/js/e28ef6f8301ccffd7b1861bf4ce015f9.js': 'wp-hooks.js',
  'litespeed/js/1d2ed35dae6b7d22d230924ceb0d7ad2.js': 'wp-i18n.js',
  'litespeed/js/92eb431d5d093acc4d4b7b8cb77bef65.js': 'wp-a11y.js',
  'litespeed/js/6e1011196f7a38077fa7ebba5f767a7a.js': 'gform-masked-input.js',
  'plugins/gravityforms/js/placeholders.jquery.min.js': 'gform-placeholder.js',
  'litespeed/js/54893aabc5b80f98f39b74e6c213d65a.js': 'gform-theme-vendors.js',
  'litespeed/js/eefbec68b37592e3205020f9b085c6fb.js': 'gform-theme.js',
  'litespeed/js/c89b5c49856a4c886d4b68ee62c685ac.js': 'et-core-common.js',
  'litespeed/js/81c4d710c1785004041eb569d00ac4bf.js': 'smush-lazy-load.js',
  'litespeed/js/170f8484fd9ee4ba968a219a8ca095e5.js': 'wp-consent-api.js',
  'litespeed/js/463f376d87c15e5303bee9886058e9d7.js': 'akismet-frontend.js',
};

// Tracker patterns to completely remove (script tags)
const trackerScriptPatterns = [
  // Google Tag Manager
  /<!--\s*Google Tag Manager\s*-->[\s\S]*?<!--\s*End Google Tag Manager\s*-->/gi,
  /<!--\s*Google Tag Manager \(noscript\)\s*-->[\s\S]*?<!--\s*End Google Tag Manager \(noscript\)\s*-->/gi,
  // GTM script tags
  /<script[^>]*src="[^"]*googletagmanager\.com\/gtm\.js[^"]*"[^>]*><\/script>/gi,
  /<script[^>]*src="[^"]*googletagmanager\.com\/gtag\/js[^"]*"[^>]*><\/script>/gi,
  // Google Analytics
  /<script[^>]*src="[^"]*google-analytics\.com[^"]*"[^>]*><\/script>/gi,
  // Microsoft Clarity
  /<script[^>]*src="[^"]*clarity\.ms[^"]*"[^>]*><\/script>/gi,
  // AdTracks
  /<script[^>]*src="[^"]*call\.adtracks\.com[^"]*"[^>]*><\/script>/gi,
  // reCAPTCHA
  /<script[^>]*src="[^"]*google\.com\/recaptcha[^"]*"[^>]*><\/script>/gi,
  /<script[^>]*src="[^"]*gstatic\.com\/recaptcha[^"]*"[^>]*><\/script>/gi,
  /<script[^>]*id="gforms_recaptcha_recaptcha-js"[^>]*><\/script>/gi,
  // Cloudflare challenge
  /<script[^>]*src="[^"]*cdn-cgi\/challenge-platform[^"]*"[^>]*><\/script>/gi,
  // Google Site Kit consent mode inline
  /<script[^>]*id="google_gtagjs-js-consent-mode-data-layer"[^>]*>[\s\S]*?<\/script>/gi,
  /<script[^>]*id="google_gtagjs-js-after"[^>]*>[\s\S]*?<\/script>/gi,
  /<script[^>]*id="google_gtagjs-js"[^>]*>[^<]*<\/script>/gi,
  // Speculation rules
  /<script[^>]*type="speculationrules"[^>]*>[\s\S]*?<\/script>/gi,
  // reCAPTCHA extras
  /<script[^>]*id="gforms_recaptcha_recaptcha-js-extra"[^>]*>[\s\S]*?<\/script>/gi,
  // Googlesitekit consent js file
  /<script[^>]*id="googlesitekit-consent-mode-js"[^>]*>[^<]*<\/script>/gi,
];

// Inline tracker patterns (GTM/GA inline config blocks)
const inlineTrackerPatterns = [
  // GTM inline init
  /<!-- Google tag \(gtag\.js\) -->[\s\S]*?<\/script>/gi,
  // dataLayer push with GTM
  /<script[^>]*>\s*\(function\(w,d,s,l,i\)\{[\s\S]*?googletagmanager[\s\S]*?<\/script>/gi,
  // Inline gtag config
  /<script[^>]*>\s*window\.dataLayer\s*=\s*window\.dataLayer[\s\S]*?gtag\([^)]*\);\s*<\/script>/gi,
  // Clarity inline init
  /<script[^>]*>\s*\(function\(c,l,a,r,i,t,y\)\{[\s\S]*?clarity[\s\S]*?<\/script>/gi,
  // AdTracks inline
  /<script[^>]*>\s*var\s+adtracks[\s\S]*?<\/script>/gi,
  /<script[^>]*>\s*adtracks[\s\S]*?<\/script>/gi,
  // GTM noscript iframes
  /<noscript><iframe[^>]*src="[^"]*googletagmanager\.com[^"]*"[^>]*><\/iframe><\/noscript>/gi,
];

// DNS prefetch / preconnect to tracker domains
const trackerLinkPatterns = [
  /<link[^>]*href="[^"]*google\.com[^"]*"[^>]*rel="dns-prefetch"[^>]*\/?>/gi,
  /<link[^>]*rel="dns-prefetch"[^>]*href="[^"]*google\.com[^"]*"[^>]*\/?>/gi,
  /<link[^>]*href="[^"]*googletagmanager\.com[^"]*"[^>]*rel="dns-prefetch"[^>]*\/?>/gi,
  /<link[^>]*rel="dns-prefetch"[^>]*href="[^"]*googletagmanager\.com[^"]*"[^>]*\/?>/gi,
];

function rewriteHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf-8');
  const relPath = path.relative(ROOT, filePath);
  let changes = [];

  // --- 1. Remove tracker scripts ---
  for (const pattern of trackerScriptPatterns) {
    const before = html;
    html = html.replace(pattern, '');
    if (html !== before) changes.push(`Removed tracker matching: ${pattern.source.substring(0, 60)}...`);
  }
  for (const pattern of inlineTrackerPatterns) {
    const before = html;
    html = html.replace(pattern, '');
    if (html !== before) changes.push(`Removed inline tracker: ${pattern.source.substring(0, 60)}...`);
  }
  for (const pattern of trackerLinkPatterns) {
    const before = html;
    html = html.replace(pattern, '');
    if (html !== before) changes.push(`Removed tracker link: ${pattern.source.substring(0, 60)}...`);
  }

  // Remove remaining inline scripts that reference tracker domains
  // GTM dataLayer inline blocks
  html = html.replace(/<script[^>]*>\s*\/\*\s*<!\[CDATA\[\s*\*\/[\s\S]*?google_gtagjs[\s\S]*?<\/script>/gi, '');
  // Any remaining gtag() inline calls
  html = html.replace(/<script[^>]*>\s*function gtag\(\)[\s\S]*?<\/script>/gi, '');

  // --- 2. Rewrite JS references ---
  for (const [origPath, localName] of Object.entries(jsMap)) {
    // Match both full URL and relative path forms
    const escapedPath = origPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const patterns = [
      new RegExp(`https?://cylio\\.co/wp-content/${escapedPath}(\\?[^"'\\s]*)?`, 'g'),
    ];
    for (const pat of patterns) {
      const before = html;
      html = html.replace(pat, `/assets/js/${localName}`);
      if (html !== before) changes.push(`JS: ${origPath} -> /assets/js/${localName}`);
    }
  }

  // --- 3. Rewrite CSS references ---
  // Main LiteSpeed CSS bundle
  html = html.replace(
    /https?:\/\/cylio\.co\/wp-content\/litespeed\/css\/961c23782e693580c234e805a6e1a8fe\.css(\?[^"'\s]*)?/g,
    '/assets/css/main.css'
  );

  // et-cache CSS files: rewrite to local flattened names
  html = html.replace(
    /https?:\/\/cylio\.co\/wp-content\/et-cache\/([^"'\s]+\.css)(\?[^"'\s]*)?/g,
    (match, cssPath) => {
      const localName = cssPath.replace(/\//g, '-');
      return `/assets/css/${localName}`;
    }
  );

  // --- 4. Rewrite image references ---
  // Images from cylio.io/wp-content/uploads/
  html = html.replace(
    /https?:\/\/cylio\.co\/wp-content\/uploads\/([^"'\s,)]+)/g,
    '/assets/img/$1'
  );
  // Images from cylio.io/wp-content/uploads/
  html = html.replace(
    /https?:\/\/cylio\.wpenginepowered\.com\/wp-content\/uploads\/([^"'\s,)]+)/g,
    '/assets/img/$1'
  );
  // Plugin images
  html = html.replace(
    /https?:\/\/cylio\.co\/wp-content\/plugins\/([^"'\s,)]+\.(png|jpg|jpeg|webp|svg|gif))/g,
    '/assets/img/$1'
  );
  // Theme images
  html = html.replace(
    /https?:\/\/cylio\.co\/wp-content\/themes\/([^"'\s,)]+\.(png|jpg|jpeg|webp|svg|gif))/g,
    '/assets/img/$1'
  );

  // --- 5. Rewrite font references ---
  // Divi modules font
  html = html.replace(
    /https?:\/\/cylio\.co\/wp-content\/themes\/Divi\/core\/admin\/fonts\/modules\/all\/modules\.woff/g,
    '/assets/fonts/modules.woff'
  );
  // Custom fonts from wpenginepowered
  html = html.replace(
    /https?:\/\/cylio\.wpenginepowered\.com\/wp-content\/uploads\/et-fonts\/MetroSans-Book\.otf/g,
    '/assets/fonts/MetroSans-Book.otf'
  );
  html = html.replace(
    /https?:\/\/cylio\.wpenginepowered\.com\/wp-content\/uploads\/et-fonts\/MetroSans-Regular\.otf/g,
    '/assets/fonts/MetroSans-Regular.otf'
  );
  html = html.replace(
    /https?:\/\/cylio\.wpenginepowered\.com\/wp-content\/uploads\/et-fonts\/MetroSans-Bold\.otf/g,
    '/assets/fonts/MetroSans-Bold.otf'
  );
  html = html.replace(
    /https?:\/\/cylio\.co\/wp-content\/uploads\/et-fonts\/metro-sans-medium\.otf/g,
    '/assets/fonts/metro-sans-medium.otf'
  );

  // Google Fonts preconnect — remove
  html = html.replace(/<link[^>]*href="https?:\/\/fonts\.gstatic\.com\/?[^"]*"[^>]*rel="preconnect"[^>]*\/?>/gi, '');
  html = html.replace(/<link[^>]*rel="preconnect"[^>]*href="https?:\/\/fonts\.gstatic\.com\/?[^"]*"[^>]*\/?>/gi, '');

  // --- 6. Rewrite internal navigation links ---
  html = html.replace(/https?:\/\/cylio\.co\//g, '/');

  // --- 7. Remove WordPress API/feed links (not needed offline) ---
  html = html.replace(/<link[^>]*rel="pingback"[^>]*\/?>/gi, '');
  html = html.replace(/<link[^>]*rel="EditURI"[^>]*\/?>/gi, '');
  html = html.replace(/<link[^>]*type="application\/rss\+xml"[^>]*\/?>/gi, '');
  html = html.replace(/<link[^>]*type="application\/json\+oembed"[^>]*\/?>/gi, '');
  html = html.replace(/<link[^>]*type="text\/xml\+oembed"[^>]*\/?>/gi, '');
  html = html.replace(/<link[^>]*rel="https:\/\/api\.w\.org\/"[^>]*\/?>/gi, '');
  html = html.replace(/<link[^>]*rel="alternate"[^>]*type="application\/json"[^>]*\/?>/gi, '');

  // --- 8. Add shims script right before </head> ---
  const shimsScript = `
<script>
/* Offline shims - prevent errors from removed trackers */
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){};
window.google_tag_manager = window.google_tag_manager || {};
window.clarity = window.clarity || function(){};
window.grecaptcha = window.grecaptcha || {
  ready: function(cb) { if(cb) cb(); },
  execute: function() { return Promise.resolve('offline-token'); },
  render: function() { return 0; },
  reset: function() {},
  getResponse: function() { return 'offline-token'; }
};
/* Stub WP AJAX for forms */
if (typeof window.gf_global === 'undefined') {
  window.gf_global = window.gf_global || { gf_currency_config: { code: 'USD' }, base_url: '/', form_nonce: 'offline' };
}
</script>
`;

  if (html.includes('</head>')) {
    html = html.replace('</head>', shimsScript + '</head>');
  }

  // --- 9. Remove Google Fonts stylesheet links (we'll load locally via CSS) ---
  html = html.replace(/<link[^>]*href="https?:\/\/fonts\.googleapis\.com[^"]*"[^>]*\/?>/gi, '');

  // --- 10. Remove recaptcha iframes ---
  html = html.replace(/<iframe[^>]*src="[^"]*google\.com\/recaptcha[^"]*"[^>]*><\/iframe>/gi, '');

  // --- 11. Clean up empty lines from removals ---
  html = html.replace(/\n\s*\n\s*\n/g, '\n\n');

  fs.writeFileSync(filePath, html, 'utf-8');
  return changes;
}

// Main
const htmlFiles = findHtmlFiles(ROOT);
console.log(`Found ${htmlFiles.length} HTML files to process`);

let totalChanges = 0;
for (const file of htmlFiles) {
  const relPath = path.relative(ROOT, file);
  const changes = rewriteHtml(file);
  totalChanges += changes.length;
  console.log(`  ${relPath}: ${changes.length} changes`);
}

console.log(`\nDone. Total changes across all files: ${totalChanges}`);
