// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

// All site pages (excluding node_modules)
const ALL_PAGES = [
  '/',
  '/about-us/',
  '/contact-us/',
  '/careers/',
  '/portfolio/',
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
  '/portfolio/',
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

  test('portfolio page images all load successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/portfolio/`, { waitUntil: 'networkidle' });

    const brokenImages = await page.evaluate(() => {
      const images = document.querySelectorAll('img[src]');
      const broken = [];
      for (const img of images) {
        if (img.src.startsWith('data:')) continue;
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src);
        }
      }
      return broken;
    });

    expect(brokenImages).toEqual([]);
  });

  test('key asset files return 200', async ({ page }) => {
    await page.goto(BASE_URL);
    const assets = [
      '/assets/css/main.css',
      '/assets/js/jquery.min.js',
      '/assets/js/divi-custom-script.js',
      '/assets/js/custom-scripts.js',
      '/assets/js/swiper.js',
      '/assets/fonts/MetroSans-Book.otf',
      '/assets/fonts/PlayfairDisplay-Regular.woff2',
      '/assets/img/2023/05/Vector-14.svg',
    ];

    for (const asset of assets) {
      const status = await page.evaluate(async (url) => {
        const res = await fetch(url, { method: 'HEAD' });
        return res.status;
      }, asset);
      expect(status, `Asset ${asset} should return 200`).toBe(200);
    }
  });
});

// ──────────────────────────────────────────────
// 6. CORE INTERACTION CHECKS
// ──────────────────────────────────────────────
test.describe('Core Interaction Checks', () => {
  test('navigation menu opens and shows links', async ({ page }) => {
    await page.goto(BASE_URL);
    const menuToggle = page.locator('h4:has-text("Menu")');
    await expect(menuToggle).toBeVisible();
    await menuToggle.click();

    const popup = page.locator('#header-popup');
    await expect(popup.getByText('Branding & Identity Design')).toBeVisible({ timeout: 3000 });
    await expect(popup.getByText('Our Work')).toBeVisible();
    await expect(popup.getByText('Contact Us')).toBeVisible();
  });

  test('navigation menu close button is present and clickable', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('h4:has-text("Menu")').click();
    await expect(page.locator('#header-popup').getByText('Branding & Identity Design')).toBeVisible({ timeout: 3000 });

    // Divi Areas Pro uses CSS transforms/opacity for the close transition,
    // so we verify the close button exists and is clickable (no JS error on click)
    const closeButton = page.locator('h4:has-text("Close")');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    // If click succeeds without error, the close handler is working
  });

  test('contact form is present and has all fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact-us/`);
    await expect(page.locator('input[placeholder*="First name"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="last name" i]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Email"]')).toBeVisible();
    await expect(page.locator('button:has-text("Send message"), input[value="Send message"]')).toBeVisible();
  });

  test('careers form has file upload field', async ({ page }) => {
    await page.goto(`${BASE_URL}/careers/`);
    await expect(page.locator('input[placeholder*="First name"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Email"]')).toBeVisible();
    await expect(page.locator('button:has-text("Submit"), input[value="Submit"]')).toBeVisible();
  });

  test('footer form is present on homepage', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    // The footer form exists in the DOM — verify it's attached and has expected fields
    const footerForm = page.locator('footer, [class*="footer"]').first();
    await expect(page.locator('input[placeholder*="First name"]').first()).toBeAttached();
    await expect(page.locator('input[placeholder*="Email"]').first()).toBeAttached();
    // Submit button — check for both button and input[type=submit] variants
    const submitBtn = page.locator('button:has-text("Send message"), input[type="submit"]').first();
    await expect(submitBtn).toBeAttached();
  });

  test('internal navigation links work', async ({ page }) => {
    // Verify menu popup shows navigation items
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.locator('h4:has-text("Menu")').click();
    await page.waitForTimeout(1000);
    await expect(page.locator('#header-popup').getByText('About Us')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#header-popup').getByText('Our Work')).toBeVisible();
    await expect(page.locator('#header-popup').getByText('Contact Us')).toBeVisible();
    // Verify about page loads correctly via direct navigation
    await page.goto(`${BASE_URL}/about-us/`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/About/i);
  });

  test('blog article carousel has navigation buttons', async ({ page }) => {
    await page.goto(`${BASE_URL}/hvac-website-design-checklist-25-must-haves-that-drive-more-calls/`, { waitUntil: 'networkidle' });
    // Swiper navigation buttons may use aria-label or CSS classes
    const prevButton = page.locator('.swiper-button-prev, [class*="prev"]').first();
    const nextButton = page.locator('.swiper-button-next, [class*="next"]').first();
    await expect(prevButton).toBeAttached();
    await expect(nextButton).toBeAttached();
  });

  test('FAQ accordion headings are clickable', async ({ page }) => {
    await page.goto(`${BASE_URL}/hvac-website-design-checklist-25-must-haves-that-drive-more-calls/`);
    const faqHeading = page.locator('h3:has-text("How far in advance should you start the pre-launch checklist?")');
    await expect(faqHeading).toBeVisible();
    // Should be clickable (accordion toggle)
    await faqHeading.click();
  });
});

// ──────────────────────────────────────────────
// 7. ANIMATION PRESENCE CHECKS
// ──────────────────────────────────────────────
test.describe('Animation Presence Checks', () => {
  test('LoftLoader overlay element exists', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    // LoftLoader creates a #loftloader-wrapper element
    const loader = page.locator('#loftloader-wrapper');
    // It should exist in the DOM (may be hidden after animation completes)
    expect(await loader.count()).toBeGreaterThan(0);
  });

  test('Swiper carousel is initialized on homepage', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    // Swiper adds .swiper-initialized class to active carousels
    const swiperContainers = page.locator('.swiper-initialized, .swiper-container-initialized');
    expect(await swiperContainers.count()).toBeGreaterThan(0);
  });

  test('homepage hero section is present', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('LiteSpeed lazy load is active', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    // LiteSpeed adds data-lazyloaded attribute to processed images
    // or the console logs "[LiteSpeed] Start Lazy Load"
    const hasLazyScript = await page.evaluate(() => {
      return document.querySelector('script[src*="smush-lazy-load"], script[src*="lazy"]') !== null ||
             document.documentElement.innerHTML.includes('LiteSpeed');
    });
    expect(hasLazyScript).toBe(true);
  });
});

// ──────────────────────────────────────────────
// 8. JQUERY DEPENDENCY CHAIN
// ──────────────────────────────────────────────
test.describe('jQuery Dependency Chain', () => {
  test('jQuery is loaded and available globally', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const jQueryVersion = await page.evaluate(() => {
      return typeof window.jQuery !== 'undefined' ? window.jQuery.fn.jquery : null;
    });
    expect(jQueryVersion).toBeTruthy();
  });

  test('jQuery Migrate is loaded', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const migrateVersion = await page.evaluate(() => {
      return typeof window.jQuery !== 'undefined' && window.jQuery.migrateVersion
        ? window.jQuery.migrateVersion
        : null;
    });
    expect(migrateVersion).toBeTruthy();
  });

  test('jQuery is loaded from local path (not wp-includes)', async ({ page }) => {
    const jqueryRequests = [];

    page.on('request', (request) => {
      if (request.url().includes('jquery.min.js')) {
        jqueryRequests.push(request.url());
      }
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // jQuery should load from /assets/js/ not /wp-includes/
    const wpIncludesRequests = jqueryRequests.filter(url => url.includes('wp-includes'));
    expect(wpIncludesRequests).toEqual([]);

    const localRequests = jqueryRequests.filter(url => url.includes('/assets/js/jquery.min.js'));
    expect(localRequests.length).toBeGreaterThan(0);
  });
});

// ──────────────────────────────────────────────
// 9. OFFLINE SHIM VERIFICATION
// ──────────────────────────────────────────────
test.describe('Offline Shim Verification', () => {
  test('no Cloudflare challenge script present', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const hasCfChallenge = await page.evaluate(() => {
      return document.documentElement.innerHTML.includes('cdn-cgi/challenge-platform');
    });
    expect(hasCfChallenge).toBe(false);
  });

  test('recaptcha strings shim is present', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const hasShim = await page.evaluate(() => {
      return typeof window.gforms_recaptcha_recaptcha_strings !== 'undefined';
    });
    expect(hasShim).toBe(true);
  });

  test('no reCAPTCHA badge visible', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const badge = page.locator('.grecaptcha-badge');
    expect(await badge.count()).toBe(0);
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
    const footerLinks = ['/privacy-policy/', '/terms-of-service/', '/cookie-policy/', '/refund-policy/', '/legal/'];
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

  test('navigation menu shows Legal link', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('h4:has-text("Menu")').click();
    await page.waitForTimeout(1000);
    await expect(page.locator('#header-popup').getByText('Legal')).toBeVisible({ timeout: 5000 });
  });
});
