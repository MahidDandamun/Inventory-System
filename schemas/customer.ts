import { z } from "zod"

export const customerSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email format" }).optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    billingAddress: z.string().optional().or(z.literal('')),
    shippingAddress: z.string().optional().or(z.literal('')),
    terms: z.string().optional().or(z.literal('')),
    status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
})

export type CustomerInput = z.infer<typeof customerSchema>
