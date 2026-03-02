---
description: Structured debugging — root-cause first, prevents cascading fix attempts
---

# Debug Workflow

Use this instead of ad-hoc fixing. Prevents the common pattern of applying patches that create more errors.

## Step 1 — Capture

1. Get the **exact error message** — copy the full error output.

2. Identify the **failing file and line number** from the stack trace.

## Step 2 — Isolate

3. Read **only** the failing file. Do NOT read unrelated files.

4. If the error involves an import, read the imported module's **type exports only** (DTO types, function signatures) — not the full implementation.

5. State the **root cause** in one sentence before writing any fix.
   - Example: "The error is because `getProductById` returns `ProductDTO | null` but the caller doesn't handle `null`."
   - If you cannot state the root cause, gather more information before proceeding.

## Step 3 — Fix

6. Apply the **minimal patch** — change the fewest lines possible to fix the root cause.

7. Run a build to verify:
// turbo
```bash
npm run build
```

8. If the build still fails with the **same error**, re-read the failing file and try again.

9. If the build fails with a **different error**, this is a new issue — go back to Step 1.

## Step 4 — Escalate

10. **If still failing after 3 attempts**: STOP. Do not keep patching.
    - Summarize what you tried
    - State what you think the actual root cause is
    - Ask the user for guidance

## Post-fix

// turbo
11. Run full verification:
```bash
npm run lint && npm run build
```

12. Briefly explain what the bug was and how you fixed it.
