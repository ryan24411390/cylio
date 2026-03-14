#!/usr/bin/env node
/**
 * rewrite-pass2.js
 * Second pass: fix inline @font-face URLs, remaining tracker scripts,
 * CDN references, and other cleanup.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

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

// Font URL mappings for inline @font-face rewriting
const fontUrlMap = [
  // TTF variants (truetype) - italic
  ['nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_qiTbtY.ttf', 'PlayfairDisplay-Italic-400.ttf'],
  ['nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_pqTbtY.ttf', 'PlayfairDisplay-Italic-500.ttf'],
  ['nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_naUbtY.ttf', 'PlayfairDisplay-Italic-600.ttf'],
  ['nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_k-UbtY.ttf', 'PlayfairDisplay-Italic-700.ttf'],
  ['nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_iiUbtY.ttf', 'PlayfairDisplay-Italic-800.ttf'],
  ['nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_gGUbtY.ttf', 'PlayfairDisplay-Italic-900.ttf'],
  // TTF variants (truetype) - normal
  ['nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQ.ttf', 'PlayfairDisplay-Regular-400.ttf'],
  ['nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKd3vUDQ.ttf', 'PlayfairDisplay-Regular-500.ttf'],
  ['nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKebukDQ.ttf', 'PlayfairDisplay-Regular-600.ttf'],
  ['nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiukDQ.ttf', 'PlayfairDisplay-Regular-700.ttf'],
  ['nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKfFukDQ.ttf', 'PlayfairDisplay-Regular-800.ttf'],
  ['nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKfsukDQ.ttf', 'PlayfairDisplay-Regular-900.ttf'],
  // WOFF2 variants - italic
  ['nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_qiTbtM.woff2', 'PlayfairDisplay-Italic-400.woff2'],
  ['nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_pqTbtM.woff2', 'PlayfairDisplay-Italic-500.woff2'],
  ['nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_naUbtM.woff2', 'PlayfairDisplay-Italic-500.woff2'],
  ['nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_k-UbtM.woff2', 'PlayfairDisplay-Italic-500.woff2'],
  ['nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_iiUbtM.woff2', 'PlayfairDisplay-Italic-500.woff2'],
  ['nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_gGUbtM.woff2', 'PlayfairDisplay-Italic-500.woff2'],
  // WOFF2 variants - normal
  ['nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDV.woff2', 'PlayfairDisplay-Regular-latin.woff2'],
  ['nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKd3vUDV.woff2', 'PlayfairDisplay-Regular.woff2'],
  ['nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKebukDV.woff2', 'PlayfairDisplay-Regular.woff2'],
  ['nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiukDV.woff2', 'PlayfairDisplay-Regular.woff2'],
  ['nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKfFukDV.woff2', 'PlayfairDisplay-Regular.woff2'],
  ['nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKfsukDV.woff2', 'PlayfairDisplay-Regular.woff2'],
];

function rewritePass2(filePath) {
  let html = fs.readFileSync(filePath, 'utf-8');
  let changeCount = 0;

  // 1. Replace all fonts.gstatic.com URLs with local paths
  // Handle full URL patterns like: https://fonts.gstatic.com/s/playfairdisplay/v40/FILENAME
  for (const [remoteName, localName] of fontUrlMap) {
    const escaped = remoteName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`https?://fonts\\.gstatic\\.com/[^)'"\\s]*${escaped}`, 'g');
    const before = html;
    html = html.replace(pattern, `/assets/fonts/${localName}`);
    if (html !== before) changeCount++;
  }

  // 2. Handle woff variants from fonts.gstatic.com/l/font?kit=... (these are harder to map)
  // Replace entire URL block with just the woff2 variant since browsers prefer it
  // Remove the woff @font-face rules and keep only woff2 + ttf
  html = html.replace(/url\(https:\/\/fonts\.gstatic\.com\/l\/font\?kit=[^)]+\)\s*format\('woff'\)/g, (match) => {
    changeCount++;
    // Point to a general fallback - the woff2 version will be used by modern browsers
    return `url(/assets/fonts/PlayfairDisplay-Regular.woff2) format('woff2')`;
  });

  // 3. Remove any remaining Google Fonts references that weren't caught
  html = html.replace(/https?:\/\/fonts\.gstatic\.com\/[^"'\s)]+/g, (match) => {
    // Map any remaining references to a sensible local font
    if (match.includes('Italic')) {
      changeCount++;
      return '/assets/fonts/PlayfairDisplay-Italic-400.woff2';
    }
    changeCount++;
    return '/assets/fonts/PlayfairDisplay-Regular-latin.woff2';
  });

  // 4. Remove remaining GTM script tags that weren't caught in pass 1
  const before4 = html;
  html = html.replace(/<script\s+async\s+src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=[^"]*"><\/script>/gi, '');
  html = html.replace(/<script\s+async\s+src='https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=[^']*'><\/script>/gi, '');
  if (html !== before4) changeCount++;

  // 5. Remove DNS prefetch for tracker domains
  html = html.replace(/<link[^>]*href=['"]\/\/www\.googletagmanager\.com['"][^>]*\/?>/gi, '');
  html = html.replace(/<link[^>]*href=['"]\/\/www\.google\.com['"][^>]*\/?>/gi, '');

  // 6. Remove CDN jsdelivr references (they're in HTML comments, mostly harmless, but let's clean up)
  // The non-commented one needs attention
  html = html.replace(/href="https:\/\/cdn\.jsdelivr\.net[^"]*"/g, 'href="/assets/css/swiper-bundle.min.css"');
  html = html.replace(/src="https:\/\/cdn\.jsdelivr\.net[^"]*"/g, 'src="/assets/js/swiper.js"');

  // 7. Fix MetroSans font path that got rewritten to /assets/img/ instead of /assets/fonts/
  html = html.replace(/\/assets\/img\/et-fonts\/MetroSans-Book\.otf/g, '/assets/fonts/MetroSans-Book.otf');
  html = html.replace(/\/assets\/img\/et-fonts\/MetroSans-Regular\.otf/g, '/assets/fonts/MetroSans-Regular.otf');
  html = html.replace(/\/assets\/img\/et-fonts\/MetroSans-Bold\.otf/g, '/assets/fonts/MetroSans-Bold.otf');
  html = html.replace(/\/assets\/img\/et-fonts\/metro-sans-medium\.otf/g, '/assets/fonts/metro-sans-medium.otf');

  // 8. Fix image paths that went to wrong location
  // /assets/img/et-fonts/ should be /assets/fonts/
  html = html.replace(/\/assets\/img\/et-fonts\//g, '/assets/fonts/');

  // 9. Remove remaining Google fonts preconnect
  html = html.replace(/<link[^>]*href="https?:\/\/fonts\.gstatic\.com\/?[^"]*"[^>]*>/gi, '');

  // 10. Clean up multiple blank lines
  html = html.replace(/\n\s*\n\s*\n/g, '\n\n');

  fs.writeFileSync(filePath, html, 'utf-8');
  return changeCount;
}

const htmlFiles = findHtmlFiles(ROOT);
console.log(`Pass 2: Processing ${htmlFiles.length} HTML files`);

let total = 0;
for (const file of htmlFiles) {
  const relPath = path.relative(ROOT, file);
  const changes = rewritePass2(file);
  total += changes;
  if (changes > 0) console.log(`  ${relPath}: ${changes} changes`);
}

console.log(`\nPass 2 done. Total changes: ${total}`);
