# Visual Diff Notes

Expected visual differences between the offline mirror and the live cylio.io website. These differences are intentional consequences of tracker removal, offline operation, and self-hosting.

---

## 1. reCAPTCHA Badge Removed

**Live site:** A small Google reCAPTCHA v3 badge is visible in the bottom-right corner of every page (floating "Protected by reCAPTCHA" shield).

**Offline mirror:** The badge is completely absent. The reCAPTCHA script has been removed and the `.grecaptcha-badge` CSS has been set to `display: none`.

**Affected pages:** All pages, most noticeable on Contact and Careers pages where forms are present.

---

## 2. Cookie Consent Banner Removed

**Live site:** A cookie consent banner or popup may appear on first visit, managed by the WordPress consent API and Google Site Kit consent module.

**Offline mirror:** No cookie consent banner is shown. The consent scripts (`wp-consent-api.js`, `googlesitekit-consent.js`) have been replaced with no-op versions since there are no cookies or trackers to consent to.

**Affected pages:** All pages (banner typically appeared on first visit only).

---

## 3. Page Loader Animation Timing

**Live site:** The LoftLoader page loading animation is timed based on WordPress backend response timing and `DOMContentLoaded` events from the full WordPress stack.

**Offline mirror:** The LoftLoader animation is preserved (`loftloader.js` is self-hosted), but its timing may differ slightly because the local Node.js server responds faster than the WordPress backend. The loader may appear for a shorter duration or feel snappier.

**Affected pages:** All pages that use the LoftLoader overlay.

---

## 4. Form Submission Feedback

**Live site:** Submitting the contact or careers form triggers server-side validation via Gravity Forms, processes the submission, and shows a success/error message from the WordPress backend.

**Offline mirror:** Form submission immediately returns a generic offline confirmation message:

> "Thank you for your message. This is an offline version -- form submissions are not processed."

The confirmation message styling matches Gravity Forms' `.gform_confirmation_message` class, so the visual presentation is consistent, but the message content differs.

**Affected pages:** `/contact-us/`, `/careers/`

---

## 5. Font Rendering Differences

**Live site:** Google Fonts (Playfair Display) are loaded from `fonts.googleapis.com` with optimal format negotiation based on the browser's capabilities (WOFF2, WOFF, TTF).

**Offline mirror:** Playfair Display fonts are self-hosted with WOFF2 and TTF variants. Most modern browsers will use WOFF2 and render identically. However:

- Some weight variants only have TTF available (not WOFF2), which may result in slightly different font hinting or rendering on certain operating systems.
- Font loading behavior differs: self-hosted fonts are served immediately from localhost rather than being fetched from Google's CDN with its font-display optimizations.
- A brief FOUT (Flash of Unstyled Text) may occur differently than on the live site.

**Affected pages:** All pages (Playfair Display is used for headings site-wide).

---

## 6. No Cloudflare Challenge Screen

**Live site:** First-time visitors or visitors flagged by Cloudflare's bot detection may see a brief "Checking your browser" interstitial challenge page before the actual site content loads.

**Offline mirror:** No Cloudflare challenge screen is ever shown. The site loads directly without any bot detection or browser verification step.

**Affected pages:** N/A (was a pre-page interstitial, not part of any specific page).

---

## 7. No Speculation/Prefetch Behavior

**Live site:** The Speculation Rules API script enables the browser to prefetch or prerender linked pages in the background, making subsequent navigation feel instant.

**Offline mirror:** Speculation Rules have been removed. Navigation between pages uses standard browser loading. Since all assets are served from localhost, the performance impact is negligible, but the prefetch/prerender behavior is absent.

**Affected pages:** All pages (affects perceived navigation speed between pages).

---

## 8. External Embed Differences

**Live site:** Some pages may load external content via iframes or embeds (e.g., YouTube videos, Google Maps, social media feeds).

**Offline mirror:** Any external embeds that were present in the captured HTML will attempt to load from their external sources. If the user is offline, these embeds will show as broken or empty frames. This is expected behavior for a self-hosted mirror.

**Affected pages:** Project case studies that may contain video embeds.

---

## Summary Table

| Difference | Severity | Pages Affected | User Impact |
|-----------|----------|----------------|-------------|
| reCAPTCHA badge removed | None | All | Cleaner UI, no floating badge |
| Cookie consent banner removed | None | All | No interruption on first visit |
| Page loader timing | Minimal | All | Faster perceived load |
| Form submission message | Low | Contact, Careers | Different confirmation text |
| Font rendering | Minimal | All | Negligible on modern browsers |
| No Cloudflare challenge | None | All | No bot check interstitial |
| No speculation/prefetch | Minimal | All | Negligible on localhost |
| External embeds | Low | Select case studies | May show blank if offline |
