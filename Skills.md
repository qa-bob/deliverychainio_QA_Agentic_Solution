# Skills.md — Slash Command Reference

This document describes the Claude Code slash command skills available in this repository. Skills are invoked with a `/` prefix inside a Claude Code session and execute purpose-built, multi-step workflows.

Skill definitions live in `.claude/commands/`. They load on demand — only when invoked — so they don't consume context in every session.

---

## Available Skills

### `/analyze-site`

**File:** `.claude/commands/analyze-site.md`  
**Purpose:** Crawl the live site and produce a fully-populated `site.config.json`.

**What it does:**
1. Navigates to the URL in `site.config.json` (or a provided URL)
2. Extracts nav links, heading text, form presence, meta tags, viewport
3. Tries `/contact`, `/contact-us`, `/get-in-touch` to find contact forms
4. Checks for horizontal overflow at 390px
5. Outputs an updated `site.config.json` + issues checklist

**Usage:**
```
/analyze-site
/analyze-site https://staging.deliverychain.io
```

**When to use:**
- Onboarding a new site for the first time
- After a site redesign (selectors may have changed)
- When `site.config.json` fields are empty or stale
- Before running `/generate-full-suite`

---

### `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`  
**Purpose:** Analyze the website and generate a complete POM + test suite from scratch.

**What it does:**
1. Reads `site.config.json` for the target URL and flags
2. Uses `WebFetch` to visit the homepage and key discovered pages
3. Plans and writes page object classes in `src/pages/`
4. Writes test specs across all categories (`tests/smoke/`, `tests/navigation/`, `tests/forms/`, `tests/functional/`, `tests/visual/`, `tests/responsive/`)
5. Updates `src/fixtures/site.fixture.ts` with any new page fixtures
6. Updates `site.config.json` with discovered nav items and metadata
7. Runs `npx tsc --noEmit` and fixes any TypeScript errors
8. Reports a summary of pages analyzed, classes created, and test count

**Usage:**
```
/generate-full-suite
```

**Typical runtime:** 3–10 minutes depending on site complexity.

**When to use:**
- Initial setup of tests for a new site
- After a complete site redesign that broke existing selectors
- When coverage gaps need to be filled comprehensively

---

### `/run-smoke`

**File:** `.claude/commands/run-smoke.md`  
**Purpose:** Run smoke tests and display a clean pass/fail summary.

**What it does:**
1. Runs `npm run test:smoke`
2. Parses `test-results/results.json`
3. Displays a formatted table: test name, status, duration
4. For failures: shows error + a suggested fix
5. Mirrors the exit code (0 = all pass, 1 = any failure)

**Usage:**
```
/run-smoke
```

**When to use:**
- Quick health check before running the full suite
- After deploying a site change
- Confirming the test environment is working

---

### `/update-baseline`

**File:** `.claude/commands/update-baseline.md`  
**Purpose:** Refresh visual regression snapshot baselines.

**What it does:**
1. Runs `npm run baseline` (Playwright `--update-snapshots`)
2. Reports which baseline images were updated
3. Warns if a large number of baselines changed (may indicate a site redesign)

**Usage:**
```
/update-baseline
```

**When to use:**
- After an intentional design change
- First-time setup of the visual suite
- After updating viewport configurations

> **Warning:** Only run this when visual changes are intentional. Running it to silence failures hides regressions.

---

### `/generate-report`

**File:** `.claude/commands/generate-report.md`  
**Purpose:** Display a structured summary of the last test run.

**What it does:**
1. Parses `test-results/results.json`
2. Displays a breakdown table by suite: total, passed, failed, flaky
3. Lists all failed tests with error messages and retry count
4. Lists flaky tests with timing suggestions
5. Suggests next steps (broken links to fix, baselines to update, etc.)

**Usage:**
```
/generate-report
```

**When to use:**
- After `npm test` to get a formatted summary
- In CI to generate a human-readable artifact
- Investigating which test category has the most failures

---

## How Skills Work

Skills are Markdown files in `.claude/commands/`. When you invoke `/skill-name`, Claude Code:

1. Loads the skill's Markdown file into context
2. Executes the instructions step by step, using available tools
3. Returns results directly in the conversation

Skills differ from sub-agents:

| | Skills | Sub-Agents |
|--|--------|------------|
| **Invocation** | Explicit `/command` | Automatic delegation |
| **Context** | Runs in main conversation | Runs in own context window |
| **When loaded** | On demand only | Description checked every turn |
| **Best for** | Multi-step workflows | Context-preserving side tasks |

---

## Creating a New Skill

Create a `.md` file in `.claude/commands/`:

```markdown
# /my-skill-name

One sentence describing what this skill does.

## Usage
\`\`\`
/my-skill-name [optional-arg]
\`\`\`

## What this command does

1. Step one — describe with specific tool usage
2. Step two
3. Step three

## Output format

Describe what the skill outputs.

## Edge cases

- How to handle X
- What to do if Y
```

The filename (without `.md`) becomes the slash command name. Register it in `CLAUDE.md`'s slash command table so it's discoverable.

---

## Skill Chaining

Skills can be chained for a full workflow:

```
/analyze-site          ← discover site structure, update config
/generate-full-suite   ← generate all page objects and tests
/run-smoke             ← verify the suite passes basic checks
/generate-report       ← view full results
```

Run `/update-baseline` after the suite passes to lock in initial visual baselines.
