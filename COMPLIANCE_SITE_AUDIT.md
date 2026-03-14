# Compliance Site Audit — Cylio LLC

**Date:** March 13, 2026
**Domain:** cylio.io
**Legal Entity:** Cylio LLC
**Address:** 1910 Thomes Ave, Cheyenne, WY 82001

---

## 1. Old Brand References Removed

The site was previously operating under "Envy Design Co. Inc." branding. All user-visible references have been replaced:

- Company name: Envy Design Co. → Cylio / Cylio LLC
- Email: sales@envydesign.co → support@cylio.io
- Phone number: +1 289-541-9179 → +1 (718) 781-7927
- Address: Toronto, Ontario, Canada → 1910 Thomes Ave, Cheyenne, WY 82001
- Domain references: envydesign.co → cylio.io
- Blog author attribution: Individual names → "Cylio Team"
- Meta tags, OG tags, JSON-LD schema: All updated to Cylio branding
- Copyright: Updated to "© 2026 Cylio LLC"

**Remaining non-visible remnants (acceptable):**
- File path `assets/img/2023/05/envy-design-co.svg` (contains Cylio branding internally)
- CSS class name `envy-form-sec-cust` (internal Divi selector, not visible to users)

---

## 2. Policy Pages Added

17 new pages created (16 policy pages + 1 legal hub):

| Page | Route | Status |
|------|-------|--------|
| Legal & Policies Hub | `/legal/` | Created |
| Terms of Service | `/terms-of-service/` | Created |
| Refund Policy | `/refund-policy/` | Created |
| Cancellation Policy | `/cancellation-policy/` | Created |
| Billing Policy | `/billing-policy/` | Created |
| Acceptable Use Policy | `/acceptable-use-policy/` | Created |
| Cookie Policy | `/cookie-policy/` | Created |
| Disclaimer | `/disclaimer/` | Created |
| Fulfillment Policy | `/fulfillment-policy/` | Created |
| Support Policy | `/support-policy/` | Created |
| Complaint Resolution | `/complaint-resolution/` | Created |
| Privacy Rights & Data Requests | `/data-request/` | Created |
| Accessibility Statement | `/accessibility/` | Created |
| Intellectual Property Notice | `/intellectual-property/` | Created |
| DMCA & Copyright | `/dmca/` | Created |
| Security & Responsible Disclosure | `/security/` | Created |
| Communication Policy | `/communication-policy/` | Created |

**Existing page updated:**
- Privacy Policy (`/privacy-policy/`) — date updated, new sections added (Cookies, Privacy Rights, Third-Party Services, detailed Contact)

---

## 3. Trust & Compliance Improvements

### Footer (all 35 pages)
- Added links to: Privacy Policy, Terms of Service, Cookie Policy, Refund Policy, All Policies hub
- Added full business contact: Cylio LLC, address, email, phone
- Updated copyright to © 2026

### Header Navigation (all 35 pages)
- Added "Legal" link to popup navigation menu, pointing to `/legal/`

### Navigation Links Fixed (all pages)
- Fixed broken `et_link_options_data` URLs pointing to non-existent WordPress pages
- Converted absolute `https://cylio.io/...` URLs to relative paths
- Service links now use in-page anchors (`/#webdesign`, `/#branding`, etc.)
- Removed reference to non-existent `/our-process/` page

### Contact Page (`/contact-us/`)
- Added full business contact details (email, phone, address)
- Added response time expectations (1-2 business days)
- Added links to Support Policy and Complaint Resolution
- Added guidance on what to include in inquiries

### Supporting Files
- Created `sitemap.xml` with all 35 pages (referenced by existing `robots.txt`)
- Created branded `404.html` error page with Cylio branding
- Updated `server.js` to serve the branded 404 page

---

## 4. Items Requiring Attorney Review

The following items use general, conservative language and should be reviewed by legal counsel before final deployment:

1. **All 16 new policy pages** — Written with professional, general language; not jurisdiction-specific
2. **Terms of Service** — Governing law set to Wyoming; dispute resolution set to Cheyenne, WY
3. **Privacy Policy** — CCPA/GDPR references are informational, not guarantees of compliance
4. **DMCA page** — Designated agent information listed; formal DMCA agent registration with the U.S. Copyright Office may be required
5. **Accessibility Statement** — WCAG 2.1 AA stated as a goal/aspiration, not a certification of compliance
6. **Refund/Cancellation/Billing policies** — Language is general and references project agreements; specific terms should be defined per engagement

---

## 5. Remaining Known Issues (Non-Blocking)

| Item | Priority | Notes |
|------|----------|-------|
| Portfolio placeholder content | Medium | "Selected projects coming soon" — needs real case studies |
| PNG favicon files | Low | SVG versions exist; PNG needed for some browsers/platforms |
| OG image PNG export | Low | SVG exists; 1200x627 PNG needed for social sharing |
| Schema logo image | Low | References image001.png; should be actual Cylio logo PNG |
| Contact form backend | Low | Gravity Forms visual only; needs integration with form service |
| Google Analytics | Low | Removed during offline conversion; needs new tracking code |
| Social media links | Low | LinkedIn/Instagram/Facebook point to cylio.io placeholder |
| Client logos/testimonials | Medium | From original site; need permission confirmation |
| Image alt text | Low | Many images have generic/empty alt text |

---

## 6. Total Page Count

**35 pages** (6 original main + 12 blog articles + 17 new legal/policy pages)

All pages are verified to:
- Return HTTP 200
- Have consistent Cylio branding
- Include updated footer with policy links
- Include "Legal" in header navigation
- Have proper meta tags and JSON-LD schema
