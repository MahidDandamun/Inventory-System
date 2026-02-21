// lib/dal/products.ts
// ---
// Data Access Layer — Product operations
// Security boundary: auth checks + DTO transformation
// ---

import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

/** DTO — only fields the UI needs */
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

/**
 * Get all products. Requires authentication.
 * Returns DTOs — never raw Prisma models.
 */
export const getProducts = cache(async (): Promise<ProductDTO[]> => {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

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

/**
 * Get a single product by ID. Requires authentication.
 */
export async function getProductById(
    id: string
): Promise<ProductDTO | null> {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

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

/**
 * Create a new product. Called by server actions only.
 */
export async function createProduct(data: {
    name: string
    sku: string
    description?: string
    price: number
    quantity: number
    warehouseId: string
}) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.product.create({
        data: {
            name: data.name,
            sku: data.sku,
            description: data.description,
            price: data.price,
            quantity: data.quantity,
            warehouseId: data.warehouseId,
        },
    })
}

/**
 * Update a product by ID.
 */
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
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.product.update({ where: { id }, data })
}

/**
 * Delete a product by ID.
 */
export async function deleteProduct(id: string) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.product.delete({ where: { id } })
}
