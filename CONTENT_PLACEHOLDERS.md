# Content Placeholders — Items Needing Owner Review

Items marked with this document require final review before production deployment.

---

## High Priority

### 1. Portfolio Page Content
**File**: `portfolio/index.html`
**Status**: Placeholder text — "Selected projects coming soon"
**Action**: Add actual Cylio case studies/project cards when ready

### 2. PNG Favicon Files
**Files**:
- `assets/img/2020/02/cropped-icon-32x32.png`
- `assets/img/2020/02/cropped-icon-180x180.png`
- `assets/img/2020/02/cropped-icon-192x192.png`
- `assets/img/2020/02/cropped-icon-270x270.png`
**Status**: SVG versions created, but some browsers/social platforms require PNG
**Action**: Generate PNG favicons from the SVG or a proper Cylio icon design

### 3. OG Image
**File**: `assets/img/2022/11/og_image.png`
**Status**: SVG version created (`og_image.svg`), but social platforms require PNG
**Action**: Export a 1200x627 PNG OG image with Cylio branding

### 4. Schema Logo Image
**File**: `assets/img/2022/08/image001.png`
**Status**: Referenced in JSON-LD schema across all pages as the organization logo
**Action**: Replace with actual Cylio logo PNG (464x71px)

---

## Medium Priority

### 5. About Us Page Copy
**File**: `about-us/index.html`
**Status**: Founder bios removed, replaced with generic Cylio description
**Action**: Review and finalize company mission statement, team description, and values

### 6. Testimonials
**File**: `index.html` (homepage)
**Status**: Client names and quotes preserved from original site
**Action**: Review all testimonials for accuracy; replace or remove any that reference specific projects

### 7. Client Logos
**Files**: Various images in `assets/img/`
**Status**: Client logos (Miller Group, Rosalie Hall, etc.) remain from original site
**Action**: Confirm permission to display, or replace with actual Cylio clients

### 8. Blog Article Authorship
**Files**: All 12 blog `index.html` files
**Status**: Author changed from "Hung"/"Natashya" to "Cylio Team"
**Action**: Decide on final author attribution for blog posts

### 9. Privacy Policy Legal Review
**File**: `privacy-policy/index.html`
**Status**: Company name and jurisdiction updated programmatically
**Action**: Have legal counsel review the full privacy policy for accuracy

---

## Low Priority

### 10. Contact Form Backend
**File**: `contact-us/index.html`, `careers/index.html`, homepage footer
**Status**: Gravity Forms markup is visual only (offline mirror)
**Action**: Integrate with a form submission service (Formspree, Netlify Forms, or custom API)

### 11. Google Analytics / Tag Manager
**Status**: All tracking scripts removed during offline conversion
**Action**: Add new Cylio analytics tracking code when ready

### 12. Sitemap
**File**: Referenced in `robots.txt` as `https://cylio.io/sitemap.xml`
**Status**: Sitemap file does not exist yet
**Action**: Generate `sitemap.xml` with all 18 page URLs

### 13. Image Alt Text Audit
**Status**: Many images have generic or empty alt text from original WordPress export
**Action**: Review and update alt text for accessibility compliance

### 14. Hero Image / Background Video
**File**: `index.html` hero section
**Status**: Uses original hero media assets
**Action**: Replace with Cylio-branded hero content if desired

### 15. CSS Class Name Cleanup
**Status**: `envy-form-sec-cust` CSS class name remains in footer form sections
**Action**: Optional cosmetic rename (no user-visible impact)
