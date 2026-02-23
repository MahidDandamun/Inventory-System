import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { createSystemLog } from "@/lib/dal/system-logs"

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

    const warehouse = await prisma.warehouse.create({
        data: {
            ...data,
            createdById: user.id,
        }
    })
    await createSystemLog(user.id, "CREATE", "WAREHOUSE", warehouse.id, JSON.stringify(data))
    return warehouse
}

export async function updateWarehouse(
    id: string,
    data: { location?: string; status?: "ACTIVE" | "INACTIVE" }
) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    const warehouse = await prisma.warehouse.update({ where: { id }, data })
    await createSystemLog(user.id, "UPDATE", "WAREHOUSE", id, JSON.stringify(data))
    return warehouse
}

export async function deleteWarehouse(id: string) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    const warehouse = await prisma.warehouse.delete({ where: { id } })
    await createSystemLog(user.id, "DELETE", "WAREHOUSE", id)
    return warehouse
}
