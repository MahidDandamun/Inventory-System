---
description: Implement a scoped feature or change — file-by-file with build gates
---

# Implementation Workflow

Use this workflow when implementing any feature or change. It enforces scoped, token-efficient execution.

## Pre-flight

1. Read `_agent/rules.md` for project rules and constraints.

2. Read `_agent/context/patterns.md` for code templates.

3. State your implementation plan as a **numbered list** before writing any code:
   - Which files you will create or modify (max 5-8)
   - In what order (dependencies first)
   - What the acceptance criteria are

4. Confirm with the user if the scope exceeds 8 files.

## Execution

5. Work **one file at a time**, in dependency order:
   - Schema → DAL → Server Action → Components → Page
   - Use **diffs only** — never rewrite an entire file
   - Read only the file you are currently editing

// turbo
6. After every 2-3 files, run a build check:
```bash
npm run build
```
If the build fails, fix the error **before** moving to the next file.

7. Repeat steps 5-6 until all files are complete.

## Wrap-up

8. Run the verification workflow:
   - `/verify` — lint, type-check, build, tests

9. Update "Latest Context" in `_agent/rules.md` with a one-line summary of what was changed.
