import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { requireCurrentUser } from "@/lib/dal/guards"
import { createSystemLog } from "@/lib/dal/system-logs"
import { generateDocumentNumber, createWithUniqueRetry } from "@/lib/document-number"
import { canTransitionPOStatus, type POStatus } from "@/lib/po-status"
import type { PurchaseOrderInput } from "@/schemas/purchase-order"

// ── DTO types ──
export type PurchaseOrderItemDTO = {
    id: string
    rawMaterialId: string
    rawMaterialName: string
    rawMaterialSku: string
    quantity: number
    unitCost: number
}

export type PurchaseOrderDTO = {
    id: string
    poNumber: string
    supplierId: string
    supplierName: string
    status: POStatus
    total: number
    notes: string | null
    createdAt: Date
    updatedAt: Date
    items: PurchaseOrderItemDTO[]
}

export type PurchaseOrderListDTO = {
    id: string
    poNumber: string
    supplierName: string
    status: POStatus
    total: number
    itemCount: number
    createdAt: Date
}

// ── List (cached) ──
export const getPurchaseOrders = cache(async (): Promise<PurchaseOrderListDTO[]> => {
    await requireCurrentUser()

    const orders = await prisma.purchaseOrder.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            supplier: { select: { name: true } },
            _count: { select: { items: true } },
        },
    })

    return orders.map((po) => ({
        id: po.id,
        poNumber: po.poNumber,
        supplierName: po.supplier.name,
        status: po.status as POStatus,
        total: po.total.toNumber(),
        itemCount: po._count.items,
        createdAt: po.createdAt,
    }))
})

// ── Get by ID ──
export async function getPurchaseOrderById(id: string): Promise<PurchaseOrderDTO | null> {
    await requireCurrentUser()

    const po = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: {
            supplier: { select: { name: true } },
            items: {
                include: {
                    rawMaterial: { select: { name: true, sku: true } },
                },
            },
        },
    })

    if (!po) return null

    return {
        id: po.id,
        poNumber: po.poNumber,
        supplierId: po.supplierId,
        supplierName: po.supplier.name,
        status: po.status as POStatus,
        total: po.total.toNumber(),
        notes: po.notes,
        createdAt: po.createdAt,
        updatedAt: po.updatedAt,
        items: po.items.map((item) => ({
            id: item.id,
            rawMaterialId: item.rawMaterialId,
            rawMaterialName: item.rawMaterial.name,
            rawMaterialSku: item.rawMaterial.sku,
            quantity: item.quantity,
            unitCost: item.unitCost.toNumber(),
        })),
    }
}

// ── Create (transaction: PO + items) ──
export async function createPurchaseOrder(data: PurchaseOrderInput): Promise<PurchaseOrderDTO> {
    const user = await requireCurrentUser()

    const total = data.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0)

    const po = await createWithUniqueRetry(async () => {
        return prisma.$transaction(async (tx) => {
            const purchaseOrder = await tx.purchaseOrder.create({
                data: {
                    poNumber: generateDocumentNumber("PO"),
                    supplierId: data.supplierId,
                    total,
                    notes: data.notes || null,
                    createdById: user.id,
                },
            })

            for (const item of data.items) {
                await tx.purchaseOrderItem.create({
                    data: {
                        purchaseOrderId: purchaseOrder.id,
                        rawMaterialId: item.rawMaterialId,
                        quantity: item.quantity,
                        unitCost: item.unitCost,
                    },
                })
            }

            return purchaseOrder
        })
    })

    await createSystemLog(user.id, "CREATE", "PURCHASE_ORDER", po.id, `Created PO ${po.poNumber}`)

    // Re-fetch with relations for full DTO
    const result = await getPurchaseOrderById(po.id)
    return result!
}

// ── Update status ──
export async function updatePurchaseOrderStatus(
    id: string,
    newStatus: POStatus
): Promise<PurchaseOrderDTO> {
    const user = await requireCurrentUser()

    const existing = await prisma.purchaseOrder.findUnique({ where: { id } })
    if (!existing) throw new Error("Purchase order not found")

    const currentStatus = existing.status as POStatus
    if (!canTransitionPOStatus(currentStatus, newStatus)) {
        throw new Error(`Cannot transition PO from ${currentStatus} to ${newStatus}`)
    }

    await prisma.purchaseOrder.update({
        where: { id },
        data: { status: newStatus },
    })

    await createSystemLog(
        user.id,
        "UPDATE",
        "PURCHASE_ORDER",
        id,
        `Updated PO status from ${currentStatus} to ${newStatus}`
    )

    const result = await getPurchaseOrderById(id)
    return result!
}

// ── Delete ──
export async function deletePurchaseOrder(id: string): Promise<void> {
    const user = await requireCurrentUser()

    const po = await prisma.purchaseOrder.findUnique({ where: { id } })
    if (!po) throw new Error("Purchase order not found")

    if (po.status !== "DRAFT") {
        throw new Error("Only DRAFT purchase orders can be deleted")
    }

    await prisma.purchaseOrder.delete({ where: { id } })

    await createSystemLog(user.id, "DELETE", "PURCHASE_ORDER", po.id, `Deleted PO ${po.poNumber}`)
}
