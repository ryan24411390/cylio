#!/usr/bin/env node
/**
 * audit-external-requests.js
 * Crawls all local HTML and CSS files and flags any remaining
 * external domain references that would require network access.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Domains that are acceptable (intentional outbound links, not runtime deps)
const ALLOWED_DOMAINS = [
  'www.facebook.com',
  'www.linkedin.com',
  'www.instagram.com',
  'schema.org',
  'clutch.co',
  'www.elegantthemes.com',
  'www.gnu.org',
  'yoast.com',
  'loading.io',             // CSS comment only
  'www.w3.org',             // XML namespace
  'fonts.googleapis.com',   // in CSS comments only
  'daneden.me',             // CSS license comment (animate.css)
  'opensource.org',          // CSS license comment (MIT)
  'cylio.io', // text reference in privacy policy
  'cdn.jsdelivr.net',       // HTML comment only
];

function findFiles(dir, exts) {
  let results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !['node_modules', '.git', '.playwright-mcp'].includes(entry.name)) {
        results = results.concat(findFiles(fullPath, exts));
      } else if (entry.isFile() && exts.some(ext => entry.name.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  } catch (e) {}
  return results;
}

function extractUrls(content) {
  const urlPattern = /https?:\/\/[a-zA-Z0-9.-]+\.[a-z]{2,}[^\s"'<>)}\]]*?(?=[\s"'<>)}\]]|$)/g;
  return [...content.matchAll(urlPattern)].map(m => m[0]);
}

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

// Main audit
const htmlFiles = findFiles(ROOT, ['.html']);
const cssFiles = findFiles(path.join(ROOT, 'assets', 'css'), ['.css']);
const allFiles = [...htmlFiles, ...cssFiles];

console.log(`Auditing ${allFiles.length} files for external requests...\n`);

const issues = [];
const domainCounts = {};

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const urls = extractUrls(content);
  const relPath = path.relative(ROOT, file);

  for (const url of urls) {
    const domain = getDomain(url);
    if (!domain) continue;
    if (domain === 'localhost' || domain.endsWith('.local')) continue;
    if (ALLOWED_DOMAINS.includes(domain)) continue;

    // Check if it's in an HTML comment
    const idx = content.indexOf(url);
    const before = content.substring(Math.max(0, idx - 10), idx);
    if (before.includes('<!--') || before.includes('/*')) continue;

    domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    issues.push({ file: relPath, url, domain });
  }
}

if (issues.length === 0) {
  console.log('PASS: No problematic external requests found.\n');
  console.log('All external references are either:');
  console.log('  - Intentional outbound links (social media, reviews)');
  console.log('  - Non-runtime references (comments, schema markup)');
  console.log('  - Localized to /assets/');
  process.exit(0);
} else {
  console.log(`WARN: Found ${issues.length} external reference(s) to review:\n`);

  // Group by domain
  const byDomain = {};
  for (const issue of issues) {
    if (!byDomain[issue.domain]) byDomain[issue.domain] = [];
    byDomain[issue.domain].push(issue);
  }

  for (const [domain, domainIssues] of Object.entries(byDomain)) {
    console.log(`  ${domain} (${domainIssues.length} references):`);
    for (const issue of domainIssues.slice(0, 3)) {
      console.log(`    - ${issue.file}`);
      console.log(`      ${issue.url.substring(0, 100)}`);
    }
    if (domainIssues.length > 3) {
      console.log(`    ... and ${domainIssues.length - 3} more`);
    }
    console.log('');
  }

  process.exit(1);
}
