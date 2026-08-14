import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '../types/site-config.types';

export class AboutPage extends BasePage {
  readonly mainHeading: Locator;
  readonly bodyContent: Locator;
  readonly ctaButtons: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.mainHeading = page.locator('h1').first();
    this.bodyContent = page.locator('main, [class*="content"], article').first();
    this.ctaButtons = page.locator(
      'a:has-text("Contact"), a:has-text("Learn More"), a:has-text("Get In Touch")'
    );
  }

  async navigateTo(): Promise<void> {
    await this.page.goto(`${this.url}/about/`, { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }

  async getBodyText(): Promise<string> {
    const text = await this.bodyContent.textContent();
    return (text ?? '').trim();
  }
}
