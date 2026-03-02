import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { requireCurrentUser } from "@/lib/dal/guards"

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

export const getMovementsByEntity = cache(async (entity: string, entityId: string): Promise<StockMovementDTO[]> => {
    await requireCurrentUser()

    const movements = await prisma.stockMovement.findMany({
        where: { entity, entityId },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
    })

    return movements.map((m: typeof movements[number]) => ({
        id: m.id,
        entity: m.entity,
        entityId: m.entityId,
        type: m.type,
        quantity: m.quantity,
        reason: m.reason,
        userId: m.userId,
        createdAt: m.createdAt,
        userName: m.user?.name,
    }))
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
) {
    const db = tx || prisma
    return db.stockMovement.create({
        data: {
            entity: data.entity,
            entityId: data.entityId,
            type: data.type,
            quantity: data.quantity,
            reason: data.reason,
            userId: data.userId,
        },
    })
}
