# GitHub Copilot Instructions — DeliveryChain.io QA Suite

These instructions apply to all AI coding assistants (GitHub Copilot, Claude Code, Cursor, Windsurf) working in this repository.

---

## Project Context

This repository is a **Playwright + TypeScript regression test suite** for [DeliveryChain.io](https://deliverychain.io) — a supply chain intelligence SaaS. Tests run against the live production website without login or form submission.

The target site has:
- Navigation: Home, About, Solutions, Blog, Contact Us
- Key content: Supply chain IoT features (Geofencing, Temperature, Accelerometers, Real-Time Tracking, Auto-Alerts, Integrations, Document Processing, Mobile Solutions)
- Newsletter signup form (name + email fields)
- Contact page at `/contact-us/`

---

## Architecture

- **Framework**: Playwright `^1.44`, TypeScript strict mode
- **Pattern**: Page Object Model (POM) — all selectors live in `src/pages/`, never in test bodies
- **OOP**: All page classes extend `BasePage` from `src/pages/base.page.ts`
- **Fixtures**: Tests receive page objects via `src/fixtures/site.fixture.ts` — import `{ test, expect }` from there, not from `@playwright/test`
- **Config**: `site.config.json` drives the base URL and feature flags

---

## Rules

### Page Objects

- Extend `BasePage`: `export class MyPage extends BasePage {`
- Locators are `readonly Locator` properties set in the constructor
- Methods model user actions and return `Promise<void>` — no `expect()` inside
- Constructor signature: `constructor(page: Page, config: SiteConfig)`

### Tests

- Tag every test: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, or `@responsive`
- Import from fixture: `import { test, expect } from '@fixtures/site.fixture'`
- URL: `siteConfig.url` from the fixture — never a string literal like `'https://deliverychain.io'`
- No form submission — test field presence and validation only
- No `page.waitForTimeout()` — use Playwright auto-waiting or `waitForSelector`
- No `any` type — add an explicit comment if unavoidable

### TypeScript

- Strict mode is enabled — no implicit `any`, no non-null assertions without justification
- Path aliases: `@pages/`, `@utils/`, `@types/`, `@fixtures/` (configured in `tsconfig.json`)
- Always run `npx tsc --noEmit` before finishing work

### Selectors

Prefer in this order:
1. `getByRole()` — most resilient
2. `getByText()`, `getByLabel()`, `getByPlaceholder()`
3. `[data-testid="..."]` — if the site has test IDs
4. `[class*="keyword"]` — partial class match for dynamic class names
5. Avoid brittle nth-child or deeply nested CSS selectors

---

## File Conventions

| New file type | Location | Naming |
|--------------|----------|--------|
| Page object | `src/pages/` | `<name>.page.ts` |
| Test spec | `tests/<category>/` | `<feature>.spec.ts` |
| Utility | `src/utils/` | `<name>.ts` |
| Type interface | `src/types/` | `<name>.types.ts` |

---

## What NOT to Do

- Submit forms (`click()` on submit buttons)
- Create accounts or authenticate
- Hardcode `https://deliverychain.io` in test bodies
- Use `page.waitForTimeout(n)` with n > 0
- Put `expect()` inside page object methods
- Use `.only` on tests
- Commit `playwright-report/`, `test-results/`, or `__snapshots__/`
- Use `any` type without an explicit `// eslint-disable` comment

---

## Running Tests

```bash
npm test                    # all tests
npm run test:smoke          # smoke only
npm run test:navigation     # navigation only
npm run test:forms          # forms only
npm run typecheck           # TypeScript check (required before PR)
npm run lint                # ESLint
```

---

## When Selectors Break

1. Run `/analyze-site` in Claude Code to re-crawl the live site
2. Inspect the live page HTML (DevTools → Elements)
3. Update the locator in the page object class
4. Do not update the test body — keep selectors in page objects

---

## Claude Code Slash Commands

These project skills are available in Claude Code sessions:

| Command | What it does |
|---------|-------------|
| `/analyze-site` | Re-crawl site, update `site.config.json` |
| `/generate-full-suite` | Regenerate all POM classes and test files |
| `/run-smoke` | Run smoke tests, show pass/fail table |
| `/update-baseline` | Refresh visual regression snapshots |
| `/generate-report` | Display formatted test results |
