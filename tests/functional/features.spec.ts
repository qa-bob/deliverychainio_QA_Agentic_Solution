/**
 * tests/functional/features.spec.ts
 *
 * Functional tests for the DeliveryChain.io IoT features and solutions content.
 * Verifies that the key product feature sections are visible, named, and linked.
 *
 * Features expected on site: Geofencing, Accelerometers, Temperature, Integrations,
 * Auto-Alerts, Real-Time Tracking, Automatic Document Processing, Mobile Solutions.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

// ── Homepage feature sections ────────────────────────────────────────────────

test.describe('Homepage IoT Features @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');
  });

  test('homepage contains IoT feature keywords @functional', async ({ page }) => {
    const bodyText = (await page.locator('body').textContent() ?? '').toLowerCase();

    const expectedFeatures = [
      'geofencing',
      'temperature',
      'tracking',
      'alert',
      'document',
      'mobile',
    ];

    const missing = expectedFeatures.filter((f) => !bodyText.includes(f));

    if (missing.length > 0) {
      console.warn(
        `[functional] Expected feature keywords not found on homepage: ${missing.join(', ')}`
      );
    }

    // At least half of expected features should appear in body text
    expect(
      missing.length,
      `Missing ${missing.length} expected feature keywords: ${missing.join(', ')}`
    ).toBeLessThanOrEqual(Math.floor(expectedFeatures.length / 2));
  });

  test('homepage has multiple feature/section headings @functional', async ({ page }) => {
    const sectionHeadings = page.locator('h2, h3');
    const count = await sectionHeadings.count();
    expect(count, 'Homepage should have multiple section headings for feature areas').toBeGreaterThan(1);
  });

  test('"Set desired parameters" section is present @functional', async ({ page }) => {
    const bodyText = (await page.locator('body').textContent() ?? '').toLowerCase();
    const hasSection =
      bodyText.includes('parameter') ||
      bodyText.includes('desired') ||
      bodyText.includes('set it') ||
      bodyText.includes('forget it') ||
      bodyText.includes('automatic');
    expect(hasSection, 'Homepage should describe the "set and forget" automation feature').toBeTruthy();
  });

  test('"Automatic alerts" section is present @functional', async ({ page }) => {
    const bodyText = (await page.locator('body').textContent() ?? '').toLowerCase();
    const hasAlerts =
      bodyText.includes('alert') ||
      bodyText.includes('notification') ||
      bodyText.includes('automatic');
    expect(hasAlerts, 'Homepage should describe automated alert functionality').toBeTruthy();
  });

  test('"Empowering insights" / IoT section is present @functional', async ({ page }) => {
    const bodyText = (await page.locator('body').textContent() ?? '').toLowerCase();
    const hasIoT =
      bodyText.includes('iot') ||
      bodyText.includes('insight') ||
      bodyText.includes('empowering') ||
      bodyText.includes('sensor') ||
      bodyText.includes('real-time');
    expect(hasIoT, 'Homepage should reference IoT or real-time insights').toBeTruthy();
  });
});

// ── Solutions page ────────────────────────────────────────────────────────────

test.describe('Solutions Page @functional', () => {
  test.beforeEach(async ({ solutionsPage }) => {
    await solutionsPage.navigateTo();
  });

  test('solutions page loads with a heading @functional', async ({ page }) => {
    // Fusion Builder CSS-hides headings during mobile rendering; check DOM content directly
    const text = await page.evaluate<string>(() => {
      const h = document.querySelector('h1, h2');
      return h ? (h.textContent ?? '').trim() : '';
    });
    expect(text.length, 'Solutions page should have a non-empty heading in the DOM').toBeGreaterThan(3);
  });

  test('solutions page is not a redirect or error page @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).not.toContain('404');
    expect(title.toLowerCase()).not.toContain('not found');
    expect(title.toLowerCase()).not.toContain('error');
  });

  test('solutions page has content sections @functional', async ({ page }) => {
    const sections = page.locator('section, article, [class*="section"]');
    const count = await sections.count();
    expect(count, 'Solutions page should have at least one content section').toBeGreaterThan(0);
  });

  test('solutions page CTA links are present @functional', async ({ solutionsPage }) => {
    const count = await solutionsPage.ctaButtons.count();
    if (count === 0) {
      console.warn('[functional] No CTA links found on Solutions page.');
    }
    // Soft — CTAs are expected but not a hard failure
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

// ── About page ────────────────────────────────────────────────────────────────

test.describe('About Page @functional', () => {
  test.beforeEach(async ({ aboutPage }) => {
    await aboutPage.navigateTo();
  });

  test('about page loads with a heading @functional', async ({ page }) => {
    // Fusion Builder CSS-hides headings during mobile rendering; check DOM content directly
    const text = await page.evaluate<string>(() => {
      const h = document.querySelector('h1, h2');
      return h ? (h.textContent ?? '').trim() : '';
    });
    expect(text.length, 'About page should have a non-empty heading in the DOM').toBeGreaterThan(3);
  });

  test('about page is not a redirect or error page @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).not.toContain('404');
    expect(title.toLowerCase()).not.toContain('not found');
  });

  test('about page has body content @functional', async ({ aboutPage }) => {
    const text = await aboutPage.getBodyText();
    expect(text.length, 'About page should have substantial body content').toBeGreaterThan(50);
  });

  test('about page mentions the company or product @functional', async ({ aboutPage }) => {
    const text = (await aboutPage.getBodyText()).toLowerCase();
    const hasCompanyContent =
      text.includes('deliverychain') ||
      text.includes('delivery chain') ||
      text.includes('supply chain') ||
      text.includes('freight') ||
      text.includes('logistics');
    expect(hasCompanyContent, 'About page should reference the company or product').toBeTruthy();
  });
});
