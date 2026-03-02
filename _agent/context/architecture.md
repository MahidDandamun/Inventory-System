# Architecture Reference

> Agents: read this instead of scanning the repo. All key architecture decisions are here.

---

## System Layers

```
┌─────────────────────────────────────────────────────────────┐
│  BROWSER                                                     │
│  └─ Client Components (forms, tables, dialogs)              │
│     └─ Zustand stores (sidebar state, UI state only)        │
│     └─ react-hook-form + Zod resolver for forms             │
├─────────────────────────────────────────────────────────────┤
│  NEXT.JS SERVER                                              │
│  ├─ Server Components (page.tsx) ← call DAL directly        │
│  ├─ Server Actions (_actions/*.ts) ← called by forms        │
│  │   └─ "use server" → Zod validate → DAL → revalidatePath │
│  ├─ Middleware (middleware.ts + routes.ts)                   │
│  │   └─ Auth.js session check → redirect unauthenticated    │
│  └─ DAL (lib/dal/*.ts) ← security boundary                 │
│      └─ import "server-only"                                │
│      └─ requireCurrentUser() / requireAdminUser()           │
│      └─ Prisma queries → DTO mapping                        │
├─────────────────────────────────────────────────────────────┤
│  DATABASE                                                    │
│  └─ Neon PostgreSQL (serverless)                            │
│  └─ Prisma 6 ORM (schema at prisma/schema.prisma)          │
└─────────────────────────────────────────────────────────────┘
```

---

## Feature Folder Structure

Every dashboard feature follows this pattern:

```
app/(dashboard)/products/
├── page.tsx              ← Server Component, calls DAL directly
├── _actions/
│   └── product.ts        ← Server Actions ("use server")
└── _components/
    ├── product-table.tsx  ← Client Component (data table)
    ├── create-product-dialog.tsx
    └── edit-product-dialog.tsx
```

**Rule**: `_actions/` and `_components/` are co-located per feature. Shared components go in `components/`.

---

## Auth Flow

```
Request → middleware.ts
  ├─ Check routes.ts (public? auth? protected?)
  ├─ If protected + no session → redirect /login
  └─ If authenticated → proceed

In DAL functions:
  └─ requireCurrentUser() → throws if no session
  └─ requireAdminUser() → throws if not admin role
```

- **Config**: `auth.config.ts` (providers, callbacks) + `auth.ts` (Prisma adapter, session strategy)
- **Providers**: Email/password, Google OAuth, GitHub OAuth, 2FA
- **Session**: JWT-based via Auth.js v5

---

## Database Models (key entities)

| Model | Purpose | Key Relations |
|---|---|---|
| `User` | Auth + roles (ADMIN, USER) | → Orders, Products, SystemLogs |
| `Product` | Inventory items with stock | → Warehouse, OrderItems, BillOfMaterial |
| `Order` | Purchase/sale orders | → OrderItems → Product |
| `Invoice` | Billing records | → Order |
| `Warehouse` | Storage locations | → Products, RawMaterials |
| `RawMaterial` | Raw material inventory | → Warehouse, BillOfMaterial |
| `BillOfMaterial` | Product ↔ RawMaterial mapping | → Product, RawMaterial |
| `StockMovement` | Audit trail for stock changes | entity + entityId polymorphic |
| `Notification` | User alerts (low stock, etc.) | → User |
| `SystemLog` | Action audit trail | → User |

**Schema location**: `prisma/schema.prisma`

---

## State Management

| Type | Where | Tool |
|---|---|---|
| **Server state** | Server Components + DAL | React Server Components (no fetch needed) |
| **Form state** | Client Components | react-hook-form + @hookform/resolvers/zod |
| **UI state** | Client Components | Zustand (sidebar toggle, modals, etc.) |
| **Auth state** | Middleware + DAL | Auth.js v5 session |

**Rule**: Server state lives in Server Components. Don't duplicate server data in Zustand.

---

## Validation Flow

```
Form (Client) → react-hook-form + zodResolver(schema)
    │  client-side validation
    ▼
Server Action → schema.safeParse(formData)
    │  server-side validation (Zod)
    ▼
DAL → Prisma query (DB constraints)
```

Same schema from `schemas/` is used on both client and server.
