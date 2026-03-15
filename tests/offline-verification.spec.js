// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

// All site pages (excluding node_modules)
const ALL_PAGES = [
  '/',
  '/about-us/',
  '/contact-us/',
  '/careers/',
  '/privacy-policy/',
  // Legal & policy pages
  '/legal/',
  '/terms-of-service/',
  '/refund-policy/',
  '/cancellation-policy/',
  '/billing-policy/',
  '/acceptable-use-policy/',
  '/cookie-policy/',
  '/disclaimer/',
  '/fulfillment-policy/',
  '/support-policy/',
  '/complaint-resolution/',
  '/data-request/',
  '/accessibility/',
  '/intellectual-property/',
  '/dmca/',
  '/security/',
  '/communication-policy/',
  // Blog articles
  '/top-web-design-agencies-worldwide-2026/',
  '/top-web-design-agencies-canada-2026/',
  '/best-web-development-agencies-canada/',
  '/canadas-top-graphic-design-agencies-to-know-in-2026/',
  '/why-your-website-should-make-people-feel-something/',
  '/why-your-hvac-website-isnt-converting-in-canada-and-how-to-fix-it/',
  '/hvac-website-design-checklist-25-must-haves-that-drive-more-calls/',
  '/hvac-website-copy-that-converts-what-to-say-and-where-to-say-it/',
  '/hvac-website-redesign-when-to-redesign-vs-patch-your-current-site/',
  '/hvac-service-pages-that-rank-how-to-structure-pages-for-each-service/',
  '/hvac-booking-quote-forms-the-highest-converting-layouts/',
  '/hvac-trust-signals-what-to-add-to-your-website-to-win-more-jobs/',
];

// Representative sample for deeper tests (mix of main, policy, and blog pages)
const SAMPLE_PAGES = [
  '/',
  '/about-us/',
  '/contact-us/',
  '/careers/',
  '/legal/',
  '/terms-of-service/',
  '/privacy-policy/',
  '/hvac-website-design-checklist-25-must-haves-that-drive-more-calls/',
];

// ──────────────────────────────────────────────
// 1. PAGE LOAD & TITLE VERIFICATION
// ──────────────────────────────────────────────
test.describe('Page Load Verification', () => {
  for (const pagePath of ALL_PAGES) {
    test(`${pagePath} returns 200 and has a title`, async ({ page }) => {
      const response = await page.goto(`${BASE_URL}${pagePath}`);
      expect(response.status()).toBe(200);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });
  }
});

// ──────────────────────────────────────────────
// 2. CONSOLE ERROR DETECTION
// ──────────────────────────────────────────────
test.describe('Console Error Detection', () => {
  for (const pagePath of SAMPLE_PAGES) {
    test(`${pagePath} has zero console errors`, async ({ page }) => {
      const errors = [];

      page.on('pageerror', (error) => {
        errors.push(error.message);
      });

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Ignore favicon 404 (browsers request this automatically)
          if (!text.includes('favicon.ico')) {
            errors.push(text);
          }
        }
      });

      await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: 'networkidle' });
      expect(errors).toEqual([]);
    });
  }
});

// ──────────────────────────────────────────────
// 3. NO FAILED NETWORK REQUESTS (404s)
// ──────────────────────────────────────────────
test.describe('No Failed Network Requests', () => {
  for (const pagePath of SAMPLE_PAGES) {
    test(`${pagePath} has zero 404 requests`, async ({ page }) => {
      const failedRequests = [];

      page.on('response', (response) => {
        if (response.status() === 404) {
          const url = response.url();
          // Ignore favicon (browsers auto-request it)
          if (!url.includes('favicon.ico')) {
            failedRequests.push(url);
          }
        }
      });

      await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: 'networkidle' });
      expect(failedRequests).toEqual([]);
    });
  }
});

// ──────────────────────────────────────────────
// 4. NO EXTERNAL ASSET DEPENDENCY
// ──────────────────────────────────────────────
test.describe('No External Asset Dependencies', () => {
  for (const pagePath of SAMPLE_PAGES) {
    test(`${pagePath} makes no external runtime requests`, async ({ page }) => {
      const externalRequests = [];

      page.on('request', (request) => {
        const url = request.url();
        if (
          !url.startsWith('http://localhost') &&
          !url.startsWith('data:') &&
          !url.startsWith('about:') &&
          !url.startsWith('blob:')
        ) {
          externalRequests.push(url);
        }
      });

      await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: 'networkidle' });

      // Social media links are <a> tags, not runtime asset requests,
      // so they should not appear. If any do, they are problematic.
      expect(externalRequests).toEqual([]);
    });
  }
});

// ──────────────────────────────────────────────
// 5. IMAGE LOAD VALIDATION
// ──────────────────────────────────────────────
test.describe('Image Load Validation', () => {
  test('homepage images all load successfully', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const brokenImages = await page.evaluate(() => {
      const images = document.querySelectorAll('img[src]');
      const broken = [];
      for (const img of images) {
        // Skip data: URIs and SVG inline
        if (img.src.startsWith('data:')) continue;
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    expect(brokenImages).toEqual([]);
  });
});

// ──────────────────────────────────────────────
// 6. CORE INTERACTION CHECKS
// ──────────────────────────────────────────────
test.describe('Core Interaction Checks', () => {
  test('navigation menu opens and shows links', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    const menuToggle = page.locator('.nav__toggle');
    await expect(menuToggle).toBeVisible();
    await menuToggle.click();

    const popup = page.locator('.nav__overlay');
    await expect(popup.getByText('About')).toBeVisible({ timeout: 3000 });
    await expect(popup.getByText('Careers')).toBeVisible();
    await expect(popup.getByText('Contact')).toBeVisible();
    await expect(popup.getByText('Login')).toBeVisible();
  });

  test('navigation menu close button is present and clickable', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.locator('.nav__toggle').click();
    await expect(page.locator('.nav__overlay').getByText('About')).toBeVisible({ timeout: 3000 });

    const closeButton = page.locator('.nav__overlay-close');
    await expect(closeButton).toBeVisible();
    await closeButton.click({ force: true });
  });
});



// ──────────────────────────────────────────────
// 10. COMPLIANCE & POLICY PAGE VERIFICATION
// ──────────────────────────────────────────────
const POLICY_PAGES = [
  '/legal/',
  '/terms-of-service/',
  '/refund-policy/',
  '/cancellation-policy/',
  '/billing-policy/',
  '/acceptable-use-policy/',
  '/cookie-policy/',
  '/disclaimer/',
  '/fulfillment-policy/',
  '/support-policy/',
  '/complaint-resolution/',
  '/data-request/',
  '/accessibility/',
  '/intellectual-property/',
  '/dmca/',
  '/security/',
  '/communication-policy/',
];

test.describe('Compliance & Policy Pages', () => {
  for (const pagePath of POLICY_PAGES) {
    test(`${pagePath} returns 200 and has correct branding`, async ({ page }) => {
      const response = await page.goto(`${BASE_URL}${pagePath}`);
      expect(response.status()).toBe(200);
      const title = await page.title();
      expect(title).toContain('Cylio');
    });
  }

  test('legal hub page links to all policy pages', async ({ page }) => {
    await page.goto(`${BASE_URL}/legal/`, { waitUntil: 'networkidle' });
    for (const policyPath of POLICY_PAGES) {
      if (policyPath === '/legal/') continue;
      const link = page.locator(`a[href="${policyPath}"]`);
      expect(await link.count(), `Legal hub should link to ${policyPath}`).toBeGreaterThan(0);
    }
    // Also check privacy policy link
    const privacyLink = page.locator('a[href="/privacy-policy/"]');
    expect(await privacyLink.count()).toBeGreaterThan(0);
  });

  test('footer has policy links on homepage', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const footerLinks = ['/privacy-policy/', '/terms-of-service/', '/cookie-policy/', '/legal/'];
    for (const link of footerLinks) {
      const el = page.locator(`a[href="${link}"]`);
      expect(await el.count(), `Footer should have link to ${link}`).toBeGreaterThan(0);
    }
  });

  test('footer has business contact info on homepage', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const html = await page.content();
    expect(html).toContain('support@cylio.io');
    expect(html).toContain('1910 Thomes Ave');
  });

});
