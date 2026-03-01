// schemas/order.ts
// ---
// Zod schemas for order forms
// ---

import { z } from "zod"

export const orderItemSchema = z.object({
    productId: z.string().min(1, { message: "Product is required" }),
    quantity: z.coerce
        .number()
        .int()
        .positive({ message: "Quantity must be positive" }),
    unitPrice: z.coerce.number().positive({ message: "Price must be positive" }),
})

export const orderSchema = z.object({
    customer: z.string().min(1, { message: "Customer name is required" }),
    items: z
        .array(orderItemSchema)
        .min(1, { message: "At least one item is required" }),
})

export const orderStatusSchema = z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
])

export type OrderInput = z.infer<typeof orderSchema>
export type OrderItemInput = z.infer<typeof orderItemSchema>
export type OrderStatusInput = z.infer<typeof orderStatusSchema>
