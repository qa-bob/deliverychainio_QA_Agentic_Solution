---
paths:
  - "src/pages/**/*.ts"
---

# Page Object Rules

These rules apply whenever Claude is working on files in `src/pages/`.

## Required class structure

Every page object must:

1. `import { Page, Locator } from '@playwright/test'`
2. `import { BasePage } from './base.page'`
3. `import type { SiteConfig } from '@types/site-config.types'`
4. Extend `BasePage`
5. Declare all key elements as `readonly Locator` properties
6. Pass `page` and `config` to `super(page, config)` in the constructor

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@types/site-config.types';

export class ExamplePage extends BasePage {
  readonly heading: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading = page.locator('h1').first();
    this.ctaButton = page.getByRole('link', { name: /learn more/i }).first();
  }

  async navigateTo(): Promise<void> {
    await this.page.goto(`${this.url}/example/`, { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }
}
```

## Forbidden in page objects

- `expect()` from `@playwright/test` — zero assertions inside page objects
- `page.waitForTimeout()` — use `waitForSelector` or `waitForLoadState`
- Hardcoded URLs like `'https://deliverychain.io/...'` — use `this.url`
- Methods that return boolean assertion results — methods are actions, not assertions

## Locator selector priority

Use in this order:

1. `page.getByRole('button', { name: '...' })` — most accessible and resilient
2. `page.getByText('...')` — good for unique text
3. `page.getByLabel('...')` — for form fields
4. `page.getByPlaceholder('...')` — for inputs without visible labels
5. `page.locator('[class*="keyword"]')` — partial class for dynamic names
6. `page.locator('[data-testid="..."]')` — if site has test IDs

Avoid: `page.locator('.wp-block-23f5 > span:nth-child(2)')` — brittle

## Methods that return data

When a method returns data (not performing an action), clearly type the return:

```typescript
async getNavLinks(): Promise<{ text: string; href: string }[]> {
  const links = await this.page.locator('nav a[href]').all();
  return Promise.all(
    links.map(async (link) => ({
      text: (await link.textContent()) ?? '',
      href: (await link.getAttribute('href')) ?? '',
    }))
  );
}
```

## After adding a new page class

Register it in `src/fixtures/site.fixture.ts` so tests can use it as a fixture.
