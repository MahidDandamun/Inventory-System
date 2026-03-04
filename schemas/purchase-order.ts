import { z } from "zod"

const purchaseOrderItemSchema = z.object({
    rawMaterialId: z.string().min(1, { message: "Raw material is required" }),
    quantity: z.coerce.number().int().positive({ message: "Quantity must be positive" }),
    unitCost: z.coerce.number().positive({ message: "Unit cost must be positive" }),
})

export const purchaseOrderSchema = z.object({
    supplierId: z.string().min(1, { message: "Supplier is required" }),
    notes: z.string().optional().or(z.literal('')),
    items: z.array(purchaseOrderItemSchema).min(1, { message: "At least one item is required" }),
})

export const updatePurchaseOrderStatusSchema = z.object({
    status: z.enum(["DRAFT", "SENT", "PARTIALLY_RECEIVED", "RECEIVED", "CLOSED", "CANCELLED"]),
})

export type PurchaseOrderInput = z.infer<typeof purchaseOrderSchema>
export type PurchaseOrderItemInput = z.infer<typeof purchaseOrderItemSchema>
export type UpdatePurchaseOrderStatusInput = z.infer<typeof updatePurchaseOrderStatusSchema>
