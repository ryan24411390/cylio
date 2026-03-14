#!/usr/bin/env node
/**
 * rewrite-pass4.js
 * Final cleanup: gravatar, www.cylio.io, jsdelivr active link
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

const htmlFiles = findHtmlFiles(ROOT);
let totalChanges = 0;

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf-8');
  const before = html;

  // 1. Replace gravatar URLs with local avatar
  html = html.replace(/https?:\/\/secure\.gravatar\.com\/avatar\/[^"'\s]+/g, '/assets/img/gravatar/author-avatar.jpg');

  // 2. Replace www.cylio.io with local path
  html = html.replace(/https?:\/\/www\.cylio\.co\//g, '/');

  // 3. Fix the active (non-commented) jsdelivr link
  html = html.replace(
    /href="https:\/\/cdn\.jsdelivr\.net\/npm\/swiper@11\/swiper-bundle\.min\.css"/g,
    'href="/assets/css/main.css"'
  );

  if (html !== before) {
    const relPath = path.relative(ROOT, file);
    fs.writeFileSync(file, html, 'utf-8');
    totalChanges++;
    console.log(`Fixed: ${relPath}`);
  }
}

console.log(`\nPass 4 done. Files changed: ${totalChanges}`);
