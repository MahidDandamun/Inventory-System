import { z } from "zod"

export const goodsReceiptItemSchema = z.object({
    purchaseOrderItemId: z.string().min(1, "Item selection is required"),
    rawMaterialId: z.string().min(1, "Material ID is required"),
    quantityReceived: z.coerce.number().int().min(1, "Quantity must be at least 1"),
})

export const goodsReceiptSchema = z.object({
    purchaseOrderId: z.string().min(1, "Purchase order is required"),
    notes: z.string().optional(),
    items: z.array(goodsReceiptItemSchema).min(1, "At least one item must be received"),
})

export type GoodsReceiptInput = z.infer<typeof goodsReceiptSchema>
