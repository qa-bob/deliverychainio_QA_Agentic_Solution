---
name: Feature request / new test coverage
about: Request additional test coverage for a page or feature
title: "[COVERAGE] "
labels: enhancement
assignees: ''
---

## What page or feature should be tested?

<!-- Describe the page URL or feature name. -->
- URL: `https://deliverychain.io/...`
- Feature: 

## What should the tests verify?

<!-- List the specific behaviors or elements that need coverage. Be concrete. -->
- [ ] Element X is visible
- [ ] Clicking Y navigates to Z
- [ ] Field W accepts valid input and shows validation on empty submit

## Why is this not covered by existing tests?

<!-- Is it a new page? A newly discovered feature? A regression that occurred? -->

## Test category

- [ ] `@smoke`
- [ ] `@navigation`
- [ ] `@forms`
- [ ] `@functional`
- [ ] `@visual`
- [ ] `@responsive`

## Suggested selectors or page elements

<!-- Optional: paste relevant HTML snippets or DevTools selector paths. -->

```html

```

## Acceptance criteria

<!-- How will we know this request is done? -->
- [ ] Test file created at `tests/.../...spec.ts`
- [ ] Page object updated/created at `src/pages/...page.ts`
- [ ] `npm run typecheck` passes
- [ ] New tests pass in CI
