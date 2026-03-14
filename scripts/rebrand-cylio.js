#!/usr/bin/env node
/**
 * rebrand-cylio.js
 * Automated rebrand: Cylio → Cylio
 * Processes all HTML, CSS, JS, JSON, MD files recursively.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = ['node_modules', '.git'];
const EXTENSIONS = ['.html', '.css', '.js', '.json', '.md'];

// Ordered replacement pairs (most specific first to avoid partial matches)
const REPLACEMENTS = [
  // Copyright line
  ['© 2026 Cylio LLC. All rights reserved.', '© 2026 Cylio LLC. All rights reserved.'],
  // Full legal name
  ['Cylio LLC', 'Cylio LLC'],
  ['Cylio LLC', 'Cylio LLC'],
  // Company name with period
  ['Cylio', 'Cylio'],
  // Company name without period
  ['Cylio', 'Cylio'],
  // Short name
  ['Cylio', 'Cylio'],
  // Email
  ['support@cylio.io', 'support@cylio.io'],
  // Social media links (before domain replacement)
  ['https://cylio.io', 'https://cylio.io'],
  ['https://cylio.io', 'https://cylio.io'],
  ['https://cylio.io', 'https://cylio.io'],
  ['cylio.io', 'cylio.io'],
  ['cylio.io', 'cylio.io'],
  ['cylio.io', 'cylio.io'],
  // Staging domain (before production domain)
  ['cylio.io', 'cylio.io'],
  // Package name
  ['cylio-website', 'cylio-website'],
  // Production domain
  ['cylio.io', 'cylio.io'],
  // Bare identifier
  ['cylio', 'cylio'],
  // Phone numbers
  ['+1 (718) 781-7927', '+1 (718) 781-7927'],
  ['(718) 781-7927', '(718) 781-7927'],
  ['7187817927', '7187817927'],
  // Alt text
  ['alt="Cylio"', 'alt="Cylio"'],
  ["alt='Cylio'", "alt='Cylio'"],
  // Google site verification (remove)
  // Handled separately via regex
];

// Escaped replacements for JSON strings within HTML
const ESCAPED_REPLACEMENTS = [
  ['cylio.io\\/wp-admin\\/admin-ajax.php', 'cylio.io\\/api\\/placeholder'],
  ['Cylio', 'Cylio'],
  ['Cylio', 'Cylio'],
  ['cylio.io', 'cylio.io'],
];

function findFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.includes(entry.name)) continue;
      results = results.concat(findFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS.includes(ext) && entry.name !== 'package-lock.json') {
        results.push(fullPath);
      }
    }
  }
  return results;
}

let totalChanges = 0;
let filesChanged = 0;
const changeLog = [];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Apply ordered replacements
  for (const [oldStr, newStr] of REPLACEMENTS) {
    if (content.includes(oldStr)) {
      const count = content.split(oldStr).length - 1;
      content = content.split(oldStr).join(newStr);
      if (count > 0) {
        totalChanges += count;
        changeLog.push({ file: path.relative(ROOT, filePath), old: oldStr, new: newStr, count });
      }
    }
  }

  // Remove Google site verification meta tag
  const siteVerifRegex = /<meta\s+name=["']google-site-verification["'][^>]*\/?\s*>/gi;
  const verifMatches = content.match(siteVerifRegex);
  if (verifMatches) {
    content = content.replace(siteVerifRegex, '');
    totalChanges += verifMatches.length;
    changeLog.push({ file: path.relative(ROOT, filePath), old: 'google-site-verification meta tag', new: '[removed]', count: verifMatches.length });
  }

  // Remove Performance Lab generator meta tag
  const perfLabRegex = /<meta\s+name=["']generator["']\s+content=["']Performance Lab[^"']*["'][^>]*\/?\s*>/gi;
  const perfMatches = content.match(perfLabRegex);
  if (perfMatches) {
    content = content.replace(perfLabRegex, '');
    totalChanges += perfMatches.length;
    changeLog.push({ file: path.relative(ROOT, filePath), old: 'Performance Lab generator meta', new: '[removed]', count: perfMatches.length });
  }

  // Remove Google Site Kit generator meta tag
  const siteKitRegex = /<meta\s+name=["']generator["']\s+content=["']Site Kit by Google[^"']*["'][^>]*\/?\s*>/gi;
  const siteKitMatches = content.match(siteKitRegex);
  if (siteKitMatches) {
    content = content.replace(siteKitRegex, '');
    totalChanges += siteKitMatches.length;
    changeLog.push({ file: path.relative(ROOT, filePath), old: 'Site Kit generator meta', new: '[removed]', count: siteKitMatches.length });
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    filesChanged++;
    return true;
  }
  return false;
}

console.log('Cylio Rebrand Script');
console.log('====================');
console.log(`Scanning from: ${ROOT}`);
console.log('');

const files = findFiles(ROOT);
console.log(`Found ${files.length} files to process...`);

for (const file of files) {
  processFile(file);
}

console.log('');
console.log(`Done! ${filesChanged} files modified, ${totalChanges} total replacements.`);
console.log('');

// Write change log
const logPath = path.join(ROOT, 'rebrand-changes.log');
const logContent = changeLog.map(c => `${c.file}: "${c.old}" → "${c.new}" (${c.count}x)`).join('\n');
fs.writeFileSync(logPath, `Cylio Rebrand Change Log\n${'='.repeat(50)}\nGenerated: ${new Date().toISOString()}\n\nTotal files changed: ${filesChanged}\nTotal replacements: ${totalChanges}\n\n${logContent}\n`);
console.log(`Change log written to: rebrand-changes.log`);
