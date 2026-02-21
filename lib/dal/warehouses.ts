// lib/dal/warehouses.ts
// ---
// Data Access Layer — Warehouse operations
// ---

import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

/** DTO for warehouse list/detail views */
export type WarehouseDTO = {
    id: string
    location: string
    status: "ACTIVE" | "INACTIVE"
    productCount: number
    createdAt: Date
}

/**
 * Get all warehouses with product count.
 */
export const getWarehouses = cache(async (): Promise<WarehouseDTO[]> => {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    const warehouses = await prisma.warehouse.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { createdAt: "desc" },
    })

    return warehouses.map((w: typeof warehouses[number]) => ({
        id: w.id,
        location: w.location,
        status: w.status,
        productCount: w._count.products,
        createdAt: w.createdAt,
    }))
})

/**
 * Get a single warehouse by ID.
 */
export async function getWarehouseById(
    id: string
): Promise<WarehouseDTO | null> {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    const w = await prisma.warehouse.findUnique({
        where: { id },
        include: { _count: { select: { products: true } } },
    })
    if (!w) return null

    return {
        id: w.id,
        location: w.location,
        status: w.status,
        productCount: w._count.products,
        createdAt: w.createdAt,
    }
}

/**
 * Create a new warehouse.
 */
export async function createWarehouse(data: { location: string }) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.warehouse.create({ data })
}

/**
 * Update a warehouse.
 */
export async function updateWarehouse(
    id: string,
    data: { location?: string; status?: "ACTIVE" | "INACTIVE" }
) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.warehouse.update({ where: { id }, data })
}

/**
 * Delete a warehouse. Fails if warehouse has products.
 */
export async function deleteWarehouse(id: string) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.warehouse.delete({ where: { id } })
}
