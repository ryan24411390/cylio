# Vercel Deployment Checklist — Cylio

## Project Configuration

| Setting | Value |
|---------|-------|
| **Framework** | Other (Static HTML) |
| **Build Command** | _(none)_ |
| **Output Directory** | `.` (root) |
| **Install Command** | `npm install` (dev deps only) |
| **Node.js Version** | 18.x or later |

## Routing

The `vercel.json` file handles:
- **Clean URLs**: `/about-us` serves `about-us/index.html`
- **Trailing Slash**: Enforced (canonical URLs end with `/`)
- **Asset Caching**: 1-year immutable for `/assets/` and `/wp-content/`

## Pre-Deploy Checklist

- [ ] Connect repository to Vercel
- [ ] Verify `vercel.json` is in the root directory
- [ ] Confirm no build step is configured
- [ ] Set output directory to `.` (root)
- [ ] Verify `robots.txt` is accessible at `/robots.txt`

## Post-Deploy Verification

- [ ] Homepage loads at `https://cylio.io`
- [ ] All 6 main pages return 200
- [ ] All 12 blog articles return 200
- [ ] Portfolio page shows placeholder (not broken grid)
- [ ] Contact form fields are visible
- [ ] Favicon displays correctly
- [ ] OG image preview works (test with https://opengraph.dev)
- [ ] No console errors in browser dev tools
- [ ] Mobile responsive layout works
- [ ] Navigation menu opens/closes correctly

## Domain Configuration

| Record | Value |
|--------|-------|
| **Primary Domain** | `cylio.io` |
| **Redirect** | `www.cylio.io` → `cylio.io` |

## Environment Variables

No environment variables are required for the static site.
The `PORT` variable is only used for local development (`server.js`).

## Pages (18 total)

### Main Pages
1. `/` — Homepage
2. `/about-us/` — About
3. `/contact-us/` — Contact
4. `/careers/` — Careers
5. `/portfolio/` — Portfolio
6. `/privacy-policy/` — Privacy Policy

### Blog Articles (12)
7. `/top-web-design-agencies-worldwide-2026/`
8. `/top-web-design-agencies-canada-2026/`
9. `/best-web-development-agencies-canada/`
10. `/canadas-top-graphic-design-agencies-to-know-in-2026/`
11. `/why-your-website-should-make-people-feel-something/`
12. `/why-your-hvac-website-isnt-converting-in-canada-and-how-to-fix-it/`
13. `/hvac-website-design-checklist-25-must-haves-that-drive-more-calls/`
14. `/hvac-website-copy-that-converts-what-to-say-and-where-to-say-it/`
15. `/hvac-website-redesign-when-to-redesign-vs-patch-your-current-site/`
16. `/hvac-service-pages-that-rank-how-to-structure-pages-for-each-service/`
17. `/hvac-booking-quote-forms-the-highest-converting-layouts/`
18. `/hvac-trust-signals-what-to-add-to-your-website-to-win-more-jobs/`
