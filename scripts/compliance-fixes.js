/**
 * compliance-fixes.js
 * Fix remaining issues:
 * 1. Careers page footer (different format)
 * 2. Add "Legal" nav item to header on all pages
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

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
let totalFixes = 0;

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;
  const fixes = [];
  const relPath = path.relative(ROOT, filePath);

  // Fix 1: Careers-style footer (different pattern with <p> wrapper and 2024)
  const careersFooterPattern = /<div class="et_pb_text_inner"><p>© 2024 Cylio LLC All rights reserved\.<a href="\/privacy-policy\/"><span style="color: rgba\(255, 255, 255, 0\.5\) !important;">Privacy policy\.<\/span><\/a><\/p><\/div>/;
  if (careersFooterPattern.test(content)) {
    const newFooter = `<div class="et_pb_text_inner"><p style="margin-bottom: 8px;">&copy; 2026 Cylio LLC. All rights reserved.</p><p style="margin-bottom: 4px; font-size: 11px; line-height: 1.8;"><a href="/privacy-policy/" style="color: rgba(255,255,255,0.5) !important;">Privacy Policy</a> &middot; <a href="/terms-of-service/" style="color: rgba(255,255,255,0.5) !important;">Terms of Service</a> &middot; <a href="/cookie-policy/" style="color: rgba(255,255,255,0.5) !important;">Cookie Policy</a> &middot; <a href="/refund-policy/" style="color: rgba(255,255,255,0.5) !important;">Refund Policy</a> &middot; <a href="/legal/" style="color: rgba(255,255,255,0.5) !important;">All Policies</a></p><p style="margin-bottom: 0; font-size: 10px; line-height: 1.6; color: rgba(255,255,255,0.35);">Cylio LLC &middot; 1910 Thomes Ave, Cheyenne, WY 82001 &middot; <a href="mailto:support@cylio.io" style="color: rgba(255,255,255,0.35) !important;">support@cylio.io</a> &middot; <a href="tel:+17187817927" style="color: rgba(255,255,255,0.35) !important;">+1 (718) 781-7927</a></p></div>`;
    content = content.replace(careersFooterPattern, newFooter);
    fixes.push('careers-footer');
  }

  // Fix 2: Add "Legal" nav item after Contact Us in header
  // The Contact Us item is followed by the social media ul
  // Pattern: ...Contact Us</p></div>\n\t\t\t</div><ul class="et_pb_module et_pb_social_media_follow
  if (!content.includes('et_pb_text_10_tb_header') && content.includes('et_pb_text_9_tb_header')) {
    const headerNavPattern = /(et_pb_text_inner"><p>Contact Us<\/p><\/div>\s*<\/div>)(<ul class="et_pb_module et_pb_social_media_follow)/;
    if (headerNavPattern.test(content)) {
      const legalItem = `<div class="et_pb_module et_pb_text et_pb_text_10_tb_header et_clickable  et_pb_text_align_left et_pb_bg_layout_light">\n\n\t\t\t\t<div class="et_pb_text_inner"><p>Legal</p></div>\n\t\t\t</div>`;
      content = content.replace(headerNavPattern, `$1${legalItem}$2`);
      fixes.push('header-legal-link');
    }
  }

  // Also handle the <span> variant (used in some pages from the privacy-policy template)
  if (!content.includes('et_pb_text_10_tb_header') && content.includes('et_pb_text_9_tb_header')) {
    const headerNavPatternSpan = /(et_pb_text_inner"><span>Contact Us<\/span><\/div>\s*<\/div>)(<ul class="et_pb_module et_pb_social_media_follow)/;
    if (headerNavPatternSpan.test(content)) {
      const legalItem = `<div class="et_pb_module et_pb_text et_pb_text_10_tb_header et_clickable  et_pb_text_align_left et_pb_bg_layout_light">\n\n\t\t\t\t<div class="et_pb_text_inner"><span>Legal</span></div>\n\t\t\t</div>`;
      content = content.replace(headerNavPatternSpan, `$1${legalItem}$2`);
      fixes.push('header-legal-link-span');
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalFixes++;
    console.log(`[${totalFixes}] ${relPath}: ${fixes.join(', ')}`);
  }
}

console.log(`\nDone! Fixed ${totalFixes} files.`);
