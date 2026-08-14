import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '../types/site-config.types';

export class SolutionsPage extends BasePage {
  readonly heroHeading: Locator;
  readonly featureCards: Locator;
  readonly featureHeadings: Locator;
  readonly ctaButtons: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heroHeading = page.locator('h1, h2').first();
    this.featureCards = page.locator('[class*="feature"], [class*="solution"], [class*="card"]');
    this.featureHeadings = page.locator('h2, h3').filter({ hasNotText: /^$/ });
    this.ctaButtons = page.locator(
      'a:has-text("Learn More"), a:has-text("Find Out More"), a:has-text("Get Started")'
    );
  }

  async navigateTo(): Promise<void> {
    await this.page.goto(`${this.url}/solutions/`, { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }

  async getFeatureCount(): Promise<number> {
    return this.featureCards.count();
  }

  async getHeadingTexts(): Promise<string[]> {
    const headings = await this.featureHeadings.all();
    const texts = await Promise.all(headings.map((h) => h.textContent()));
    return texts
      .map((t) => (t ?? '').trim())
      .filter((t) => t.length > 0);
  }
}
