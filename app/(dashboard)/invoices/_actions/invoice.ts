"use server"

import { revalidatePath } from "next/cache"
import { createInvoice, updateInvoice, deleteInvoice } from "@/lib/dal/invoices"
import { invoiceSchema } from "@/schemas/invoice"
import { notifyAdmins } from "@/lib/domain/notifications"
import { handleServerError } from "@/lib/error-handling"

export async function createInvoiceAction(formData: FormData) {
    const markAsPaidStr = formData.get("markAsPaid")
    const orderId = formData.get("orderId")

    const parsed = invoiceSchema.safeParse({
        orderId: orderId,
        markAsPaid: markAsPaidStr === "true" || markAsPaidStr === "on",
    })

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const invoice = await createInvoice(parsed.data)
        revalidatePath("/invoices")
        return { success: true, data: invoice }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function updateInvoiceAction(id: string, formData: FormData) {
    const markAsPaidStr = formData.get("markAsPaid")
    try {
        const invoice = await updateInvoice(id, {
            markAsPaid: markAsPaidStr === "true" || markAsPaidStr === "on"
        })

        if (invoice.paidAt) {
            await notifyAdmins(
                "Invoice Paid",
                `Invoice #${invoice.invoiceNo} has been marked as paid.`
            )
        }

        revalidatePath("/invoices")
        return { success: true, data: invoice }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function deleteInvoiceAction(id: string) {
    try {
        await deleteInvoice(id)
        revalidatePath("/invoices")
        return { success: true }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}
