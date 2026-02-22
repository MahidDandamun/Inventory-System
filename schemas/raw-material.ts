import { z } from "zod"

export const rawMaterialSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    sku: z.string().min(1, { message: "SKU is required" }),
    description: z.string().optional(),
    unit: z.string().min(1, { message: "Unit is required" }).default("pcs"),
    quantity: z.coerce.number().int().min(0, { message: "Quantity cannot be negative" }),
    reorderAt: z.coerce.number().int().min(0, { message: "Reorder point cannot be negative" }),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
})

export type RawMaterialInput = z.infer<typeof rawMaterialSchema>
