---
description: Safe refactoring — dependency-aware, build-gated, one layer at a time
---

# Refactor Workflow

Use this when restructuring code, renaming, extracting functions, or changing patterns across files.

## Step 1 — Impact Analysis

1. Read `_agent/rules.md` for project rules.

2. Identify **all consumers** of the code being refactored:
   - Search for imports of the target module
   - Search for usages of the target function/type
   - List every file that will need changes

3. State the refactoring plan:
   - What is changing (old → new)
   - List of all affected files (must be exhaustive)
   - Order of changes (lowest layer first)

4. If more than 8 files are affected, break into phases and confirm with the user.

## Step 2 — Execute (bottom-up)

5. Make changes in **dependency order** (lowest layer first):
   ```
   lib/ (utilities, helpers)
     → lib/dal/ (data access)
       → schemas/ (validation)
         → _actions/ (server actions)
           → _components/ (UI components)
             → page.tsx (pages)
   ```

// turbo
6. Build after each layer:
```bash
npm run build
```
Fix any errors before moving to the next layer.

7. Do NOT rename and restructure at the same time — do one operation per pass.

## Step 3 — Verify

8. Run `/verify` workflow.

9. Confirm that no dead imports, unused variables, or orphaned types remain.

10. Update "Latest Context" in `_agent/rules.md`.
