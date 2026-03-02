import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { createSystemLog } from "@/lib/dal/system-logs"
import { requireCurrentUser } from "@/lib/dal/guards"
import { recordStockMovement } from "@/lib/dal/stock-movements"
import { checkLowStock } from "@/lib/dal/notifications"
import type { RawMaterial } from "@prisma/client"

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

export function toRawMaterialDTO(rawMaterial: RawMaterial): RawMaterialDTO {
    return {
        id: rawMaterial.id,
        name: rawMaterial.name,
        sku: rawMaterial.sku,
        description: rawMaterial.description,
        unit: rawMaterial.unit,
        quantity: rawMaterial.quantity,
        reorderAt: rawMaterial.reorderAt,
        status: rawMaterial.status,
        createdAt: rawMaterial.createdAt,
    }
}

export const getRawMaterials = cache(async (): Promise<RawMaterialDTO[]> => {
    await requireCurrentUser()

    const items = await prisma.rawMaterial.findMany({
        orderBy: { createdAt: "desc" },
    })

    return items.map((m) => toRawMaterialDTO(m))
})

export async function getRawMaterialById(id: string): Promise<RawMaterialDTO | null> {
    await requireCurrentUser()

    const m = await prisma.rawMaterial.findUnique({ where: { id } })
    if (!m) return null

    return toRawMaterialDTO(m)
}

export async function createRawMaterial(data: {
    name: string
    sku: string
    description?: string
    unit: string
    quantity: number
    reorderAt: number
    status?: "ACTIVE" | "INACTIVE"
}): Promise<RawMaterialDTO> {
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
    return toRawMaterialDTO(rawMaterial)
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
): Promise<RawMaterialDTO> {
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

    return toRawMaterialDTO(rawMaterial)
}

export async function deleteRawMaterial(id: string): Promise<RawMaterialDTO> {
    const user = await requireCurrentUser()

    const rawMaterial = await prisma.rawMaterial.delete({ where: { id } })
    await createSystemLog(user.id, "DELETE", "RAW_MATERIAL", id)
    return toRawMaterialDTO(rawMaterial)
}
