---
description: Scaffold a complete dashboard feature — schema, DAL, action, page, components
---

# Add Feature Workflow

Use this when adding an entirely new feature to the dashboard (e.g., a new entity like "Suppliers").

## Pre-flight

1. Read `_agent/context/patterns.md` — you will copy templates from here.

2. Confirm with the user:
   - Feature name (e.g., "suppliers")
   - Fields and types
   - Whether it needs a status transition flow
   - Related entities (foreign keys)

## Step 1 — Database Schema

3. Add the new model to `prisma/schema.prisma`.

// turbo
4. Push the schema:
```bash
npx prisma db push
```

## Step 2 — Zod Schema

5. Create `schemas/<feature>.ts` — use the Zod Schema pattern from `_agent/context/patterns.md`.

## Step 3 — DAL

6. Create `lib/dal/<feature>.ts` — use the DAL patterns from `_agent/context/patterns.md`.

   Checklist:
   - [ ] First line: `import "server-only"`
   - [ ] DTO type exported: `type FeatureDTO = { ... }`
   - [ ] Auth guard: `await requireCurrentUser()`
   - [ ] List function wrapped in `cache()`
   - [ ] All fields mapped (no raw Prisma return)
   - [ ] `Decimal` fields use `.toNumber()`

## Step 4 — Server Actions

7. Create `app/(dashboard)/<feature>/_actions/<feature>.ts` — use the Server Action pattern.

   Checklist:
   - [ ] `"use server"` directive
   - [ ] Zod validation with `safeParse`
   - [ ] DAL function call (not direct Prisma)
   - [ ] `revalidatePath("/<feature>")`
   - [ ] `catch (error: unknown)` with `handleServerError`

## Step 5 — Page & Components

8. Create `app/(dashboard)/<feature>/page.tsx` — Server Component that calls DAL.

9. Create components in `app/(dashboard)/<feature>/_components/`:
   - Data table component
   - Create dialog/form
   - Edit dialog/form (if needed)

// turbo
10. Build check:
```bash
npm run build
```

## Step 6 — Verify

11. Run `/verify` workflow.

12. Update "Latest Context" in `_agent/rules.md`.
