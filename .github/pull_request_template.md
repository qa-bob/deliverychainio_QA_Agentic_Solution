## Summary

<!-- What does this PR add, fix, or change? 1-3 bullet points. -->
- 

## Test coverage added or changed

<!-- List the test files and what they cover. -->
| File | Category | What is tested |
|------|----------|----------------|
| `tests/...` | `@functional` | |

## Checklist

- [ ] `npm run typecheck` passes (zero TypeScript errors)
- [ ] `npm run lint` passes (zero ESLint errors)
- [ ] `npm run test:smoke` — all smoke tests pass
- [ ] Tests use page objects — no raw `page.locator()` calls in test bodies
- [ ] All new tests are tagged with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- [ ] No form is submitted in any test
- [ ] No hardcoded URLs — `siteConfig.url` or `baseURL` used throughout
- [ ] `playwright-report/`, `test-results/`, and `__snapshots__/` are NOT committed
- [ ] If visual baselines were updated, that was intentional (run `/update-baseline` locally to verify)

## Screenshots / traces (if applicable)

<!-- Paste failure screenshots or attach a trace zip if this fixes a flaky test. -->
