import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '../types/site-config.types';

export class NewsletterPage extends BasePage {
  readonly newsletterForm: Locator;
  readonly nameField: Locator;
  readonly emailField: Locator;
  readonly submitButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    // Newsletter form — typically in footer or a dedicated section
    this.newsletterForm = page.locator(
      'form:has(input[type="email"]):not([action*="contact"])'
    ).first();
    this.nameField = page.locator(
      'input[name*="name" i][type="text"], input[placeholder*="name" i]'
    ).first();
    this.emailField = page.locator(
      'input[type="email"], input[name*="email" i]'
    ).first();
    this.submitButton = page.locator(
      'form button[type="submit"], form input[type="submit"], form button:not([type="button"]):not([type="reset"])'
    ).first();
  }

  async isNewsletterFormVisible(): Promise<boolean> {
    return this.newsletterForm.isVisible().catch(() => false);
  }

  async hasNameField(): Promise<boolean> {
    return (await this.nameField.count()) > 0;
  }

  async hasEmailField(): Promise<boolean> {
    return (await this.emailField.count()) > 0;
  }

  async hasSubmitButton(): Promise<boolean> {
    return (await this.submitButton.count()) > 0;
  }

  async fillName(value: string): Promise<void> {
    await this.nameField.fill(value);
  }

  async fillEmail(value: string): Promise<void> {
    await this.emailField.fill(value);
  }

  async clearForm(): Promise<void> {
    if (await this.nameField.count() > 0) {
      await this.nameField.clear();
    }
    if (await this.emailField.count() > 0) {
      await this.emailField.clear();
    }
  }
}
