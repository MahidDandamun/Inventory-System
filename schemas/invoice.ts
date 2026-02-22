import { z } from "zod"

export const invoiceSchema = z.object({
    orderId: z.string().min(1, { message: "Order is required" }),
    markAsPaid: z.boolean().default(false),
})

export type InvoiceInput = z.infer<typeof invoiceSchema>
