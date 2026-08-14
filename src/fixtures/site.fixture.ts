/**
 * src/fixtures/site.fixture.ts
 *
 * Extends Playwright's base `test` with pre-constructed page objects and the
 * loaded site config.  All test files should import {test, expect} from here
 * instead of from '@playwright/test' directly.
 *
 * Usage in test files:
 *   import { test, expect } from '@fixtures/site.fixture';
 */

import { test as base, expect } from '@playwright/test';
import { loadSiteConfig, type SiteConfig } from '../types/site-config.types';
import { HomePage } from '@pages/home.page';
import { NavigationPage } from '@pages/navigation.page';
import { ContactFormPage } from '@pages/contact.page';
import { SolutionsPage } from '@pages/solutions.page';
import { AboutPage } from '@pages/about.page';
import { NewsletterPage } from '@pages/newsletter.page';

// ── Fixture type definitions ─────────────────────────────────────────────────

export interface Fixtures {
  /** Fully resolved site configuration loaded from site.config.json */
  siteConfig: SiteConfig;
  /** Pre-navigated HomePage page object */
  homePage: HomePage;
  /** NavigationPage page object (does not auto-navigate) */
  navigationPage: NavigationPage;
  /** ContactFormPage page object (does not auto-navigate) */
  contactPage: ContactFormPage;
  /** SolutionsPage page object (does not auto-navigate) */
  solutionsPage: SolutionsPage;
  /** AboutPage page object (does not auto-navigate) */
  aboutPage: AboutPage;
  /** NewsletterPage page object (does not auto-navigate) */
  newsletterPage: NewsletterPage;
}

// ── Extended test object ─────────────────────────────────────────────────────

export const test = base.extend<Fixtures>({
  /**
   * siteConfig — loaded once per worker from site.config.json.
   * Shared across all fixtures in the same test.
   */
  siteConfig: async ({}, use) => {
    const config = loadSiteConfig();
    await use(config);
  },

  /**
   * homePage — constructs HomePage and navigates to the site root.
   * Waits for domcontentloaded before handing control to the test.
   */
  homePage: async ({ page, siteConfig }, use) => {
    const homePage = new HomePage(page, siteConfig);
    await homePage.navigate();
    await use(homePage);
  },

  /**
   * navigationPage — constructs NavigationPage without navigating.
   * Tests that need to be on a specific page should call navigate() themselves.
   */
  navigationPage: async ({ page, siteConfig }, use) => {
    const navigationPage = new NavigationPage(page, siteConfig);
    await use(navigationPage);
  },

  /**
   * contactPage — constructs ContactFormPage without navigating.
   * Tests should navigate to the appropriate page first.
   */
  contactPage: async ({ page, siteConfig }, use) => {
    const contactPage = new ContactFormPage(page, siteConfig);
    await use(contactPage);
  },

  /**
   * solutionsPage — constructs SolutionsPage without navigating.
   */
  solutionsPage: async ({ page, siteConfig }, use) => {
    const solutionsPage = new SolutionsPage(page, siteConfig);
    await use(solutionsPage);
  },

  /**
   * aboutPage — constructs AboutPage without navigating.
   */
  aboutPage: async ({ page, siteConfig }, use) => {
    const aboutPage = new AboutPage(page, siteConfig);
    await use(aboutPage);
  },

  /**
   * newsletterPage — constructs NewsletterPage without navigating.
   */
  newsletterPage: async ({ page, siteConfig }, use) => {
    const newsletterPage = new NewsletterPage(page, siteConfig);
    await use(newsletterPage);
  },
});

// Re-export expect so tests only need one import source
export { expect };
