# Inventory System — Agent Rules

> **Read this file first. Do NOT scan the repository.** Everything you need to start working is here.

---

## Project Identity

- **Next.js 16** App Router + Server Components/Actions, **TypeScript 5** strict
- **Prisma 6** ORM → **Neon PostgreSQL**, **Auth.js v5** (NextAuth beta)
- **shadcn/ui** + **Tailwind CSS v4**, **Zod 4** validation, **Zustand** client state

---

## Architecture (3-layer system)

```
UI Layer (Server Components → Client Components)
    │  consumes DTOs only — never raw Prisma models
    ▼
Server Actions (Zod validate → DAL → revalidatePath)
    │  app/(dashboard)/[feature]/_actions/
    ▼
Data Access Layer — DAL (security boundary)
    │  lib/dal/ — all DB queries, auth guards, DTO mapping
    │  import "server-only" on every file
    ▼
Database (Prisma Client singleton → Neon PostgreSQL)
    │  lib/prisma.ts
```

---

## File Index

| Path | Purpose |
|---|---|
| `lib/dal/` | **All** DB queries — never import Prisma anywhere else |
| `lib/dal/guards.ts` | `requireCurrentUser()`, `requireAdminUser()` — auth boundary |
| `lib/error-handling.ts` | `handleServerError()` — catch blocks in actions |
| `lib/order-status.ts` | Status transition map + validation functions |
| `lib/document-number.ts` | Document number generation with unique-retry |
| `lib/prisma.ts` | Prisma singleton |
| `schemas/` | Zod schemas — shared between actions and forms |
| `app/(auth)/` | Auth pages (login, register, reset, verify) |
| `app/(dashboard)/` | Dashboard features — each has `page.tsx`, `_actions/`, `_components/` |
| `middleware.ts` + `routes.ts` | Route protection |
| `auth.ts` + `auth.config.ts` | NextAuth configuration |
| `components/` | Shared UI components (shadcn/ui) |
| `types/` | Shared TypeScript types |

---

## Hard Rules

### Must Do

1. **Use `requireCurrentUser()`** from `lib/dal/guards.ts` for auth — never inline
2. **All DAL functions return explicit DTO types** — never raw Prisma models
3. **Server actions are thin**: `"use server"` → Zod validate → DAL call → `revalidatePath` → return
4. **Run `npm run lint && npm run build`** before considering work done
5. **Use `prisma.$transaction()`** for multi-table mutations
6. **Use status transition maps** (like `ORDER_STATUS_FLOW`) — never arbitrary status jumps
7. **Use `handleServerError()`** in action catch blocks — `catch (error: unknown)`
8. **Every DAL file** starts with `import "server-only"`
9. **Use `type` (not `interface`)** for DTOs
10. **Use `z.infer<typeof schema>`** — don't manually redeclare types

### Must NOT

1. ❌ Import Prisma in components or server actions — always through DAL
2. ❌ Return raw Prisma models from DAL — always map to typed DTO
3. ❌ Skip Zod validation in server actions
4. ❌ Hardcode status strings — use enums/constants from shared modules
5. ❌ Multi-table mutations outside `$transaction()`
6. ❌ Commit without lint + build passing
7. ❌ Duplicate auth checks — if DAL has guard, action doesn't need another
8. ❌ Use `any` type — use `unknown` for catch, proper types everywhere else
9. ❌ Rewrite entire files — use targeted diffs only
10. ❌ Read files you don't need — work with minimum context

---

## Token Discipline

> These rules prevent token waste. Follow them strictly.

1. **Read this file first** — do NOT scan the whole repository
2. **Read `_agent/context/patterns.md`** for code templates — do NOT read existing files to learn patterns
3. **Scope edits tightly** — touch max 5-8 files per task
4. **Use diffs, not full rewrites** — never regenerate an entire file
5. **Read only what you need** — if modifying `lib/dal/products.ts`, don't read `lib/dal/orders.ts`
6. **Build every 2-3 files** — catch errors early before they cascade
7. **State the plan before coding** — 3-5 bullet points of what you will do
8. **If stuck after 3 attempts** — stop, explain the root cause, and ask the user
9. **Don't inject large context** — pass only error messages and relevant 5-10 lines of code
10. **Keep output focused** — no long explanations unless asked; code + brief note

---

## Common Mistakes (agents keep making these)

| Mistake | Correct Approach |
|---|---|
| Importing `prisma` directly in an action | Import from `lib/dal/` — actions never touch Prisma |
| Calling `getCurrentUser()` in actions | Use `requireCurrentUser()` from `lib/dal/guards.ts` |
| Returning Prisma model from DAL | Map every field to a `type XxxDTO = { ... }` |
| Using `interface` for DTOs | Use `type` — project convention |
| Forgetting `import "server-only"` in new DAL | First line of every DAL file |
| Using `error: any` in catch | Use `error: unknown` and `handleServerError(error)` |
| Calling `Decimal.toNumber()` wrong | Prisma `Decimal` → call `.toNumber()` in DTO mapping |
| Skipping `revalidatePath` after mutation | Every write action must call `revalidatePath("/feature")` |
| Making multi-table changes without transaction | Wrap in `prisma.$transaction()` |

---

## Latest Context

_Last updated: 2026-03-04_

- All DAL files use `requireCurrentUser()` guard — no inline auth
- DTO violations fixed across all DAL files
- Pre-commit hook (husky + lint-staged) runs eslint on staged files
- Order flow: stock-safe transactions + status transition validation
- `BillOfMaterial` and `StockMovement` models added (schema + DAL)
- Low stock alert auto-trigger (`checkLowStock()`) in order/product mutations
- Vitest + Playwright configured; baseline test files exist
- Features: Products, Orders, Invoices, Warehouses, Raw Materials, Users, Notifications, System Logs
- Added UI slices for Bill of Materials and Stock Movements, updating sidebar routing
- **Phase 1A: Customer Entity** — schema, DAL, actions, page, table, create/edit dialogs, sidebar nav, order form customer selector
- **Phase 1D: Quick Wins** — BOM multi-material dialog, system logs filters, stock movements DataTable with filters, dashboard real growth calc + chart empty state
- **Phase 1B: Invoice/Payment Lifecycle** — added `InvoiceStatus` flow, `Payment` model, invoice `dueDate` + status-aware DAL/actions/UI, payment recording form, overdue indicators, and unit tests for invoice status transitions
- **Phase 1C: Supplier + Purchase Order Skeleton** — added `Supplier`, `PurchaseOrder`, `PurchaseOrderItem` models, `PurchaseOrderStatus` enum, PO status transition map (`lib/po-status.ts`), DAL with transactional PO creation, status transitions, delete (DRAFT only), server actions, supplier/PO pages with DataTable + CRUD dialogs, sidebar nav entries
- **Phase 2A: Goods Receipts + Stock Integration** — added `GoodsReceipt` and `GoodsReceiptItem` models, built `receiveGoods` DAL with `$transaction` tracking `RAW_MATERIAL` stock movements (increments), dynamic PO status updates (`RECEIVED` / `PARTIALLY_RECEIVED`), and PO detail page UI with `ReceiveGoodsDialog`.
- **Phase 2D: Customer Order Lifecycle Enhancement** — added Order status timestamps (`confirmedAt`, `shippedAt`, `deliveredAt`, `cancelledAt`) and `notes` to schema, automatic status transition timestamps in DAL, `notes` field in Order form, and Order Timeline view on Order Details page.

---

## Quick Reference Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build — run before committing
npm run lint         # ESLint check
npm test             # Vitest unit tests
npm run test:e2e     # Playwright E2E tests
npm run db:push      # Push Prisma schema to database
npm run db:studio    # Open Prisma Studio
npx tsc --noEmit     # TypeScript type check
```
