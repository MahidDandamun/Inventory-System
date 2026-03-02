import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { createSystemLog } from "@/lib/dal/system-logs"
import { requireCurrentUser } from "@/lib/dal/guards"
import { recordStockMovement } from "@/lib/dal/stock-movements"
import { checkLowStock } from "@/lib/dal/notifications"

export type ProductDTO = {
    id: string
    name: string
    sku: string
    description: string | null
    price: number
    quantity: number
    warehouseId: string
    warehouseName: string
    status: "ACTIVE" | "INACTIVE"
    createdAt: Date
}

export const getProducts = cache(async (): Promise<ProductDTO[]> => {
    await requireCurrentUser()

    const products = await prisma.product.findMany({
        include: { warehouse: { select: { location: true } } },
        orderBy: { createdAt: "desc" },
    })

    return products.map((p: typeof products[number]) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        description: p.description,
        price: p.price.toNumber(),
        quantity: p.quantity,
        warehouseId: p.warehouseId,
        warehouseName: p.warehouse.location,
        status: p.status,
        createdAt: p.createdAt,
    }))
})

export async function getProductById(
    id: string
): Promise<ProductDTO | null> {
    await requireCurrentUser()

    const p = await prisma.product.findUnique({
        where: { id },
        include: { warehouse: { select: { location: true } } },
    })
    if (!p) return null

    return {
        id: p.id,
        name: p.name,
        sku: p.sku,
        description: p.description,
        price: p.price.toNumber(),
        quantity: p.quantity,
        warehouseId: p.warehouseId,
        warehouseName: p.warehouse.location,
        status: p.status,
        createdAt: p.createdAt,
    }
}

export async function createProduct(data: {
    name: string
    sku: string
    description?: string
    price: number
    quantity: number
    warehouseId: string
}) {
    const user = await requireCurrentUser()

    const product = await prisma.product.create({
        data: {
            name: data.name,
            sku: data.sku,
            description: data.description,
            price: data.price,
            quantity: data.quantity,
            warehouseId: data.warehouseId,
            createdById: user.id,
        },
    })

    if (data.quantity > 0) {
        await recordStockMovement({
            entity: "PRODUCT",
            entityId: product.id,
            type: "IN",
            quantity: data.quantity,
            reason: "Initial stock on creation",
            userId: user.id
        })
    }

    await createSystemLog(user.id, "CREATE", "PRODUCT", product.id, JSON.stringify(data))
    await checkLowStock()
    return product
}

export async function updateProduct(
    id: string,
    data: {
        name?: string
        sku?: string
        description?: string
        price?: number
        quantity?: number
        warehouseId?: string
        status?: "ACTIVE" | "INACTIVE"
    }
) {
    const user = await requireCurrentUser()

    const existing = await prisma.product.findUnique({ where: { id } })
    const product = await prisma.product.update({ where: { id }, data })

    if (existing && data.quantity !== undefined && data.quantity !== existing.quantity) {
        const diff = data.quantity - existing.quantity
        await recordStockMovement({
            entity: "PRODUCT",
            entityId: id,
            type: diff > 0 ? "IN" : "OUT",
            quantity: Math.abs(diff),
            reason: "Manual adjustment via update",
            userId: user.id
        })
    }

    await createSystemLog(user.id, "UPDATE", "PRODUCT", id, JSON.stringify(data))

    if (existing && data.quantity !== undefined && data.quantity !== existing.quantity) {
        await checkLowStock()
    }

    return product
}

export async function deleteProduct(id: string) {
    const user = await requireCurrentUser()

    const product = await prisma.product.delete({ where: { id } })
    await createSystemLog(user.id, "DELETE", "PRODUCT", id)
    return product
}
