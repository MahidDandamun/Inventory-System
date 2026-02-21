// schemas/product.ts
// ---
// Zod schemas for product forms and server actions
// ---

import { z } from "zod"

export const productSchema = z.object({
    name: z.string().min(1, { message: "Product name is required" }),
    sku: z.string().min(1, { message: "SKU is required" }),
    description: z.string().optional(),
    price: z.coerce.number().positive({ message: "Price must be positive" }),
    quantity: z.coerce
        .number()
        .int()
        .min(0, { message: "Quantity cannot be negative" }),
    warehouseId: z.string().min(1, { message: "Warehouse is required" }),
})

export type ProductInput = z.infer<typeof productSchema>
