"use server"

import { revalidatePath } from "next/cache"
import { createInvoice, updateInvoice, deleteInvoice } from "@/lib/dal/invoices"
import { invoiceSchema } from "@/schemas/invoice"
import { createNotification } from "@/lib/dal/notifications"
import { getAllUsers } from "@/lib/dal/users"
import { validatedAction } from "@/lib/actions/safe-action"
import { z } from "zod"

export async function createInvoiceAction(formData: FormData) {
    const markAsPaidStr = formData.get("markAsPaid")
    const orderId = formData.get("orderId")

    return validatedAction(invoiceSchema, {
        orderId: orderId,
        markAsPaid: markAsPaidStr === "true" || markAsPaidStr === "on",
    }, async (data) => {
        const invoice = await createInvoice(data)
        revalidatePath("/invoices")
        return invoice
    })
}

export async function updateInvoiceAction(id: string, formData: FormData) {
    const markAsPaidStr = formData.get("markAsPaid")

    return validatedAction(invoiceSchema, {
        markAsPaid: markAsPaidStr === "true" || markAsPaidStr === "on"
    }, async (data) => {
        const invoice = await updateInvoice(id, data)

        // Notify admins if invoice was just paid
        if (invoice.paidAt) {
            const users = await getAllUsers()
            const admins = users.filter((u) => u.role === "ADMIN")
            for (const admin of admins) {
                await createNotification(admin.id, "Invoice Paid", `Invoice #${invoice.invoiceNo} has been marked as paid.`)
            }
        }

        revalidatePath("/invoices")
        return invoice
    })
}

export async function deleteInvoiceAction(id: string) {
    return validatedAction(z.any(), {}, async () => {
        await deleteInvoice(id)
        revalidatePath("/invoices")
        return null
    })
}
