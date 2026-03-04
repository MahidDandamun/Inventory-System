# Copilot Instructions — Inventory System

## Architecture

Four strict layers — **never skip or bypass them**:

```
UI (Server/Client Components)
  → Server Actions  app/(dashboard)/[feature]/_actions/
  → DAL             lib/dal/                            ← security boundary
  → Database        Prisma + Neon PostgreSQL
```

**ESLint enforces that Prisma is never imported outside `lib/dal/`.** Violations are errors, not warnings.

## DAL Pattern (`lib/dal/*.ts`)

Every DAL file follows this exact structure:

```ts
import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { requireCurrentUser } from "@/lib/dal/guards"

// 1. Export DTO type (never expose raw Prisma models)
export type ProductDTO = { id: string; name: string; ... }

// 2. Export DTO transformer
export function toProductDTO(p: PrismaProduct): ProductDTO { ... }

// 3. Reads use React.cache() for request-level deduplication
export const getProducts = cache(async (): Promise<ProductDTO[]> => {
  await requireCurrentUser()
  const rows = await prisma.product.findMany({ ... })
  return rows.map(toProductDTO)
})

// 4. Writes call createSystemLog() after every mutation
export async function createProduct(data: ...): Promise<ProductDTO> {
  const user = await requireCurrentUser()   // admin ops: requireAdminUser()
  const row = await prisma.product.create({ data })
  await createSystemLog(user.id, "CREATE", "PRODUCT", row.id)
  return toProductDTO(row)
}
```

Multi-step mutations (order creation, stock adjustments) use `prisma.$transaction()`.

## Server Action Pattern (`app/(dashboard)/[feature]/_actions/*.ts`)

Actions are thin: validate → call DAL → revalidate cache.

```ts
"use server";
import { revalidatePath } from "next/cache";
import { validatedAction } from "@/lib/actions/safe-action";
import { createProduct } from "@/lib/dal/products";
import { productSchema } from "@/schemas/product";

export async function createProductAction(formData: FormData) {
	return validatedAction(productSchema, formData, async (data) => {
		const product = await createProduct(data);
		revalidatePath("/products");
		return product;
	});
}
```

`validatedAction` returns `{ success: true, data }` or `{ success: false, error, fieldErrors }`.

## Client-Side Action Response Pattern

After calling a server action, always follow this pattern in client components:

```ts
const result = await createProductAction(formData)

if (result.success) {
  toast.success("Product created.")   // sonner toast
  router.push("/products")            // useRouter() for navigation
} else {
  toast.error(result.error)
  // result.fieldErrors available for per-field form error display
}
```

- Use `revalidatePath()` **inside the action** for server cache invalidation.
- Use `router.push()` **on the client** for navigation after success.
- Always show feedback via **sonner** `toast.success()` / `toast.error()`.

## Adding a New Feature

Follow the exact pattern of an existing feature (e.g., `app/(dashboard)/products/`):

1. **Schema** — `schemas/[feature].ts` (Zod, shared client+server)
2. **DAL** — `lib/dal/[feature].ts` (import "server-only", DTO type + transformer + guarded CRUD)
3. **Actions** — `app/(dashboard)/[feature]/_actions/[feature].ts` (thin, use `validatedAction`)
4. **Pages** — `page.tsx` (list), `new/page.tsx` (create), `[id]/page.tsx` (edit)
5. **Components** — `_components/columns.tsx` (TanStack table columns), `[feature]-form.tsx`
6. **Tests** — `__tests__/dal/[feature].test.ts` (mock Prisma with `vi.mock`)

## Key Files

| File                         | Purpose                                                      |
| ---------------------------- | ------------------------------------------------------------ |
| `lib/dal/guards.ts`          | `requireCurrentUser()` / `requireAdminUser()`                |
| `lib/actions/safe-action.ts` | `validatedAction()` wrapper                                  |
| `lib/order-status.ts`        | Order state machine (`PENDING→PROCESSING→SHIPPED→DELIVERED`) |
| `lib/document-number.ts`     | `generateDocumentNumber("ORD"\|"INV")` with uniqueness retry |
| `lib/error-handling.ts`      | `handleServerError()` for action catch blocks                |
| `prisma/schema.prisma`       | 14 models; source of truth for all entity shapes             |
| `routes.ts`                  | Centralized route constants used by middleware               |
| `middleware.ts`              | Edge-runtime route protection (no Prisma here)               |

## Naming Conventions

- DTO types: `ProductDTO`, `OrderDTO`
- DTO transformers: `toProductDTO(prismaModel)`
- Server actions: `createProductAction`, `deleteOrderAction`
- Zod schemas: `productSchema`, `orderSchema`
- Feature folders: kebab-case plural (`raw-materials`, `bill-of-materials`)

## Auth Roles

- `ADMIN` — full access; use `requireAdminUser()` in DAL for user management, system logs
- `USER` — standard access; use `requireCurrentUser()` everywhere else
- Sidebar visibility is role-gated in `components/layout/app-sidebar.tsx`

## Commands

```bash
npm run dev          # Dev server (localhost:3000)
npm test             # Vitest unit tests (__tests__/**)
npm run test:e2e     # Playwright E2E (e2e/*.spec.ts)
npm run lint         # ESLint (enforces DAL-only DB access)
npm run db:push      # Sync Prisma schema → Neon DB
npm run db:studio    # Prisma Studio GUI
npm run seed         # Seed dev admin user
```

## Testing

- **Unit tests**: Mock `@/lib/prisma` with `vi.mock`. Reference `__tests__/dal/products.test.ts`.
- **E2E tests**: Seed test user via `e2e/global-setup.ts`. Admin credentials: `admin@inventory.dev`.
- DAL `import "server-only"` must also be mocked in unit tests (`vi.mock("server-only", () => ({}))`).
