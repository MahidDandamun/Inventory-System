import { z } from "zod";
import { INVOICE_STATUS_VALUES } from "@/lib/invoice-status";

const optionalDateSchema = z.preprocess(
	(value) => (value === "" || value === undefined ? null : value),
	z.coerce.date().nullable(),
);

export const invoiceSchema = z.object({
	orderId: z.string().min(1, { message: "Order is required" }),
	dueDate: optionalDateSchema.optional(),
	status: z.enum(INVOICE_STATUS_VALUES).default("DRAFT"),
});

export const updateInvoiceSchema = z.object({
	dueDate: optionalDateSchema.optional(),
	status: z.enum(INVOICE_STATUS_VALUES).optional(),
});

export const paymentSchema = z.object({
	invoiceId: z.string().min(1, { message: "Invoice is required" }),
	amount: z.coerce.number().positive({ message: "Payment amount must be greater than 0" }),
	method: z.string().min(1, { message: "Payment method is required" }),
	reference: z.string().optional(),
	paidAt: optionalDateSchema.optional(),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
