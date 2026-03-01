import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { createSystemLog } from "@/lib/dal/system-logs"
import { requireCurrentUser } from "@/lib/dal/guards"
import { createWithUniqueRetry, generateDocumentNumber } from "@/lib/document-number"

export type InvoiceDTO = {
    id: string
    invoiceNo: string
    orderNo: string
    customer: string
    total: number
    paidAt: Date | null
    createdAt: Date
}

export const getInvoices = cache(async (): Promise<InvoiceDTO[]> => {
    await requireCurrentUser()

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

export async function getInvoiceById(id: string) {
    await requireCurrentUser()

    return prisma.invoice.findUnique({
        where: { id },
        include: { order: true }
    })
}

export async function createInvoice(data: { orderId: string, markAsPaid?: boolean }) {
    const user = await requireCurrentUser()

    const order = await prisma.order.findUnique({ where: { id: data.orderId } })
    if (!order) throw new Error("Order not found")

    const invoice = await createWithUniqueRetry(() => prisma.invoice.create({
        data: {
            invoiceNo: generateDocumentNumber("INV"),
            orderId: data.orderId,
            total: order.total,
            paidAt: data.markAsPaid ? new Date() : null,
            createdById: user.id,
        }
    }))

    await createSystemLog(user.id, "CREATE", "INVOICE", invoice.id, JSON.stringify(data))
    return invoice
}

export async function updateInvoice(id: string, data: { markAsPaid?: boolean }) {
    const user = await requireCurrentUser()

    const invoice = await prisma.invoice.update({
        where: { id },
        data: {
            paidAt: data.markAsPaid ? new Date() : null,
        }
    })
    await createSystemLog(user.id, "UPDATE", "INVOICE", id, JSON.stringify(data))
    return invoice
}

export async function deleteInvoice(id: string) {
    const user = await requireCurrentUser()

    const invoice = await prisma.invoice.delete({ where: { id } })
    await createSystemLog(user.id, "DELETE", "INVOICE", id)
    return invoice
}
