import { z } from "zod"

export const supplierSchema = z.object({
    name: z.string().min(1, { message: "Supplier name is required" }),
    contactEmail: z.string().email({ message: "Invalid email format" }).optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
    terms: z.string().optional().or(z.literal('')),
    leadTimeDays: z.coerce.number().int().min(0, { message: "Lead time cannot be negative" }).optional().or(z.literal('')),
    status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
})

export type SupplierInput = z.infer<typeof supplierSchema>
