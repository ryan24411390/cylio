/**
 * compliance-updates.js
 * Mass-updates all HTML files for compliance hardening:
 * 1. Fix broken navigation links (et_link_options_data)
 * 2. Update footer with policy links and business info
 * 3. Add "Legal" link to header navigation
 * 4. Update Privacy Policy content and date
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Find all HTML files recursively (excluding node_modules, docs, test-results, scripts)
function findHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.playwright-mcp', 'docs', 'test-results', 'scripts', '.git'].includes(entry.name)) continue;
      results = results.concat(findHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = findHtmlFiles(ROOT);
console.log(`Found ${htmlFiles.length} HTML files to process.\n`);

let totalUpdates = 0;

// ─── Old/New Footer ────────────────────────────────────────────────

const OLD_FOOTER_PATTERN = /<div class="et_pb_text_inner">© 2026 Cylio LLC\. All rights reserved\. <a href="\/privacy-policy\/"><span style="color: rgba\(255, 255, 255, 0\.5\) !important;">Privacy policy\.<\/span><\/a><\/div>/;

const NEW_FOOTER = `<div class="et_pb_text_inner"><p style="margin-bottom: 8px;">&copy; 2026 Cylio LLC. All rights reserved.</p><p style="margin-bottom: 4px; font-size: 11px; line-height: 1.8;"><a href="/privacy-policy/" style="color: rgba(255,255,255,0.5) !important;">Privacy Policy</a> &middot; <a href="/terms-of-service/" style="color: rgba(255,255,255,0.5) !important;">Terms of Service</a> &middot; <a href="/cookie-policy/" style="color: rgba(255,255,255,0.5) !important;">Cookie Policy</a> &middot; <a href="/refund-policy/" style="color: rgba(255,255,255,0.5) !important;">Refund Policy</a> &middot; <a href="/legal/" style="color: rgba(255,255,255,0.5) !important;">All Policies</a></p><p style="margin-bottom: 0; font-size: 10px; line-height: 1.6; color: rgba(255,255,255,0.35);">Cylio LLC &middot; 1910 Thomes Ave, Cheyenne, WY 82001 &middot; <a href="mailto:support@cylio.io" style="color: rgba(255,255,255,0.35) !important;">support@cylio.io</a> &middot; <a href="tel:+17187817927" style="color: rgba(255,255,255,0.35) !important;">+1 (718) 781-7927</a></p></div>`;

// ─── Old/New Nav Links ──────────────────────────────────────────────

const OLD_NAV_PATTERN = /var et_link_options_data = \[.*?\];/s;

const NEW_NAV = `var et_link_options_data = [{"class":"et_pb_text_0_tb_header","url":"\\/#branding","target":"_self"},{"class":"et_pb_text_1_tb_header","url":"\\/#webdesign","target":"_self"},{"class":"et_pb_text_2_tb_header","url":"\\/#digital","target":"_self"},{"class":"et_pb_text_3_tb_header","url":"\\/#presentations","target":"_self"},{"class":"et_pb_text_4_tb_header","url":"\\/#packaging","target":"_self"},{"class":"et_pb_text_5_tb_header","url":"\\/portfolio\\/","target":"_self"},{"class":"et_pb_text_6_tb_header","url":"\\/about-us\\/","target":"_self"},{"class":"et_pb_text_7_tb_header","url":"\\/about-us\\/","target":"_self"},{"class":"et_pb_text_8_tb_header","url":"\\/careers\\/","target":"_self"},{"class":"et_pb_text_9_tb_header","url":"\\/contact-us\\/","target":"_self"},{"class":"et_pb_text_10_tb_header","url":"\\/legal\\/","target":"_self"},{"class":"et_pb_blurb_1_tb_footer","url":"\\/","target":"_self"}];`;

// ─── Header Nav: Add "Legal" link ───────────────────────────────────

// The "Contact Us" entry in the header navigation popup (last item in "Get to know us" section)
// We add a "Legal" entry after it. Look for the Contact Us text module and add Legal after it.
const CONTACT_NAV_PATTERN = /(<div class="et_pb_module et_pb_text et_pb_text_9_tb_header[^"]*"[^>]*>[\s\S]*?<div class="et_pb_text_inner"><span>Contact Us<\/span><\/div>\s*<\/div>)/;

const LEGAL_NAV_ITEM = `<div class="et_pb_module et_pb_text et_pb_text_10_tb_header et_clickable et_pb_text_align_left et_pb_bg_layout_light">

				<div class="et_pb_text_inner"><span>Legal</span></div>
			</div>`;

// ─── Process All Files ──────────────────────────────────────────────

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;
  const fixes = [];
  const relPath = path.relative(ROOT, filePath);

  // Fix 1: Update footer
  if (OLD_FOOTER_PATTERN.test(content)) {
    content = content.replace(OLD_FOOTER_PATTERN, NEW_FOOTER);
    fixes.push('footer');
  }

  // Fix 2: Update navigation links
  if (OLD_NAV_PATTERN.test(content)) {
    content = content.replace(OLD_NAV_PATTERN, NEW_NAV);
    fixes.push('nav-links');
  }

  // Fix 3: Add Legal nav item (only if Contact Us exists but Legal doesn't)
  if (content.includes('et_pb_text_9_tb_header') && !content.includes('et_pb_text_10_tb_header')) {
    const contactMatch = content.match(CONTACT_NAV_PATTERN);
    if (contactMatch) {
      content = content.replace(CONTACT_NAV_PATTERN, `$1\n${LEGAL_NAV_ITEM}`);
      fixes.push('header-legal-link');
    }
  }

  // Fix 4: Update Privacy Policy content (only for privacy-policy page)
  if (relPath === 'privacy-policy/index.html') {
    // Update the effective date
    content = content.replace(
      'This policy is effective as of 23 July 2022 and was last updated on 23 July 2022.',
      'Last updated: March 13, 2026.'
    );

    // Add new sections before the Contact Us section at the end
    const privacyContactPattern = /<h3>Contact Us<\/h3>\s*<p>For any questions or concerns regarding your privacy, <a href="\/contact-us\/">you may contact us here\.<\/a><\/p>/;

    const newPrivacySections = `<h3>Cookies and Tracking Technologies</h3>
<p>Our website may use cookies and similar technologies to enhance your experience. For detailed information about how we use cookies, please review our <a href="/cookie-policy/">Cookie Policy</a>.</p>
<h3>Your Privacy Rights</h3>
<p>Depending on your location and applicable law, you may have certain rights regarding your personal information, including the right to access, correct, delete, or port your data. For information on how to exercise these rights, please visit our <a href="/data-request/">Privacy Rights & Data Requests</a> page.</p>
<h3>Third-Party Services</h3>
<p>We may use third-party service providers to assist with website hosting, analytics, and communication tools. These providers may collect information on our behalf in accordance with their own privacy policies. We encourage you to review the privacy practices of any third-party services you interact with through our website.</p>
<h3>Contact Us</h3>
<p>For any questions or concerns regarding your privacy, please contact us:</p>
<ul>
<li><strong>Email:</strong> <a href="mailto:support@cylio.io">support@cylio.io</a></li>
<li><strong>Phone:</strong> <a href="tel:+17187817927">+1 (718) 781-7927</a></li>
<li><strong>Mail:</strong> Cylio LLC, 1910 Thomes Ave, Cheyenne, WY 82001</li>
</ul>`;

    if (privacyContactPattern.test(content)) {
      content = content.replace(privacyContactPattern, newPrivacySections);
      fixes.push('privacy-policy-content');
    }
  }

  // Write if changed
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalUpdates++;
    console.log(`[${totalUpdates}] ${relPath}: ${fixes.join(', ')}`);
  }
}

console.log(`\nDone! Updated ${totalUpdates} files.`);
