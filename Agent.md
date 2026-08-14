# Agent.md — Sub-Agent Reference

This document describes the Claude Code sub-agents available in this repository. Sub-agents run in their own context windows with scoped tool access, keeping the main conversation clean and focused.

Sub-agent definitions live in `.claude/agents/`. Claude automatically delegates to a sub-agent when a task matches its `description` frontmatter field.

---

## Available Sub-Agents

### `site-analyzer`

**File:** `.claude/agents/site-analyzer.md`  
**Scope:** Project (`.claude/agents/`)  
**Model:** Sonnet  
**Tools:** WebFetch, Read, Write, Bash

**Purpose:** Crawls a live website and produces a fully-populated `site.config.json`. Used to onboard a new site or re-validate config after a site redesign.

**Trigger phrases:**
- "Analyze the site and update the config"
- "What pages does the site have?"
- "Re-discover the site structure"
- `/analyze-site`

**Output:** An updated `site.config.json` with all fields populated, plus an issues checklist and confidence assessment.

**When to use:**
- First-time repo setup for a new site
- After a major site redesign
- When selectors are failing and you suspect the site structure changed
- Before running `/generate-full-suite`

---

### `test-generator`

**File:** `.claude/agents/test-generator.md`  
**Scope:** Project (`.claude/agents/`)  
**Model:** Sonnet  
**Tools:** WebFetch, Read, Write, Bash, Glob, Grep

**Purpose:** Reads `site.config.json` and generates site-specific Playwright test files and page object classes for functionality not covered by the generic suite.

**Trigger phrases:**
- "Generate tests for the pricing page"
- "Write a spec for the blog section"
- "Create custom tests for this site"
- `/generate-full-suite`

**Output:** TypeScript spec files in `tests/custom/` or `tests/functional/`, plus updated or new page object classes in `src/pages/`.

**When to use:**
- The site has unique interactive elements (accordions, calculators, video embeds)
- A site's structure is unusual enough that generic selectors fail
- Writing regression tests for a recently discovered bug
- Adding coverage for a specific page (pricing, about, blog)

---

## Sub-Agent Format

Sub-agents are Markdown files with YAML frontmatter. Claude Code reads the `description` field to decide when to delegate.

```markdown
---
name: my-agent
description: One sentence describing when Claude should use this agent.
model: sonnet
tools:
  - Read
  - WebFetch
  - Bash
---

## Role
Describe the agent's job here. This becomes the system prompt.

## When to invoke
Bullet list of trigger conditions.

## Step-by-step instructions
1. Step one
2. Step two
```

### Priority order (highest → lowest)

| Location | Scope |
|----------|-------|
| Managed settings | Organization-wide |
| `--agents` CLI flag | Current session only |
| `.claude/agents/` | This project |
| `~/.claude/agents/` | All projects on your machine |
| Plugin `agents/` | Where plugin is installed |

When two agents share the same `name`, the higher-priority location wins.

---

## Creating a New Sub-Agent

**Via Claude Code UI:**

```
/agents
```

Switch to the **Library** tab → **Create new agent** → **Project**.

**Manually:** Create a `.md` file in `.claude/agents/` with the frontmatter format above. The `name` field must be unique within the project scope.

**Guidelines for good agent descriptions:**

- Be specific: "Analyzes site HTML to extract nav links and form fields" is better than "Helps with sites"
- Include the trigger: mention what prompt or task should kick off the agent
- One sentence maximum — Claude scans it to decide whether to delegate

---

## Built-In Claude Code Agents

Claude Code also ships these built-in agents (always available, no configuration needed):

| Agent | Model | Purpose |
|-------|-------|---------|
| **Explore** | Haiku | Fast read-only codebase search and file discovery |
| **Plan** | Inherited | Research phase during plan mode |
| **general-purpose** | Inherited | Complex multi-step tasks requiring both search and writes |
| **claude-code-guide** | Haiku | Answers questions about Claude Code features |

---

## Persistent Memory

Sub-agents can maintain their own memory directory. To enable for a project sub-agent, add `memoryScope: project` to the frontmatter. The agent will accumulate learnings in `.claude/agent-memory/<agent-name>/` across sessions.

This is especially useful for `site-analyzer`: it can remember which selectors worked last time, saving re-discovery effort on subsequent runs.
