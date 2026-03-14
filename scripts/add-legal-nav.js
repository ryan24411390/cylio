/**
 * add-legal-nav.js
 * Adds "Legal" navigation item to the header popup menu on all pages.
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
let fixed = 0;

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;
  const relPath = path.relative(ROOT, filePath);

  // Check if the Legal HTML element already exists (not just in JS data)
  if (content.includes('class="et_pb_module et_pb_text et_pb_text_10_tb_header')) {
    continue; // Already has the Legal nav item as HTML element
  }

  // Pattern: Contact Us text followed by closing div then social icons ul
  // Using <p> variant (most pages)
  const patternP = /(et_pb_text_inner"><p>Contact Us<\/p><\/div>\s*<\/div>)(<ul class="et_pb_module et_pb_social_media_follow)/;
  if (patternP.test(content)) {
    const legalItem = `<div class="et_pb_module et_pb_text et_pb_text_10_tb_header et_clickable  et_pb_text_align_left et_pb_bg_layout_light">\n\n\t\t\t\t<div class="et_pb_text_inner"><p>Legal</p></div>\n\t\t\t</div>`;
    content = content.replace(patternP, `$1${legalItem}$2`);
  }

  // Using <span> variant (some template-generated pages)
  const patternSpan = /(et_pb_text_inner"><span>Contact Us<\/span><\/div>\s*<\/div>)(<ul class="et_pb_module et_pb_social_media_follow)/;
  if (patternSpan.test(content)) {
    const legalItem = `<div class="et_pb_module et_pb_text et_pb_text_10_tb_header et_clickable  et_pb_text_align_left et_pb_bg_layout_light">\n\n\t\t\t\t<div class="et_pb_text_inner"><span>Legal</span></div>\n\t\t\t</div>`;
    content = content.replace(patternSpan, `$1${legalItem}$2`);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    fixed++;
    console.log(`[${fixed}] ${relPath}`);
  }
}

console.log(`\nDone! Added Legal nav to ${fixed} files.`);
