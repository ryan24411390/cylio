#!/usr/bin/env node
/**
 * rewrite-pass3.js
 * Final cleanup pass for remaining external references.
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

function rewritePass3(filePath) {
  let html = fs.readFileSync(filePath, 'utf-8');
  let changeCount = 0;

  // 1. Remove remaining GTM script tag with async src
  const before1 = html.length;
  html = html.replace(/<script\s+async\s+src="https?:\/\/www\.googletagmanager\.com[^"]*"[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script[^>]*async[^>]*src="https?:\/\/www\.googletagmanager\.com[^"]*"[^>]*>[\s\S]*?<\/script>/gi, '');
  if (html.length !== before1) changeCount++;

  // 2. Remove the inline script that immediately follows (the gtag config)
  // Pattern: <script>\nwindow.dataLayer = ... gtag('config'...);\n</script>
  html = html.replace(/<script>\s*window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];\s*function\s+gtag\(\)\s*\{[^}]*\}\s*gtag\([^)]*\);\s*(?:gtag\([^)]*\);\s*)*<\/script>/gi, '');

  // 3. Fix the wpenginepowered.com redirect in form action
  html = html.replace(/https?:\/\/cylio\.wpenginepowered\.com\/thank-you\//g, '/contact-us/?submitted=true');
  html = html.replace(/https?:\/\/cylio\.wpenginepowered\.com\//g, '/');

  // 4. Remove remaining CDN jsdelivr from non-comment contexts
  // (the ones in HTML comments are fine to leave)

  // 5. Remove any remaining dns-prefetch for external domains
  html = html.replace(/<link[^>]*rel=['"]dns-prefetch['"][^>]*href=['"]\/\/www\.googletagmanager\.com['"][^>]*\/?>/gi, '');
  html = html.replace(/<link[^>]*href=['"]\/\/www\.googletagmanager\.com['"][^>]*rel=['"]dns-prefetch['"][^>]*\/?>/gi, '');
  html = html.replace(/<link[^>]*rel=['"]dns-prefetch['"][^>]*href=['"]\/\/www\.google\.com['"][^>]*\/?>/gi, '');

  // 6. Clean multiple blank lines
  html = html.replace(/\n\s*\n\s*\n/g, '\n\n');

  fs.writeFileSync(filePath, html, 'utf-8');
  return changeCount;
}

const htmlFiles = findHtmlFiles(ROOT);
console.log(`Pass 3: Processing ${htmlFiles.length} HTML files`);

let total = 0;
for (const file of htmlFiles) {
  const relPath = path.relative(ROOT, file);
  const changes = rewritePass3(file);
  total += changes;
  if (changes > 0) console.log(`  ${relPath}: ${changes} changes`);
}

console.log(`\nPass 3 done. Total changes: ${total}`);
