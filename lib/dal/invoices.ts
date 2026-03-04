import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { createSystemLog } from "@/lib/dal/system-logs"
import { requireCurrentUser } from "@/lib/dal/guards"
import { createWithUniqueRetry, generateDocumentNumber } from "@/lib/document-number"
import type { Invoice } from "@prisma/client"

export type InvoiceDTO = {
    id: string
    invoiceNo: string
    orderNo: string
    customer: string
    total: number
    paidAt: Date | null
    createdAt: Date
}

export type InvoiceDetailDTO = InvoiceDTO & {
    orderId: string
}

export function toInvoiceDTO(invoice: Invoice & { order: { orderNo: string, customerName: string | null, customerRef?: { name: string } | null } }): InvoiceDTO {
    return {
        id: invoice.id,
        invoiceNo: invoice.invoiceNo,
        orderNo: invoice.order.orderNo,
        customer: invoice.order.customerRef?.name || invoice.order.customerName || '',
        total: typeof invoice.total?.toNumber === 'function' ? invoice.total.toNumber() : Number(invoice.total),
        paidAt: invoice.paidAt,
        createdAt: invoice.createdAt,
    }
}

export function toInvoiceDetailDTO(invoice: Invoice & { order: { orderNo: string, customerName: string | null, customerRef?: { name: string } | null } }): InvoiceDetailDTO {
    return {
        ...toInvoiceDTO(invoice),
        orderId: invoice.orderId,
    }
}

export const getInvoices = cache(async (): Promise<InvoiceDTO[]> => {
    await requireCurrentUser()

    const invoices = await prisma.invoice.findMany({
        include: {
            order: { select: { orderNo: true, customerName: true, customerRef: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
    })

    return invoices.map((inv) => toInvoiceDTO(inv))
})

export async function getInvoiceById(id: string): Promise<InvoiceDetailDTO | null> {
    await requireCurrentUser()

    const inv = await prisma.invoice.findUnique({
        where: { id },
        include: { order: { select: { orderNo: true, customerName: true, customerRef: { select: { name: true } } } } }
    })
    if (!inv) return null

    return toInvoiceDetailDTO(inv)
}

export async function createInvoice(data: { orderId: string, markAsPaid?: boolean }): Promise<InvoiceDetailDTO> {
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
        },
        include: { order: { select: { orderNo: true, customerName: true, customerRef: { select: { name: true } } } } }
    }))

    await createSystemLog(user.id, "CREATE", "INVOICE", invoice.id, JSON.stringify(data))
    return toInvoiceDetailDTO(invoice)
}

export async function updateInvoice(id: string, data: { markAsPaid?: boolean }): Promise<InvoiceDetailDTO> {
    const user = await requireCurrentUser()

    const invoice = await prisma.invoice.update({
        where: { id },
        data: {
            paidAt: data.markAsPaid ? new Date() : null,
        },
        include: { order: { select: { orderNo: true, customerName: true, customerRef: { select: { name: true } } } } }
    })
    await createSystemLog(user.id, "UPDATE", "INVOICE", id, JSON.stringify(data))
    return toInvoiceDetailDTO(invoice)
}

export async function deleteInvoice(id: string): Promise<InvoiceDetailDTO> {
    const user = await requireCurrentUser()

    const invoice = await prisma.invoice.delete({
        where: { id },
        include: { order: { select: { orderNo: true, customerName: true, customerRef: { select: { name: true } } } } }
    })
    await createSystemLog(user.id, "DELETE", "INVOICE", id)
    return toInvoiceDetailDTO(invoice)
}
