# Code Patterns — Copy-Paste Templates

> Agents: use these templates when creating new files. Do NOT read existing source files to learn patterns.

---

## 1. DAL Function (read — list)

```typescript
import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { requireCurrentUser } from "@/lib/dal/guards"

// ── DTO type ──
export type FeatureDTO = {
    id: string
    name: string
    // ... map every field you need, never return raw Prisma model
    createdAt: Date
}

// ── List function (cached) ──
export const getFeatures = cache(async (): Promise<FeatureDTO[]> => {
    await requireCurrentUser()

    const items = await prisma.feature.findMany({
        orderBy: { createdAt: "desc" },
    })

    return items.map((item: typeof items[number]) => ({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt,
    }))
})
```

---

## 2. DAL Function (read — by ID)

```typescript
export async function getFeatureById(
    id: string
): Promise<FeatureDTO | null> {
    await requireCurrentUser()

    const item = await prisma.feature.findUnique({ where: { id } })
    if (!item) return null

    return {
        id: item.id,
        name: item.name,
        createdAt: item.createdAt,
    }
}
```

---

## 3. DAL Function (write — create)

```typescript
export async function createFeature(data: {
    name: string
    // ... validated fields from Zod schema
}) {
    const user = await requireCurrentUser()

    const item = await prisma.feature.create({
        data: {
            name: data.name,
            createdById: user.id,
        },
    })

    await createSystemLog(user.id, "CREATE", "FEATURE", item.id, JSON.stringify(data))
    return item
}
```

---

## 4. Server Action

```typescript
"use server"

import { revalidatePath } from "next/cache"
import { createFeature } from "@/lib/dal/features"
import { featureSchema } from "@/schemas/feature"
import { handleServerError } from "@/lib/error-handling"

export async function createFeatureAction(formData: FormData) {
    const parsed = featureSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const item = await createFeature(parsed.data)
        revalidatePath("/features")
        return { success: true, data: item }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}
```

---

## 5. Zod Schema

```typescript
import { z } from "zod"

export const featureSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    price: z.coerce.number().positive({ message: "Price must be positive" }),
    quantity: z.coerce.number().int().min(0, { message: "Cannot be negative" }),
    relatedId: z.string().min(1, { message: "Selection is required" }),
})

export type FeatureInput = z.infer<typeof featureSchema>
```

**Key patterns**:
- `z.coerce.number()` — converts form string to number
- `z.coerce.number().int()` — integer only
- `.min(1, { message: "..." })` — required strings with custom error
- Export `type XxxInput = z.infer<typeof schema>` for form typing

---

## 6. Status Transition Map

```typescript
export const FEATURE_STATUS_VALUES = [
    "ACTIVE",
    "INACTIVE",
    "ARCHIVED",
] as const

export type FeatureStatus = (typeof FEATURE_STATUS_VALUES)[number]

export const FEATURE_STATUS_FLOW: Record<FeatureStatus, FeatureStatus[]> = {
    ACTIVE: ["INACTIVE", "ARCHIVED"],
    INACTIVE: ["ACTIVE", "ARCHIVED"],
    ARCHIVED: [],  // terminal state
}

export function canTransitionFeatureStatus(from: FeatureStatus, to: FeatureStatus) {
    if (from === to) return true
    return FEATURE_STATUS_FLOW[from].includes(to)
}
```

---

## 7. Error Handling in Actions

```typescript
// Always use this pattern in catch blocks:
catch (error: unknown) {
    return handleServerError(error)
}

// handleServerError handles:
// - Prisma P2002 (duplicate) → "A record with this identifier already exists."
// - Prisma P2003 (foreign key) → "This record is referenced..."
// - Error instances → error.message
// - Unknown → "An unexpected error occurred"
```

---

## 8. Multi-Table Mutation (Transaction)

```typescript
export async function createOrderWithItems(data: OrderInput) {
    const user = await requireCurrentUser()

    return prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: { /* ... */ },
        })

        for (const item of data.items) {
            await tx.orderItem.create({
                data: { orderId: order.id, /* ... */ },
            })

            // Decrement stock
            await tx.product.update({
                where: { id: item.productId },
                data: { quantity: { decrement: item.quantity } },
            })
        }

        return order
    })
}
```

**Rule**: Always use `tx` (the transaction client) inside `$transaction`, not `prisma`.

---

## 9. Decimal Fields (Prisma → DTO)

```typescript
// Prisma Decimal fields need .toNumber() in DTO mapping:
return {
    price: item.price.toNumber(),  // Decimal → number
    total: item.total.toNumber(),
}
```
