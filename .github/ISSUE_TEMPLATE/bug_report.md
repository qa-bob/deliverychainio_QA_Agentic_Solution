---
name: Bug report
about: A test is failing or producing incorrect results
title: "[BUG] "
labels: bug
assignees: ''
---

## Describe the bug

<!-- A clear, concise description of what went wrong. -->

## Failing test(s)

<!-- List the test file and test name(s). -->
- `tests/.../...spec.ts` → `test name here`

## Expected behavior

<!-- What should the test assert? -->

## Actual behavior

<!-- What does the test actually do or produce? Include the error message. -->

```
Error: <paste here>
```

## Steps to reproduce

1. `npm run test:smoke` (or the relevant command)
2. Observe test `test name here` fails
3. Error: `...`

## Environment

| Field | Value |
|-------|-------|
| Node version | `node --version` |
| Playwright version | `npx playwright --version` |
| OS | Windows / macOS / Linux |
| Branch | `main` / feature branch |
| Site URL tested | `https://deliverychain.io` |

## Possible cause

<!-- If you have a theory — selector changed, site redesign, timing issue — note it here. -->

## Attachments

<!-- Paste a Playwright HTML report screenshot, trace file path, or relevant browser DevTools output. -->
