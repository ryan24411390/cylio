/**
 * fix-all-html.js
 * Comprehensive fix script for the offline mirror.
 *
 * Fixes:
 * 1. jQuery path: /wp-includes/js/jquery/jquery.min.js?ver=3.7.1 → /assets/js/jquery.min.js
 * 2. Cloudflare challenge script removal (the IIFE that creates an iframe and loads cdn-cgi)
 * 3. Adds gforms_recaptcha_recaptcha_strings shim before gform-recaptcha-frontend.js loads
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Find all HTML files recursively (excluding node_modules)
function findHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.playwright-mcp' || entry.name === 'docs') continue;
      results = results.concat(findHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = findHtmlFiles(ROOT);
console.log(`Found ${htmlFiles.length} HTML files to process.`);

let totalFixes = 0;

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  let fixes = [];

  // Fix 1: jQuery path
  // Replace /wp-includes/js/jquery/jquery.min.js?ver=3.7.1 with /assets/js/jquery.min.js
  const jqueryPattern = /src="\/wp-includes\/js\/jquery\/jquery\.min\.js(\?[^"]*)?"/g;
  if (jqueryPattern.test(content)) {
    content = content.replace(
      /src="\/wp-includes\/js\/jquery\/jquery\.min\.js(\?[^"]*)?"/g,
      'src="/assets/js/jquery.min.js"'
    );
    fixes.push('jQuery path');
  }

  // Fix 2: Remove Cloudflare challenge script
  // The pattern is an IIFE that creates an iframe and loads /cdn-cgi/challenge-platform/scripts/jsd/main.js
  const cfPattern = /<script>\(function\(\)\{function c\(\)\{var b=a\.contentDocument[\s\S]*?\/cdn-cgi\/challenge-platform[\s\S]*?\}\)\(\);<\/script>/g;
  if (cfPattern.test(content)) {
    content = content.replace(cfPattern, '<!-- Cloudflare challenge removed for offline mirror -->');
    fixes.push('Cloudflare challenge script');
  }

  // Fix 3: Add gforms_recaptcha_recaptcha_strings shim
  // Insert before the gform-recaptcha-frontend.js script tag if not already shimmed
  if (content.includes('gform-recaptcha-frontend.js') && !content.includes('gforms_recaptcha_recaptcha_strings')) {
    content = content.replace(
      /(<script[^>]*src="[^"]*gform-recaptcha-frontend\.js"[^>]*><\/script>)/,
      '<script>/* Offline shim: provide recaptcha strings so gform-recaptcha-frontend.js does not throw */\nvar gforms_recaptcha_recaptcha_strings = {"site_key":"","invisible":true,"i18n":{"undo":"Undo"}};</script>\n$1'
    );
    fixes.push('recaptcha strings shim');
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    const relPath = path.relative(ROOT, filePath);
    console.log(`  Fixed: ${relPath} [${fixes.join(', ')}]`);
    totalFixes += fixes.length;
  }
}

console.log(`\nDone. Applied ${totalFixes} fixes across ${htmlFiles.length} files.`);
