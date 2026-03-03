import { z } from "zod"

export const billOfMaterialSchema = z.object({
    productId: z.string().min(1, { message: "Product is required" }),
    rawMaterialId: z.string().min(1, { message: "Raw Material is required" }),
    quantity: z.coerce.number().positive({ message: "Quantity must be positive" }),
})

export type BillOfMaterialInput = z.infer<typeof billOfMaterialSchema>
