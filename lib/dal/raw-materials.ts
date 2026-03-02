import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { createSystemLog } from "@/lib/dal/system-logs"
import { requireCurrentUser } from "@/lib/dal/guards"
import { recordStockMovement } from "@/lib/dal/stock-movements"
import { checkLowStock } from "@/lib/dal/notifications"

export type RawMaterialDTO = {
    id: string
    name: string
    sku: string
    description: string | null
    unit: string
    quantity: number
    reorderAt: number
    status: "ACTIVE" | "INACTIVE"
    createdAt: Date
}

export const getRawMaterials = cache(async (): Promise<RawMaterialDTO[]> => {
    await requireCurrentUser()

    const items = await prisma.rawMaterial.findMany({
        orderBy: { createdAt: "desc" },
    })

    return items.map((m: typeof items[number]) => ({
        id: m.id,
        name: m.name,
        sku: m.sku,
        description: m.description,
        unit: m.unit,
        quantity: m.quantity,
        reorderAt: m.reorderAt,
        status: m.status,
        createdAt: m.createdAt,
    }))
})

export async function getRawMaterialById(id: string): Promise<RawMaterialDTO | null> {
    await requireCurrentUser()

    const m = await prisma.rawMaterial.findUnique({ where: { id } })
    if (!m) return null

    return {
        id: m.id,
        name: m.name,
        sku: m.sku,
        description: m.description,
        unit: m.unit,
        quantity: m.quantity,
        reorderAt: m.reorderAt,
        status: m.status,
        createdAt: m.createdAt,
    }
}

export async function createRawMaterial(data: {
    name: string
    sku: string
    description?: string
    unit: string
    quantity: number
    reorderAt: number
    status?: "ACTIVE" | "INACTIVE"
}) {
    const user = await requireCurrentUser()

    const rawMaterial = await prisma.rawMaterial.create({
        data: {
            ...data,
            createdById: user.id,
        }
    })

    if (data.quantity > 0) {
        await recordStockMovement({
            entity: "RAW_MATERIAL",
            entityId: rawMaterial.id,
            type: "IN",
            quantity: data.quantity,
            reason: "Initial stock on creation",
            userId: user.id
        })
    }

    await createSystemLog(user.id, "CREATE", "RAW_MATERIAL", rawMaterial.id, JSON.stringify(data))
    await checkLowStock()
    return rawMaterial
}

export async function updateRawMaterial(
    id: string,
    data: {
        name?: string
        sku?: string
        description?: string
        unit?: string
        quantity?: number
        reorderAt?: number
        status?: "ACTIVE" | "INACTIVE"
    }
) {
    const user = await requireCurrentUser()

    const existing = await prisma.rawMaterial.findUnique({ where: { id } })
    const rawMaterial = await prisma.rawMaterial.update({ where: { id }, data })

    if (existing && data.quantity !== undefined && data.quantity !== existing.quantity) {
        const diff = data.quantity - existing.quantity
        await recordStockMovement({
            entity: "RAW_MATERIAL",
            entityId: id,
            type: diff > 0 ? "IN" : "OUT",
            quantity: Math.abs(diff),
            reason: "Manual adjustment via update",
            userId: user.id
        })
    }

    await createSystemLog(user.id, "UPDATE", "RAW_MATERIAL", id, JSON.stringify(data))

    if (existing && data.quantity !== undefined && data.quantity !== existing.quantity) {
        await checkLowStock()
    }

    return rawMaterial
}

export async function deleteRawMaterial(id: string) {
    const user = await requireCurrentUser()

    const rawMaterial = await prisma.rawMaterial.delete({ where: { id } })
    await createSystemLog(user.id, "DELETE", "RAW_MATERIAL", id)
    return rawMaterial
}
