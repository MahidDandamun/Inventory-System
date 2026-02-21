// lib/dal/invoices.ts
// ---
// Data Access Layer — Invoice operations
// ---

import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

/** DTO for invoice list views */
export type InvoiceDTO = {
    id: string
    invoiceNo: string
    orderNo: string
    customer: string
    total: number
    paidAt: Date | null
    createdAt: Date
}

/**
 * Get all invoices with order details.
 */
export const getInvoices = cache(async (): Promise<InvoiceDTO[]> => {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    const invoices = await prisma.invoice.findMany({
        include: {
            order: { select: { orderNo: true, customer: true } },
        },
        orderBy: { createdAt: "desc" },
    })

    return invoices.map((inv) => ({
        id: inv.id,
        invoiceNo: inv.invoiceNo,
        orderNo: inv.order.orderNo,
        customer: inv.order.customer,
        total: inv.total.toNumber(),
        paidAt: inv.paidAt,
        createdAt: inv.createdAt,
    }))
})
