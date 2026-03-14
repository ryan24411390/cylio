# TODO / Manual Review

Items that need manual review or attention before this offline mirror is considered production-ready.

---

## High Priority

### 1. Form Submissions Are Stubbed (Offline Mode)

**Status:** Needs real backend for production use

All Gravity Forms on the site (Contact, Careers) are visually preserved but submit to the local Node.js server, which returns a generic offline confirmation message. No form data is captured, stored, or transmitted.

**Affected pages:**
- `/contact-us/` -- Main contact form
- `/careers/` -- Job application form with file upload

**To fix:** Implement a real form backend (e.g., Formspree, custom API endpoint, email relay) and update the form `action` attributes in the HTML files.

---

### 2. Portfolio Pagination: Only Page 1 Captured

**Status:** Additional pages not mirrored

The portfolio grid at `/portfolio/` only contains the first page of results. The live site may have additional pages (`/portfolio/page/2/`, `/portfolio/page/3/`, etc.) that were not captured.

**To fix:** Either capture additional portfolio pages, or implement client-side pagination/filtering over the existing project data.

---

### 3. Blog Post Pagination: Not Captured

**Status:** No blog index or pagination

The live site does not have a dedicated `/blog/` index page -- blog posts are top-level slugs. There is no pagination mechanism captured for browsing all blog posts.

**To fix:** Consider creating a `/blog/` index page that links to all 12 captured blog articles.

---

## Medium Priority

### 4. "Book a Call" Links Point to # Anchor

**Status:** Placeholder links

Several "Book a Call" or "Schedule a Consultation" CTAs across the site use `#` as their `href` value. On the live site, these may link to an external booking service (e.g., Calendly, HubSpot).

**Affected pages:**
- Homepage (hero CTA, footer CTA)
- About page
- Various project case studies

**To fix:** Replace `#` with the actual booking URL or implement a local booking form.

---

### 5. Careers Page File Upload

**Status:** UI preserved, functionality non-operational

The careers page includes a resume/CV file upload field as part of the Gravity Forms job application. The upload UI elements are visually preserved, but file uploads do not function in offline mode -- the server does not process multipart form data.

**To fix:** If career applications need to work, implement file upload handling in the server or connect to an external form processor.

---

### 6. Some Project Pages May Have Additional Content

**Status:** Review needed

Some project case studies on the live site may contain:
- Multi-page galleries or image carousels with additional slides loaded dynamically
- Video embeds from YouTube/Vimeo that would not work offline
- Interactive prototypes or embedded iframes

These elements may be partially captured or absent in the offline mirror.

**To fix:** Review each of the 32 case study pages against the live site and capture any missing assets.

---

## Low Priority

### 7. Service Pages Return 404 on Live Site

**Status:** Not applicable -- skipped by design

The live site does not have separate route pages for individual services (branding, web design, UI/UX, etc.). These services are presented as sections on the homepage. Attempting to visit `/branding/` or `/web-design/` on the live site returns 404.

**No action needed** -- this is documented behavior, not a missing feature.

---

### 8. /our-process/ Returns 404 on Live Site

**Status:** Skipped by design

The `/our-process/` page returns 404 on the live site. It is listed in some internal navigation but the page does not exist. This route has been intentionally skipped in the mirror.

**No action needed** -- navigation links to this page could optionally be removed or redirected to the homepage.

---

## Checklist

- [ ] Implement real form backend for Contact and Careers pages
- [ ] Capture additional portfolio pages or add client-side pagination
- [ ] Create blog index page linking to all 12 articles
- [ ] Replace "Book a Call" `#` links with real booking URLs
- [ ] Test careers file upload with real form processor
- [ ] Review all 32 case study pages for missing dynamic content
- [ ] Optionally remove or redirect `/our-process/` navigation links
