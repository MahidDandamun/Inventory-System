import { z } from "zod"

export const stockMovementSchema = z.object({
    entity: z.enum(["PRODUCT", "RAW_MATERIAL"]),
    entityId: z.string().min(1, { message: "Item definition is required" }),
    type: z.enum(["IN", "OUT", "ADJUST"]),
    quantity: z.coerce.number().int().min(1, { message: "Quantity must be at least 1" }),
    reason: z.string().min(1, { message: "Reason is required" }),
})

export type StockMovementInput = z.infer<typeof stockMovementSchema>
