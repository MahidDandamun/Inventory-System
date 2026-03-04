import { z } from "zod"
import { TRANSFER_STATUS_VALUES } from "@/lib/transfer-status"

export const transferItemSchema = z.object({
    productId: z.string().min(1, { message: "Product is required" }),
    quantity: z.coerce
        .number()
        .int()
        .positive({ message: "Quantity must be positive" }),
})

export const transferSchema = z.object({
    sourceWarehouseId: z.string().min(1, { message: "Source warehouse is required" }),
    destinationWarehouseId: z.string().min(1, { message: "Destination warehouse is required" }),
    notes: z.string().optional(),
    items: z
        .array(transferItemSchema)
        .min(1, { message: "At least one item is required" }),
}).refine(data => data.sourceWarehouseId !== data.destinationWarehouseId, {
    message: "Source and destination warehouses must be different",
    path: ["destinationWarehouseId"]
})

export const transferStatusSchema = z.enum(TRANSFER_STATUS_VALUES as unknown as [string, ...string[]])

export type TransferInput = z.infer<typeof transferSchema>
export type TransferItemInput = z.infer<typeof transferItemSchema>
export type TransferStatusInput = z.infer<typeof transferStatusSchema>
