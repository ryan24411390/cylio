#!/usr/bin/env node
/**
 * Cross-page consistency verification for Cylio LLC website.
 * Checks all 35 pages for consistent footer, header, branding, links, and metadata.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// All 35 page directories
const ALL_PAGES = [
  '', // homepage (index.html at root)
  'about-us',
  'contact-us',
  'careers',
  'portfolio',
  'privacy-policy',
  'legal',
  'terms-of-service',
  'refund-policy',
  'cancellation-policy',
  'billing-policy',
  'acceptable-use-policy',
  'cookie-policy',
  'disclaimer',
  'fulfillment-policy',
  'support-policy',
  'complaint-resolution',
  'data-request',
  'accessibility',
  'intellectual-property',
  'dmca',
  'security',
  'communication-policy',
  'top-web-design-agencies-worldwide-2026',
  'top-web-design-agencies-canada-2026',
  'canadas-top-graphic-design-agencies-to-know-in-2026',
  'best-web-development-agencies-canada',
  'hvac-booking-quote-forms-the-highest-converting-layouts',
  'hvac-website-design-checklist-25-must-haves-that-drive-more-calls',
  'hvac-service-pages-that-rank-how-to-structure-pages-for-each-service',
  'hvac-trust-signals-what-to-add-to-your-website-to-win-more-jobs',
  'hvac-website-copy-that-converts-what-to-say-and-where-to-say-it',
  'hvac-website-redesign-when-to-redesign-vs-patch-your-current-site',
  'why-your-hvac-website-isnt-converting-in-canada-and-how-to-fix-it',
  'why-your-website-should-make-people-feel-something',
];

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failures = [];

function check(pageName, description, passed) {
  totalChecks++;
  if (passed) {
    passedChecks++;
  } else {
    failedChecks++;
    failures.push({ page: pageName || '/ (homepage)', description });
  }
}

function getFilePath(slug) {
  if (slug === '') return path.join(ROOT, 'index.html');
  return path.join(ROOT, slug, 'index.html');
}

console.log('=== Cylio LLC Cross-Page Consistency Verification ===\n');

for (const slug of ALL_PAGES) {
  const filePath = getFilePath(slug);
  const pageName = slug || '/';

  // 1. File exists
  if (!fs.existsSync(filePath)) {
    check(pageName, 'File exists', false);
    continue;
  }
  check(pageName, 'File exists', true);

  const content = fs.readFileSync(filePath, 'utf-8');

  // 2. Footer policy links
  check(pageName, 'Footer has Privacy Policy link', content.includes('href="/privacy-policy/"'));
  check(pageName, 'Footer has Terms of Service link', content.includes('href="/terms-of-service/"'));
  check(pageName, 'Footer has Cookie Policy link', content.includes('href="/cookie-policy/"'));
  check(pageName, 'Footer has Refund Policy link', content.includes('href="/refund-policy/"'));
  check(pageName, 'Footer has All Policies link', content.includes('href="/legal/"'));

  // 3. Footer business info
  check(pageName, 'Footer has support@cylio.io', content.includes('support@cylio.io'));
  check(pageName, 'Footer has phone number', content.includes('+1 (718) 781-7927') || content.includes('+17187817927'));
  check(pageName, 'Footer has address', content.includes('1910 Thomes Ave'));
  check(pageName, 'Footer has copyright 2026', content.includes('2026 Cylio LLC'));

  // 4. Header Legal nav link
  check(pageName, 'Header has Legal nav item',
    content.includes('et_pb_text_10_tb_header') || content.includes('>Legal</'));

  // 5. No old branding
  const lowerContent = content.toLowerCase();
  check(pageName, 'No "Envy Design" references',
    !lowerContent.includes('envy design co') ||
    lowerContent.includes('envy-design-co.svg') || // acceptable: filename
    lowerContent.includes('envy-form-sec-cust'));   // acceptable: CSS class

  check(pageName, 'No old email (sales@envydesign.co)',
    !content.includes('sales@envydesign.co'));

  check(pageName, 'No old phone (+1 289-541-9179)',
    !content.includes('289-541-9179'));

  // 6. No broken absolute URLs to cylio.io in navigation
  // (absolute URLs are acceptable in canonical, OG tags, JSON-LD, etc.)
  const navSection = content.match(/et_link_options_data[^}]*\}/);
  if (navSection) {
    check(pageName, 'No absolute cylio.io URLs in et_link_options_data',
      !navSection[0].includes('https://cylio.io'));
  }

  // 7. Meta tags
  check(pageName, 'Has <title> tag', /<title>[^<]+<\/title>/.test(content));
  check(pageName, 'Has meta description', /meta\s+name=["']description["']/.test(content));
  check(pageName, 'Has OG title', /og:title/.test(content));
  check(pageName, 'Has OG description', /og:description/.test(content));

  // 8. JSON-LD schema
  check(pageName, 'Has JSON-LD schema', content.includes('application/ld+json'));

  // 9. Title contains "Cylio"
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  if (titleMatch) {
    check(pageName, 'Title contains "Cylio"', titleMatch[1].includes('Cylio'));
  }

  // 10. Policy pages specific checks
  const policyPages = [
    'legal', 'terms-of-service', 'refund-policy', 'cancellation-policy',
    'billing-policy', 'acceptable-use-policy', 'cookie-policy', 'disclaimer',
    'fulfillment-policy', 'support-policy', 'complaint-resolution', 'data-request',
    'accessibility', 'intellectual-property', 'dmca', 'security', 'communication-policy'
  ];

  if (policyPages.includes(slug)) {
    check(pageName, 'Has "Last updated" date', content.includes('Last updated'));
    check(pageName, 'Has contact section with email', content.includes('support@cylio.io'));
  }
}

// 11. Cross-reference validation: check that internal policy links resolve
console.log('\n--- Cross-Reference Link Validation ---');
const policyRoutes = [
  '/legal/', '/privacy-policy/', '/terms-of-service/', '/refund-policy/',
  '/cancellation-policy/', '/billing-policy/', '/acceptable-use-policy/',
  '/cookie-policy/', '/disclaimer/', '/fulfillment-policy/', '/support-policy/',
  '/complaint-resolution/', '/data-request/', '/accessibility/',
  '/intellectual-property/', '/dmca/', '/security/', '/communication-policy/'
];

for (const slug of ALL_PAGES) {
  const filePath = getFilePath(slug);
  if (!fs.existsSync(filePath)) continue;
  const pageName = slug || '/';
  const content = fs.readFileSync(filePath, 'utf-8');

  // Find all internal href links
  const hrefMatches = content.match(/href="(\/[^"#]*?)"/g) || [];
  for (const match of hrefMatches) {
    const href = match.match(/href="(\/[^"#]*?)"/)[1];
    // Skip asset paths
    if (href.startsWith('/assets/')) continue;
    if (href.startsWith('/wp-')) continue;
    // Check if the target file exists
    const targetSlug = href.replace(/^\//, '').replace(/\/$/, '');
    const targetPath = targetSlug === '' ? path.join(ROOT, 'index.html') : path.join(ROOT, targetSlug, 'index.html');
    if (!fs.existsSync(targetPath)) {
      // Also check if it's a file (like sitemap.xml, robots.txt)
      const directPath = path.join(ROOT, targetSlug);
      if (!fs.existsSync(directPath)) {
        check(pageName, `Internal link "${href}" resolves to existing page`, false);
      }
    }
  }
}

// Summary
console.log('\n==========================================');
console.log(`Total checks: ${totalChecks}`);
console.log(`Passed: ${passedChecks}`);
console.log(`Failed: ${failedChecks}`);
console.log('==========================================');

if (failures.length > 0) {
  console.log('\n--- FAILURES ---');
  for (const f of failures) {
    console.log(`  [FAIL] ${f.page}: ${f.description}`);
  }
}

console.log(`\n${failedChecks === 0 ? 'ALL CHECKS PASSED!' : `${failedChecks} check(s) failed.`}`);
process.exit(failedChecks > 0 ? 1 : 0);
