"use server"

import { revalidatePath } from "next/cache"
import { createInvoice, updateInvoice, deleteInvoice } from "@/lib/dal/invoices"
import { invoiceSchema } from "@/schemas/invoice"
import { createNotification } from "@/lib/dal/notifications"
import { getAllUsers } from "@/lib/dal/users"

export async function createInvoiceAction(formData: FormData) {
    const markAsPaidStr = formData.get("markAsPaid")

    const parsed = invoiceSchema.safeParse({
        orderId: formData.get("orderId"),
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
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return { error: { root: ["An invoice already exists for this order."] } }
        }
        return { error: { root: [error instanceof Error ? error.message : "Unknown error"] } }
    }
}

export async function updateInvoiceAction(id: string, formData: FormData) {
    const markAsPaidStr = formData.get("markAsPaid")
    try {
        const invoice = await updateInvoice(id, {
            markAsPaid: markAsPaidStr === "true" || markAsPaidStr === "on"
        })

        // Notify admins if invoice was just paid
        if (invoice.paidAt) {
            const users = await getAllUsers()
            const admins = users.filter((u) => u.role === "ADMIN")
            for (const admin of admins) {
                await createNotification(admin.id, "Invoice Paid", `Invoice #${invoice.invoiceNo} has been marked as paid.`)
            }
        }

        revalidatePath("/invoices")
        return { success: true, data: invoice }
    } catch (error: unknown) {
        return { error: { root: [error instanceof Error ? error.message : "Unknown error"] } }
    }
}

export async function deleteInvoiceAction(id: string) {
    try {
        await deleteInvoice(id)
        revalidatePath("/invoices")
        return { success: true }
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : "Unknown error" }
    }
}
