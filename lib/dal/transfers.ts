import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { requireCurrentUser } from "@/lib/dal/guards"
import {
    TransferStatus,
    WarehouseTransfer,
    WarehouseTransferItem,
    Product
} from "@prisma/client"
import { generateDocumentNumber, createWithUniqueRetry } from "@/lib/document-number"
import { createSystemLog } from "@/lib/dal/system-logs"
import { recordStockMovement } from "@/lib/dal/stock-movements"
import { canTransitionTransferStatus } from "@/lib/transfer-status"
import { TransferInput } from "@/schemas/transfer"

export type TransferItemDTO = {
    id: string
    productId: string
    productName: string
    sku: string
    quantity: number
}

export type TransferDTO = {
    id: string
    transferNumber: string
    sourceWarehouseId: string
    sourceWarehouseName: string
    destinationWarehouseId: string
    destinationWarehouseName: string
    status: TransferStatus
    notes: string | null
    createdById: string | null
    createdByEmail?: string | null
    createdAt: Date
    updatedAt: Date
    items: TransferItemDTO[]
}

function toTransferDTO(
    transfer: WarehouseTransfer & {
        sourceWarehouse: { location: string }
        destinationWarehouse: { location: string }
        createdBy: { email: string | null } | null
        items: (WarehouseTransferItem & { product: Product })[]
    }
): TransferDTO {
    return {
        id: transfer.id,
        transferNumber: transfer.transferNumber,
        sourceWarehouseId: transfer.sourceWarehouseId,
        sourceWarehouseName: transfer.sourceWarehouse.location,
        destinationWarehouseId: transfer.destinationWarehouseId,
        destinationWarehouseName: transfer.destinationWarehouse.location,
        status: transfer.status,
        notes: transfer.notes,
        createdById: transfer.createdById,
        createdByEmail: transfer.createdBy?.email,
        createdAt: transfer.createdAt,
        updatedAt: transfer.updatedAt,
        items: transfer.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: item.product.name,
            sku: item.product.sku,
            quantity: item.quantity,
        })),
    }
}

export const getTransfers = cache(async (): Promise<TransferDTO[]> => {
    await requireCurrentUser()

    const transfers = await prisma.warehouseTransfer.findMany({
        include: {
            sourceWarehouse: { select: { location: true } },
            destinationWarehouse: { select: { location: true } },
            createdBy: { select: { email: true } },
            items: { include: { product: true } },
        },
        orderBy: { createdAt: "desc" },
    })

    return transfers.map((t) => toTransferDTO(t))
})

export const getTransferById = cache(async (id: string): Promise<TransferDTO | null> => {
    await requireCurrentUser()

    const transfer = await prisma.warehouseTransfer.findUnique({
        where: { id },
        include: {
            sourceWarehouse: { select: { location: true } },
            destinationWarehouse: { select: { location: true } },
            createdBy: { select: { email: true } },
            items: { include: { product: true } },
        },
    })

    if (!transfer) return null

    return toTransferDTO(transfer)
})

export async function createTransfer(data: TransferInput) {
    const user = await requireCurrentUser()

    return await createWithUniqueRetry(async () => {
        return await prisma.$transaction(async (tx) => {
            const transfer = await tx.warehouseTransfer.create({
                data: {
                    transferNumber: generateDocumentNumber("TR"),
                    sourceWarehouseId: data.sourceWarehouseId,
                    destinationWarehouseId: data.destinationWarehouseId,
                    notes: data.notes,
                    createdById: user.id,
                    items: {
                        create: data.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                        })),
                    },
                },
            })

            await createSystemLog(
                user.id,
                "CREATE",
                "WAREHOUSE_TRANSFER",
                transfer.id,
                JSON.stringify(data),
                tx
            )

            return transfer
        })
    })
}

export async function updateTransferStatus(id: string, newStatus: TransferStatus) {
    const user = await requireCurrentUser()

    return await prisma.$transaction(async (tx) => {
        const transfer = await tx.warehouseTransfer.findUnique({
            where: { id },
            include: { items: { include: { product: true } } },
        })

        if (!transfer) throw new Error("Transfer not found")

        if (!canTransitionTransferStatus(transfer.status, newStatus)) {
            throw new Error(`Cannot transition from ${transfer.status} to ${newStatus}`)
        }

        // Logic for receiving stock
        if (newStatus === "RECEIVED" && transfer.status !== "RECEIVED") {
            for (const item of transfer.items) {
                // 1. Decrement source warehouse stock (Product must exist in source warehouse table if it has unique ID per warehouse)
                // Wait, in this schema, Product is pinned to a Warehouse via warehouseId.
                // If we transfer between warehouses, we are essentially moving quantities between Product records.
                // Or if the destination warehouse doesn't have this SKU yet, we need to create a new Product record.

                const sourceProduct = await tx.product.findUnique({
                    where: { id: item.productId }
                })

                if (!sourceProduct) throw new Error(`Product ${item.product.sku} not found in source warehouse`)

                if (sourceProduct.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for ${sourceProduct.sku} in source warehouse`)
                }

                // Decrement source
                await tx.product.update({
                    where: { id: item.productId },
                    data: { quantity: { decrement: item.quantity } }
                })

                await recordStockMovement({
                    entity: "PRODUCT",
                    entityId: item.productId,
                    type: "OUT",
                    quantity: item.quantity,
                    reason: `Transfer OUT to ${transfer.destinationWarehouseId} (${transfer.transferNumber})`,
                    userId: user.id
                }, tx)

                // 2. Increment destination warehouse stock
                // Find product with same SKU in destination warehouse
                let destProduct = await tx.product.findFirst({
                    where: {
                        sku: sourceProduct.sku,
                        warehouseId: transfer.destinationWarehouseId
                    }
                })

                if (destProduct) {
                    await tx.product.update({
                        where: { id: destProduct.id },
                        data: { quantity: { increment: item.quantity } }
                    })
                } else {
                    // Create new product record if SKU not in dest warehouse
                    destProduct = await tx.product.create({
                        data: {
                            name: sourceProduct.name,
                            sku: sourceProduct.sku,
                            description: sourceProduct.description,
                            price: sourceProduct.price,
                            quantity: item.quantity,
                            warehouseId: transfer.destinationWarehouseId,
                            createdById: user.id,
                            reorderPoint: sourceProduct.reorderPoint,
                            reorderQuantity: sourceProduct.reorderQuantity,
                            maxQuantity: sourceProduct.maxQuantity
                        }
                    })
                }

                await recordStockMovement({
                    entity: "PRODUCT",
                    entityId: destProduct.id,
                    type: "IN",
                    quantity: item.quantity,
                    reason: `Transfer IN from ${transfer.sourceWarehouseId} (${transfer.transferNumber})`,
                    userId: user.id
                }, tx)
            }
        }

        const updated = await tx.warehouseTransfer.update({
            where: { id },
            data: { status: newStatus }
        })

        await createSystemLog(
            user.id,
            "UPDATE_STATUS",
            "WAREHOUSE_TRANSFER",
            id,
            `Status changed to ${newStatus}`,
            tx
        )

        return updated
    })
}
