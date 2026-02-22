import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

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

export async function getInvoiceById(id: string) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.invoice.findUnique({
        where: { id },
        include: { order: true }
    })
}

export async function createInvoice(data: { orderId: string, markAsPaid?: boolean }) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    const order = await prisma.order.findUnique({ where: { id: data.orderId } })
    if (!order) throw new Error("Order not found")

    const invoiceNo = `INV-${Date.now().toString().slice(-6)}`

    return prisma.invoice.create({
        data: {
            invoiceNo,
            orderId: data.orderId,
            total: order.total,
            paidAt: data.markAsPaid ? new Date() : null,
        }
    })
}

export async function updateInvoice(id: string, data: { markAsPaid?: boolean }) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.invoice.update({
        where: { id },
        data: {
            paidAt: data.markAsPaid ? new Date() : null,
        }
    })
}

export async function deleteInvoice(id: string) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.invoice.delete({ where: { id } })
}
