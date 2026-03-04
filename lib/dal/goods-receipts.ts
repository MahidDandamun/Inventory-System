import "server-only"
import { prisma } from "@/lib/prisma"
import { requireCurrentUser } from "@/lib/dal/guards"
import { GoodsReceiptInput } from "@/schemas/goods-receipt"
import { generateDocumentNumber, createWithUniqueRetry } from "@/lib/document-number"
import { createSystemLog } from "@/lib/dal/system-logs"
import { recordStockMovement } from "@/lib/dal/stock-movements"
import { PO_STATUS_FLOW } from "@/lib/po-status"
import { checkLowStock } from "@/lib/dal/notifications"
import { cache } from "react"

export type GoodsReceiptItemDTO = {
    id: string
    goodsReceiptId: string
    purchaseOrderItemId: string
    rawMaterialId: string
    quantityReceived: number
    rawMaterialName?: string
}

export type GoodsReceiptDTO = {
    id: string
    receiptNumber: string
    purchaseOrderId: string
    notes: string | null
    receivedAt: Date
    createdById: string | null
    items: GoodsReceiptItemDTO[]
}

export async function receiveGoods(data: GoodsReceiptInput): Promise<GoodsReceiptDTO> {
    const user = await requireCurrentUser()

    return createWithUniqueRetry(async () => {
        return prisma.$transaction(async (tx) => {
            const po = await tx.purchaseOrder.findUnique({
                where: { id: data.purchaseOrderId },
                include: { items: true, receipts: { include: { items: true } } },
            })

            if (!po) throw new Error("Purchase order not found")

            // Wait, what statuses can we receive from? DRAFT -> SENT -> PARTIALLY_RECEIVED -> RECEIVED
            // We can only receive if it's SENT or PARTIALLY_RECEIVED. Wait, PO_STATUS_FLOW applies here.
            // DRAFT should be "SENT" first. The user should "SEND" the PO. But wait, can we receive a SENT or PARTIALLY_RECEIVED PO?
            if (po.status !== "SENT" && po.status !== "PARTIALLY_RECEIVED") {
                throw new Error(`Cannot receive goods for PO in status: ${po.status}`)
            }

            const receiptNumber = generateDocumentNumber("GR")

            const receipt = await tx.goodsReceipt.create({
                data: {
                    receiptNumber,
                    purchaseOrderId: po.id,
                    createdById: user.id,
                    notes: data.notes,
                    items: {
                        create: data.items.map((item) => ({
                            purchaseOrderItemId: item.purchaseOrderItemId,
                            rawMaterialId: item.rawMaterialId,
                            quantityReceived: item.quantityReceived,
                        })),
                    },
                },
                include: { items: { include: { rawMaterial: true } } },
            })

            // Update stock and record movements for each item
            for (const item of receipt.items) {
                await tx.rawMaterial.update({
                    where: { id: item.rawMaterialId },
                    data: { quantity: { increment: item.quantityReceived } },
                })

                await recordStockMovement({
                    entity: "RAW_MATERIAL",
                    entityId: item.rawMaterialId,
                    type: "IN",
                    quantity: item.quantityReceived,
                    reason: `Goods receipt ${receiptNumber} for PO ${po.poNumber}`,
                    userId: user.id,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }, tx as any) // Type assertion if needed
            }

            // Figure out the new PO status
            // Check all receipt items across all receipts to see if it's fully received
            // `receipts` from `po` does not include the current `receipt`, so we combine them
            const allReceiptItems = [...po.receipts.flatMap((r) => r.items), ...receipt.items]

            const receivedQtyByItemId = allReceiptItems.reduce((acc, current) => {
                acc[current.purchaseOrderItemId] = (acc[current.purchaseOrderItemId] || 0) + current.quantityReceived
                return acc
            }, {} as Record<string, number>)

            let allFullyReceived = true
            for (const poItem of po.items) {
                const received = receivedQtyByItemId[poItem.id] || 0
                if (received < poItem.quantity) {
                    allFullyReceived = false
                    break
                }
            }

            const newStatus = allFullyReceived ? "RECEIVED" : "PARTIALLY_RECEIVED"

            await tx.purchaseOrder.update({
                where: { id: po.id },
                data: { status: newStatus },
            })

            // System log created outside the tx boundary, which is fine since the function doesn't support tx
            createSystemLog(user.id, "CREATE", "GOODS_RECEIPT", receipt.id, JSON.stringify({ receiptNumber, po: po.poNumber }))

            // Notifications. checkLowStock expects no args, reads DB, safe to call outside tx, but we can do it after tx
            // Wait, we receive stock so checkLowStock isn't strictly necessary, but good practice if it clears notifications
            // Actually checkLowStock creates notifications, it doesn't clear them natively. But let's leave it out or run it later.

            return {
                id: receipt.id,
                receiptNumber: receipt.receiptNumber,
                purchaseOrderId: receipt.purchaseOrderId,
                notes: receipt.notes,
                receivedAt: receipt.receivedAt,
                createdById: receipt.createdById,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                items: receipt.items.map((i: any) => ({
                    id: i.id,
                    goodsReceiptId: i.goodsReceiptId,
                    purchaseOrderItemId: i.purchaseOrderItemId,
                    rawMaterialId: i.rawMaterialId,
                    quantityReceived: i.quantityReceived,
                    rawMaterialName: i.rawMaterial.name
                }))
            }
        })
    })
}

export const getReceiptsByPurchaseOrderId = cache(async (poId: string): Promise<GoodsReceiptDTO[]> => {
    await requireCurrentUser()

    const receipts = await prisma.goodsReceipt.findMany({
        where: { purchaseOrderId: poId },
        include: {
            items: { include: { rawMaterial: true } }
        },
        orderBy: { receivedAt: "desc" }
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return receipts.map((r: any) => ({
        id: r.id,
        receiptNumber: r.receiptNumber,
        purchaseOrderId: r.purchaseOrderId,
        notes: r.notes,
        receivedAt: r.receivedAt,
        createdById: r.createdById,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: r.items.map((i: any) => ({
            id: i.id,
            goodsReceiptId: i.goodsReceiptId,
            purchaseOrderItemId: i.purchaseOrderItemId,
            rawMaterialId: i.rawMaterialId,
            quantityReceived: i.quantityReceived,
            rawMaterialName: i.rawMaterial.name
        }))
    }))
})
