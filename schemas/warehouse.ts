// schemas/warehouse.ts
// ---
// Zod schemas for warehouse forms
// ---

import { z } from "zod"

export const warehouseSchema = z.object({
    location: z.string().min(1, { message: "Location is required" }),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
})

export type WarehouseInput = z.infer<typeof warehouseSchema>
