# Contributing to DeliveryChain.io QA Suite

Thank you for contributing. This document describes the rules, conventions, and workflow for adding or updating tests in this repository.

---

## Golden Rules

1. **Never submit a form.** This suite tests a live production website. Only interact with form fields — never click submit.
2. **Never create accounts or enter real credentials.**
3. **Never hardcode URLs.** Always use `siteConfig.url` or Playwright's `baseURL`.
4. **No assertions inside page objects.** Page objects model user actions; `expect()` calls belong in tests.
5. **No `page.waitForTimeout()`.** Use Playwright's built-in auto-waiting or `waitForSelector`.

---

## Development Setup

See [README.md](../README.md#development-environment-setup) for the full setup guide.

Quick start:

```bash
npm install
npx playwright install --with-deps chromium
npm run typecheck   # must pass before opening a PR
npm run test:smoke  # confirm the suite runs
```

---

## Workflow

### 1. Create a branch

```bash
git checkout -b test/your-feature-name
```

Branch naming: `feat/`, `fix/`, `test/`, `docs/`, `ci/`

### 2. Read `site.config.json` and the live site before writing selectors

```bash
# In Claude Code
/analyze-site
```

Or use `WebFetch` to inspect the page HTML directly before writing any locator.

### 3. Write or update the page object

Add new locators and methods to the appropriate class in `src/pages/`. If there is no class for the page yet, create one by extending `BasePage`.

```typescript
// src/pages/my-page.page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@types/site-config.types';

export class MyPage extends BasePage {
  readonly heading: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading = page.locator('h1').first();
  }

  async navigateTo(): Promise<void> {
    await this.page.goto(`${this.url}/my-path/`, { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }
}
```

### 4. Register the page object in fixtures

Add your new page object to `src/fixtures/site.fixture.ts` so tests can access it.

### 5. Write tests

```typescript
import { test, expect } from '@fixtures/site.fixture';

test.describe('My Feature @functional', () => {
  test.beforeEach(async ({ myPage }) => {
    await myPage.navigateTo();
  });

  test('heading is visible @functional', async ({ myPage }) => {
    await expect(myPage.heading).toBeVisible();
  });
});
```

Tag rules:

| Tag | When to use |
|-----|-------------|
| `@smoke` | Site loads, no errors |
| `@navigation` | Nav links, menus, routing |
| `@forms` | Form fields, validation |
| `@functional` | Business logic, user interactions |
| `@visual` | Screenshot regression |
| `@responsive` | Layout at mobile/tablet/desktop |

### 6. Verify before pushing

```bash
npm run typecheck   # zero TypeScript errors
npm run lint        # zero ESLint errors
npm run test:smoke  # smoke suite passes
```

### 7. Open a pull request

Use the [pull request template](pull_request_template.md). Describe what pages or features you tested and why the tests are meaningful.

---

## Code Style

- TypeScript strict mode is enabled — no implicit `any`
- Locators are `readonly Locator` on page object classes
- Use `async/await` throughout — no `.then()` chains
- Selectors: prefer `getByRole`, `getByText`, `getByLabel` over CSS selectors when possible; fall back to `[class*="..."]` patterns for dynamic class names
- One `describe` block per page or feature area

---

## What Not to Submit

- Tests that submit forms or click submit buttons
- Tests that require a logged-in account
- Hardcoded selectors that break when class names change (`div.wp-block-23f5 > span:nth-child(2)`)
- Tests marked `.only` — these block all other tests in CI
- Committed `playwright-report/`, `test-results/`, or `__snapshots__/` directories
- `.env` files with real credentials

---

## Questions

Open a [GitHub Issue](ISSUE_TEMPLATE/feature_request.md) or start a Claude Code session with `/analyze-site` to understand the current site structure.
