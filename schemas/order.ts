// schemas/order.ts
// ---
// Zod schemas for order forms
// ---

import { z } from "zod"
import { ORDER_STATUS_VALUES } from "@/lib/order-status"

export const orderItemSchema = z.object({
    productId: z.string().min(1, { message: "Product is required" }),
    quantity: z.coerce
        .number()
        .int()
        .positive({ message: "Quantity must be positive" }),
    unitPrice: z.coerce.number().positive({ message: "Price must be positive" }),
})

export const orderSchema = z.object({
    customerName: z.string().optional(),
    customerId: z.string().optional(),
    items: z
        .array(orderItemSchema)
        .min(1, { message: "At least one item is required" }),
}).refine(data => data.customerName || data.customerId, {
    message: "Customer name or selection is required",
    path: ["customerId"]
})

export const orderStatusSchema = z.enum(ORDER_STATUS_VALUES)

export type OrderInput = z.infer<typeof orderSchema>
export type OrderItemInput = z.infer<typeof orderItemSchema>
export type OrderStatusInput = z.infer<typeof orderStatusSchema>
