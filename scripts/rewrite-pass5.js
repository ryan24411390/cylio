#!/usr/bin/env node
/**
 * rewrite-pass5.js
 * Fix remaining Divi font references (protocol-relative URLs) in HTML and CSS files.
 * These use //cylio.io/wp-content/themes/Divi/core/admin/fonts/modules/...
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function findFiles(dir, exts) {
  let results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !['node_modules', '.git', '.playwright-mcp', 'docs', 'tests', 'scripts', 'test-results'].includes(entry.name)) {
        results = results.concat(findFiles(fullPath, exts));
      } else if (entry.isFile() && exts.some(ext => entry.name.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  } catch (e) {}
  return results;
}

const htmlFiles = findFiles(ROOT, ['.html']);
const cssFiles = findFiles(path.join(ROOT, 'assets', 'css'), ['.css']);
const allFiles = [...htmlFiles, ...cssFiles];

let totalChanges = 0;

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  const before = content;

  // Replace all protocol-relative and absolute Divi font references with local path
  // Handles both //cylio.io/... and http(s)://cylio.io/...
  content = content.replace(
    /(?:https?:)?\/\/cylio\.co\/wp-content\/themes\/Divi\/core\/admin\/fonts\/modules\/[a-z]+\/modules\.(eot|woff|ttf|svg)(\?[^)'"]*)?/g,
    '/assets/fonts/modules.$1'
  );

  if (content !== before) {
    const relPath = path.relative(ROOT, file);
    fs.writeFileSync(file, content, 'utf-8');
    totalChanges++;
  }
}

console.log(`Pass 5 done. Files changed: ${totalChanges}`);
