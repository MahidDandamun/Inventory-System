# Inventory System Audit Implementation Plan

This document converts the latest architecture audit into an execution-ready plan.

## Goals

1. Enforce DAL consistency (DTO-only returns, no raw Prisma leakage).
2. Remove repetitive server action plumbing.
3. Normalize route/domain naming conventions.
4. Prepare file/module structure for continued project growth.
5. Add automated guardrails so conventions stay enforced.

---

## Phase 1 — DAL Consistency and Security Boundary

### Why
Your architecture docs and rules define DAL as a strict boundary that returns DTOs only, but some functions still return raw Prisma models.

### Scope
- `lib/dal/users.ts`
- `lib/dal/products.ts`
- Any other DAL file returning Prisma objects directly

### Tasks
- [ ] Audit every exported DAL function return type.
- [ ] Define explicit `type` DTOs for each exported read/write return value.
- [ ] Introduce per-domain mapper functions (e.g. `toUserDTO`, `toProductDTO`) to avoid repeated mapping logic.
- [ ] Ensure Decimal fields are converted before leaving DAL.
- [ ] Keep `import "server-only"` at top of each DAL file.
- [ ] Confirm auth guards are applied consistently (`requireCurrentUser` / `requireAdminUser`).

### Acceptance Criteria
- No DAL function returns raw Prisma model types.
- DAL exports are typed DTOs (or `null`/`void` where appropriate).
- `npm run lint` and `npm run build` pass.

---

## Phase 2 — Server Action Standardization

### Why
There is repeated form parsing and response-shape logic across action files.

### Scope
- `app/(dashboard)/**/_actions/*.ts`
- `app/(auth)/_actions/*.ts`
- new helper(s) in `lib/` or `app/_shared/`

### Tasks
- [ ] Create a small reusable helper for `FormData -> object -> schema.safeParse`.
- [ ] Optionally create an action wrapper utility to normalize:
  - validation failure response
  - try/catch + `handleServerError(error)`
  - success response shape
- [ ] Apply helper incrementally to 1–2 domains first (products + warehouse), then roll out.
- [ ] Keep server actions thin: validate -> DAL -> revalidate.

### Suggested helper contracts
```ts
parseFormData<TSchema extends z.ZodTypeAny>(schema: TSchema, formData: FormData)
// returns { success: true; data: z.infer<TSchema> } | { success: false; error: ... }
```

### Acceptance Criteria
- Reduced duplication in action files.
- Consistent action return shape across features.
- No loss of field-level validation errors.

---

## Phase 3 — Naming and Route Conventions

### Why
Mixed singular/plural route segments make navigation and scaling harder.

### Scope
- `routes.ts`
- `components/layout/app-sidebar.tsx`
- any route segments currently singular (e.g. `/warehouse`)

### Tasks
- [ ] Decide and document naming policy: **plural nouns for resources**.
- [ ] Migrate `/warehouse` -> `/warehouses` (or keep singular and document explicit exception).
- [ ] Update links, redirects, tests, and any hardcoded path references.
- [ ] Add route constants where hardcoded strings repeat.

### Acceptance Criteria
- Resource routes are convention-consistent.
- No dead links after route updates.

---

## Phase 4 — Growth-Oriented Project Structure

### Why
As features expand, purely layer-based organization (`lib/dal`, `schemas`, `app`) increases cross-folder context switching.

### Target Structure (incremental)

```text
modules/
  products/
    dal.ts
    schema.ts
    types.ts
    mappers.ts
    service.ts        # optional domain orchestration
  orders/
  invoices/
```

Route files in `app/(dashboard)/...` should progressively import from `modules/<domain>/...`.

### Tasks
- [ ] Pilot one domain (`products`) with module-based organization.
- [ ] Keep backward-compatible exports to avoid large breakages.
- [ ] Migrate one domain at a time; do not big-bang rewrite.
- [ ] Add short README in `modules/` with conventions.

### Acceptance Criteria
- At least one domain fully migrated and stable.
- Migration playbook documented for other domains.

---

## Phase 5 — Guardrails (CI + Repo Automation)

### Why
Conventions are strongest when automated.

### Tasks
- [ ] Ensure CI runs at minimum:
  - `npm run lint`
  - `npm run build`
  - `npm test` (if environment supports)
- [ ] Add a check that blocks direct Prisma imports outside DAL (ESLint restricted import rule).
- [ ] Consider a lightweight check that DAL exports do not include raw Prisma types.
- [ ] Keep Husky pre-commit for local fast feedback.

### Acceptance Criteria
- Conventions fail fast in CI.
- Regressions are caught before merge.

---

## Recommended Execution Order (2-week sample)

### Week 1
1. DAL DTO remediation (users + products first).
2. Server action helper created and applied to two domains.
3. Lint/build green.

### Week 2
1. Route naming normalization.
2. `modules/products` pilot migration.
3. CI guardrails and docs updates.

---

## Definition of Done

- [ ] DAL conforms to DTO-only boundary.
- [ ] Server actions follow one standardized pattern.
- [ ] Route naming policy is consistent and documented.
- [ ] Domain module pilot exists and is adopted by at least one feature.
- [ ] CI enforces lint/build and architecture constraints.
- [ ] README (or dedicated ARCHITECTURE.md) updated to reflect final conventions.

---

## Optional Agent Prompt

Use the following if handing off to another coding agent:

> Implement `AUDIT_IMPLEMENTATION_PLAN.md` in phases, starting with DAL DTO compliance in `lib/dal/users.ts` and `lib/dal/products.ts`. Preserve behavior, keep changes incremental, run lint/build after each phase, and submit separate commits per phase with clear summaries.