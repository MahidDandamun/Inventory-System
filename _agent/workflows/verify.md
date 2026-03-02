---
description: Post-task verification — run after completing any code change
---

# Verification Workflow

Run this workflow after completing any task that modifies code files.

// turbo-all

## Steps

1. Run lint to check for errors:
```bash
npm run lint
```
Must pass with 0 errors.

2. Run TypeScript type-check:
```bash
npx tsc --noEmit
```
Must pass with 0 errors.

3. Run production build to verify compilation:
```bash
npm run build
```
Must compile successfully.

4. If test files exist, run unit tests:
```bash
npm test
```
Must pass all tests.

5. Review all changed files for:
   - DAL functions return typed DTOs (not raw Prisma models)
   - No new `any` types introduced
   - Auth uses `requireCurrentUser()` / `requireAdminUser()` from guards
   - Server actions follow: Zod validate → DAL → revalidate pattern
   - Multi-table mutations use `prisma.$transaction()`

6. Update the "Latest Context" section in `_agent/rules.md` with what was changed.
