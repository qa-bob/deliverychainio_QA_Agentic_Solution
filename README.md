# DeliveryChain.io — Playwright QA Regression Suite

Automated GUI, functional, and regression test suite for [DeliveryChain.io](https://deliverychain.io) — a B2B supply chain intelligence platform. Built with **Playwright + TypeScript** using the **Page Object Model (POM)** and **OOP** design patterns, and structured for agentic execution via Claude Code.

---

## Table of Contents

- [Project Purpose](#project-purpose)
- [Architecture Overview](#architecture-overview)
- [Development Environment Setup](#development-environment-setup)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Test Categories](#test-categories)
- [Page Object Model](#page-object-model)
- [Claude Code Integration](#claude-code-integration)
- [Contribution Rules](#contribution-rules)
- [CI/CD](#cicd)

---

## Project Purpose

This repository maintains a comprehensive Playwright regression suite that verifies every discoverable feature of the DeliveryChain.io website. Tests cover:

- **Smoke** — site availability, HTTPS, load time, no console errors
- **Navigation** — nav links, routing, mobile menu, logo
- **Forms** — field presence, HTML5 validation, accessibility (no actual submission)
- **Functional** — business features: hero content, IoT feature sections, newsletter form, CTA buttons, footer
- **Visual** — screenshot regression baselines at desktop / tablet / mobile viewports
- **Responsive** — layout integrity, no horizontal overflow, readable font sizes

The suite runs against the live site without requiring account creation, login, or any form submission.

---

## Architecture Overview

```
Page Object Model (POM)
  └── BasePage (shared methods: navigate, waitForLoad, screenshot, console errors)
       ├── HomePage        (hero, CTAs, feature sections)
       ├── NavigationPage  (nav links, mobile toggle, logo)
       ├── ContactFormPage (contact form fields, validation)
       ├── SolutionsPage   (solutions / features page)
       ├── AboutPage       (about page content)
       └── NewsletterPage  (newsletter signup form)

Custom Fixtures
  └── site.fixture.ts — injects SiteConfig + page objects into every test

Config
  └── site.config.json — single source of truth for URL and feature flags
```

### OOP principles applied

| Principle | Implementation |
|-----------|----------------|
| **Inheritance** | All page classes extend `BasePage` |
| **Encapsulation** | Locators are `readonly` properties; internals hidden in page classes |
| **Abstraction** | Tests call methods, not raw selectors |
| **Single Responsibility** | One class per page/section; no assertions inside page objects |

---

## Development Environment Setup

### Prerequisites

| Tool | Minimum Version | Install |
|------|----------------|---------|
| Node.js | 18 LTS | [nodejs.org](https://nodejs.org) |
| npm | 9+ | Bundled with Node.js |
| Git | any | [git-scm.com](https://git-scm.com) |

### 1. Clone the repository

```bash
git clone https://github.com/<org>/deliverychainio-qa.git
cd deliverychainio-qa
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install --with-deps chromium
```

> For full cross-browser coverage: `npx playwright install --with-deps`

### 4. Verify TypeScript compiles cleanly

```bash
npm run typecheck
```

### 5. Run smoke tests to confirm setup works

```bash
npm run test:smoke
```

All 5 smoke tests should pass. If the site is unreachable, check your internet connection and the URL in `site.config.json`.

### Optional: override the site URL

```bash
SITE_URL=https://staging.deliverychain.io npm test
```

---

## Running Tests

```bash
# All tests
npm test

# By category
npm run test:smoke          # @smoke — fast availability checks
npm run test:navigation     # @navigation — nav links and routing
npm run test:forms          # @forms — form fields and validation
npm run test:visual         # @visual — screenshot regression
npm run test:responsive     # @responsive — layout at all viewports

# Headed browser (watch mode)
npm run test:headed

# View HTML report after a run
npm run report

# Update visual snapshot baselines
npm run baseline

# Lint
npm run lint

# TypeScript type check
npm run typecheck
```

### Interpreting results

| Status | Meaning |
|--------|---------|
| Green | Test passed |
| Yellow / WARN | Soft assertion triggered — logged for awareness, not a failure |
| Red / FAIL | Assertion failed — check `playwright-report/index.html` for screenshots and traces |
| SKIP | Conditionally skipped (e.g., `skipForms: true` in config) |

---

## Project Structure

```
deliverychainio-qa/
├── site.config.json              # Site URL and feature flags — edit this first
├── playwright.config.ts          # Browser projects, timeouts, reporters
├── global-setup.ts               # Pre-run reachability check
├── tsconfig.json                 # TypeScript strict mode + path aliases
│
├── src/
│   ├── pages/                    # Page Object Model classes
│   │   ├── base.page.ts          # BasePage — shared methods for all pages
│   │   ├── home.page.ts          # HomePage — hero, CTAs, feature sections
│   │   ├── navigation.page.ts    # NavigationPage — nav links, mobile menu
│   │   ├── contact.page.ts       # ContactFormPage — contact form
│   │   ├── solutions.page.ts     # SolutionsPage — solutions/features page
│   │   ├── about.page.ts         # AboutPage — about page content
│   │   └── newsletter.page.ts    # NewsletterPage — newsletter signup
│   ├── fixtures/
│   │   └── site.fixture.ts       # Custom Playwright fixtures
│   ├── utils/
│   │   ├── link-checker.ts
│   │   └── visual-helper.ts
│   └── types/
│       └── site-config.types.ts
│
├── tests/
│   ├── smoke/                    # @smoke
│   ├── navigation/               # @navigation
│   ├── forms/                    # @forms
│   ├── functional/               # @functional
│   ├── visual/                   # @visual
│   └── responsive/               # @responsive
│
├── .claude/                      # Claude Code agentic configuration
│   ├── agents/                   # Custom sub-agent definitions
│   ├── commands/                 # Slash command definitions
│   ├── rules/                    # Path-scoped coding rules
│   ├── hooks/                    # Shell hooks (pre-test reachability check)
│   └── settings.json             # Permissions and hook configuration
│
├── .github/
│   ├── copilot-instructions.md   # GitHub Copilot / AI coding instructions
│   ├── CONTRIBUTING.md           # Contribution guidelines
│   ├── pull_request_template.md
│   ├── ISSUE_TEMPLATE/
│   └── workflows/playwright-tests.yml
│
├── Agent.md                      # Sub-agent reference
├── Skills.md                     # Slash command reference
└── CLAUDE.md                     # Claude Code project instructions
```

---

## Test Categories

| Tag | Folder | What is tested |
|-----|--------|----------------|
| `@smoke` | `tests/smoke/` | Site loads, HTTPS, title, no JS errors |
| `@navigation` | `tests/navigation/` | Nav links, 404 checks, mobile menu, logo |
| `@forms` | `tests/forms/` | Field presence, validation — no submission |
| `@functional` | `tests/functional/` | Hero, IoT features, newsletter, CTAs, footer |
| `@visual` | `tests/visual/` | Screenshot regression at all viewports |
| `@responsive` | `tests/responsive/` | Overflow, font sizes, meta viewport |

---

## Page Object Model

Every interactable page section has its own TypeScript class in `src/pages/`.

### Rules
1. Classes must extend `BasePage`
2. Locators are declared as `readonly Locator` class properties
3. Methods represent **user actions** — no `expect()` inside page objects
4. Tests use fixtures, not raw `page.locator()` calls in test bodies
5. Constructor receives `Page` and `SiteConfig`; passes both to `super()`

### Example class structure

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@types/site-config.types';

export class SolutionsPage extends BasePage {
  readonly heroHeading: Locator;
  readonly featureCards: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heroHeading = page.locator('h1, h2').first();
    this.featureCards = page.locator('[class*="feature"], [class*="solution"]');
  }

  async navigateToSolutions(): Promise<void> {
    await this.page.goto(`${this.url}/solutions/`, { waitUntil: 'domcontentloaded' });
    await this.waitForLoad();
  }
}
```

---

## Claude Code Integration

This project is optimized for agentic operation with Claude Code.

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Full instruction set for Claude Code |
| `Agent.md` | Sub-agent documentation and format reference |
| `Skills.md` | Slash command reference |
| `.claude/agents/` | Sub-agent definition files |
| `.claude/commands/` | Slash command definition files |
| `.claude/rules/` | Path-scoped coding rules |
| `.claude/settings.json` | Permissions and hook configuration |

### Quick slash commands

| Command | What it does |
|---------|-------------|
| `/analyze-site` | Crawl the live site and update `site.config.json` |
| `/generate-full-suite` | Generate complete POM + tests from scratch |
| `/run-smoke` | Run smoke tests and display pass/fail summary |
| `/update-baseline` | Refresh visual snapshot baselines |
| `/generate-report` | Display structured test results summary |

---

## Contribution Rules

### Before opening a PR

1. Run `npm run typecheck` — zero TypeScript errors required
2. Run `npm run lint` — zero ESLint errors required
3. Run `npm run test:smoke` — all smoke tests must pass
4. Add or update tests for any new pages or features you cover
5. Do not commit `playwright-report/`, `test-results/`, or `__snapshots__/`

### Writing tests

| Rule | Reason |
|------|--------|
| Tag every test with `@smoke`, `@navigation`, etc. | Enables category-scoped runs |
| Import from `@fixtures/site.fixture` | Ensures page objects are properly initialized |
| No hardcoded URLs — use `siteConfig.url` | Config-driven; works against staging too |
| Never submit a form | Avoids spam; this is a live production site |
| No `page.waitForTimeout()` — use Playwright auto-waiting | Prevents flaky time-based tests |
| No `any` type without a justifying comment | Maintains strict TypeScript |
| Selectors belong in page objects, not test bodies | Enforces POM — tests read like user stories |

### Commit message format

```
<type>(<scope>): <subject>

feat(functional): add IoT features grid test
fix(navigation): handle mobile menu toggle timeout
test(smoke): increase load time threshold to 15s
docs(readme): update setup instructions
```

Types: `feat`, `fix`, `test`, `refactor`, `docs`, `ci`, `chore`

### Branch naming

```
feat/<short-description>
fix/<short-description>
test/<short-description>
```

---

## CI/CD

GitHub Actions runs the full suite on every push to `main` and every pull request. See [`.github/workflows/playwright-tests.yml`](.github/workflows/playwright-tests.yml).

- Tests run headless on `ubuntu-latest` with Chromium
- HTML report is uploaded as a workflow artifact
- PR checks block merge when tests fail

Run CI settings locally:

```bash
CI=true npm test
```

---

## Support

- **Test failures / bugs**: open an issue using the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- **New coverage requests**: use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
- **Site changed / selectors broken**: run `/analyze-site` in Claude Code to re-discover the structure
