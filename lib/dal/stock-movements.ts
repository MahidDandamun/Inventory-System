import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { requireCurrentUser } from "@/lib/dal/guards"
import type { StockMovement } from "@prisma/client"

export type StockMovementDTO = {
    id: string
    entity: string
    entityId: string
    type: string
    quantity: number
    reason: string
    userId: string | null
    createdAt: Date
    userName?: string | null
}

export function toStockMovementDTO(movement: StockMovement & { user?: { name: string | null } | null }): StockMovementDTO {
    return {
        id: movement.id,
        entity: movement.entity,
        entityId: movement.entityId,
        type: movement.type,
        quantity: movement.quantity,
        reason: movement.reason,
        userId: movement.userId,
        createdAt: movement.createdAt,
        userName: movement.user?.name,
    }
}

export const getMovementsByEntity = cache(async (entity: string, entityId: string): Promise<StockMovementDTO[]> => {
    await requireCurrentUser()

    const movements = await prisma.stockMovement.findMany({
        where: { entity, entityId },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
    })

    return movements.map((m) => toStockMovementDTO(m))
})

export type PrismaTx = Omit<
    typeof prisma,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>

export async function recordStockMovement(
    data: {
        entity: "PRODUCT" | "RAW_MATERIAL"
        entityId: string
        type: "IN" | "OUT" | "ADJUST"
        quantity: number
        reason: string
        userId?: string
    },
    tx?: PrismaTx
): Promise<StockMovementDTO> {
    const db = tx || prisma
    const movement = await db.stockMovement.create({
        data: {
            entity: data.entity,
            entityId: data.entityId,
            type: data.type,
            quantity: data.quantity,
            reason: data.reason,
            userId: data.userId,
        },
    })
    return toStockMovementDTO(movement)
}
