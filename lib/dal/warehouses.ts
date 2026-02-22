import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export type WarehouseDTO = {
    id: string
    location: string
    status: "ACTIVE" | "INACTIVE"
    productCount: number
    createdAt: Date
}

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

export async function createWarehouse(data: { location: string }) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.warehouse.create({ data })
}

export async function updateWarehouse(
    id: string,
    data: { location?: string; status?: "ACTIVE" | "INACTIVE" }
) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.warehouse.update({ where: { id }, data })
}

export async function deleteWarehouse(id: string) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.warehouse.delete({ where: { id } })
}
