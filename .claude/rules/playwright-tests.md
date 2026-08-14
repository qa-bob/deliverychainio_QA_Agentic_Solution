---
paths:
  - "tests/**/*.spec.ts"
  - "tests/**/*.test.ts"
---

# Playwright Test Rules

These rules apply whenever Claude is working on files in `tests/`.

## Required imports

```typescript
import { test, expect } from '@fixtures/site.fixture';
```

Never import from `@playwright/test` directly in test files — always use the project fixture.

## Test tagging

Every `test()` call must include at least one tag in the test name:
- `@smoke` — availability and basic load checks
- `@navigation` — nav links, routing, menus
- `@forms` — form fields and validation (no submission)
- `@functional` — business features and user interactions
- `@visual` — screenshot regression
- `@responsive` — layout at different viewport sizes

## Structure

```typescript
test.describe('Feature Name @category', () => {
  test.beforeEach(async ({ pageFixture }) => {
    await pageFixture.navigateTo();
  });

  test('specific behavior @category', async ({ pageFixture }) => {
    await expect(pageFixture.someLocator).toBeVisible();
  });
});
```

## Forbidden patterns

- `page.waitForTimeout(n)` with any n > 0 — use Playwright auto-waiting
- `page.locator('.class > div:nth-child(2)')` — fragile; use semantic selectors
- `test.only()` — blocks all other tests in CI
- Any `expect()` call inside a page object import — assertions belong in tests
- Raw `page.locator()` calls in test bodies — all selectors belong in page objects

## URL handling

```typescript
// Correct
await page.goto(siteConfig.url + '/solutions/', { waitUntil: 'domcontentloaded' });

// Wrong — never hardcode
await page.goto('https://deliverychain.io/solutions/');
```

## Error handling

Use soft assertions for non-critical site quality checks:

```typescript
// Hard assertion — test fails if this is wrong
await expect(navMenu).toBeVisible();

// Soft warning — logs but does not fail the test
if (!(await metaDescription)) {
  console.warn('[smoke] Missing meta description — affects SEO');
}
```
