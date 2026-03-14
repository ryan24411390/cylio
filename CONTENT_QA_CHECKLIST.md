# Content QA Checklist — Cylio Blog Rewrite

Generated: 2026-03-13

## Legacy Content Removal

- [ ] No "HVAC" references in article body content
- [ ] No "Envy Design" references anywhere in blog files
- [ ] No "envydesign" references anywhere in blog files
- [ ] No "Hung" author references in metadata or JSON-LD
- [ ] No old article titles remain in rendered content
- [ ] No old article body text remains in any blog file
- [ ] No references to old clients, case studies, or projects in blog content

## Metadata Verification

- [ ] All 12 articles have `<title>` with new title + " - Cylio"
- [ ] All 12 articles have `og:title` matching `<title>`
- [ ] All 12 articles have `og:description` present and accurate
- [ ] All 12 articles have `article:modified_time` set to 2026-03-13
- [ ] All 12 articles have `twitter:data2` with correct reading time
- [ ] All 12 articles have valid JSON-LD with updated headline and wordCount
- [ ] JSON-LD Person name is "Cylio Team" (not "Hung")
- [ ] JSON-LD Person image caption is "Cylio Team" (not "Hung")
- [ ] JSON-LD Organization name is "Cylio"
- [ ] `meta name="description"` is updated where present (3 articles)
- [ ] `og:site_name` is "Cylio" on all articles

## Content Quality

- [ ] Each article has a clear, distinct topic
- [ ] No duplicate topics across the 12 articles
- [ ] Each article has 4-6 H2 section headings
- [ ] Each article has an intro, body sections, and conclusion
- [ ] Each article has 3-5 FAQ items in accordion format
- [ ] Voice is consistent: modern, technical, clear, B2B-friendly
- [ ] No filler content or generic AI phrasing
- [ ] No broken HTML or unclosed tags in article content

## Rendering Verification

- [ ] All 12 blog routes load at http://localhost:3000/[slug]/
- [ ] H1 title renders correctly on each article
- [ ] Body content renders with proper formatting
- [ ] FAQ accordion opens/closes correctly on each article
- [ ] Related posts carousel shows new titles on each article
- [ ] Homepage "Our latest articles" carousel shows new titles
- [ ] No JavaScript console errors on any blog page
- [ ] No broken images on any blog page
- [ ] Mobile layout renders correctly
- [ ] Footer and header remain intact on all articles

## Cross-Reference Integrity

- [ ] Related posts carousel in all 12 blog articles has correct new titles
- [ ] Homepage carousel has correct new titles
- [ ] All carousel links (`<a href>`) point to valid slugs
- [ ] Playwright test for FAQ accordion uses updated text
- [ ] Route inventory doc has updated article titles

## Build and Deploy

- [ ] `npm test` passes all Playwright E2E tests
- [ ] `npm run audit` reports zero external requests
- [ ] Server starts correctly with `npm run dev`
- [ ] All 50 pages load without errors
- [ ] Site is Vercel-deployment compatible

## Search and Discovery

- [ ] Canonical URLs are correct on all articles
- [ ] Breadcrumb schema in JSON-LD reflects new titles
- [ ] OG images are valid and load correctly
- [ ] No mixed content (HTTP/HTTPS) issues
