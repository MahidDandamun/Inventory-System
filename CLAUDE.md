# Inventory System — AI Agent Context

> **All rules, architecture, and patterns live in `_agent/rules.md`.** Read that file first.

---

## Quick Start for Claude

1. Read `_agent/rules.md` — project rules, file index, hard do/don't rules
2. Read `_agent/context/architecture.md` — system architecture (if needed)
3. Read `_agent/context/patterns.md` — copy-paste code templates (if writing code)

## Available Workflows

| Command | Purpose |
|---|---|
| `/verify` | Post-task verification — lint, type-check, build, tests |
| `/implement` | Scoped implementation — file-by-file with build gates |
| `/debug` | Root-cause-first debugging — prevents cascading errors |
| `/add-feature` | Scaffold a complete feature — schema through UI |
| `/add-dal` | Add a DAL function — templated with guard and DTO |
| `/refactor` | Safe refactoring — dependency-aware, build-gated |

## Token Rules

- Do NOT scan the whole repository — read `_agent/rules.md` instead
- Do NOT read files to learn patterns — use `_agent/context/patterns.md`
- Work max 5-8 files per task
- Use diffs, not full file rewrites
- Build every 2-3 files
- If stuck after 3 attempts, stop and ask
