"use server"

import { revalidatePath } from "next/cache"
import { createInvoice, updateInvoice, deleteInvoice } from "@/lib/dal/invoices"
import { recordPayment } from "@/lib/dal/payments"
import { invoiceSchema, paymentSchema, updateInvoiceSchema } from "@/schemas/invoice"
import { validatedAction } from "@/lib/actions/safe-action"
import { z } from "zod"

export async function createInvoiceAction(formData: FormData) {
    return validatedAction(invoiceSchema, formData, async (data) => {
        const invoice = await createInvoice(data)
        revalidatePath("/invoices")
        return invoice
    })
}

export async function updateInvoiceAction(id: string, formData: FormData) {
    return validatedAction(updateInvoiceSchema, formData, async (data) => {
        const invoice = await updateInvoice(id, data)
        revalidatePath("/invoices")
        revalidatePath(`/invoices/${id}`)
        return invoice
    })
}

export async function recordPaymentAction(formData: FormData) {
    return validatedAction(paymentSchema, formData, async (data) => {
        const payment = await recordPayment({
            invoiceId: data.invoiceId,
            amount: data.amount,
            method: data.method,
            reference: data.reference,
            paidAt: data.paidAt ?? undefined,
        })

        revalidatePath("/invoices")
        revalidatePath(`/invoices/${data.invoiceId}`)
        return payment
    })
}

export async function deleteInvoiceAction(id: string) {
    return validatedAction(z.any(), {}, async () => {
        await deleteInvoice(id)
        revalidatePath("/invoices")
        return null
    })
}
