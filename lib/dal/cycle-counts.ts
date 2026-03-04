import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { requireCurrentUser } from "@/lib/dal/guards"
import { createSystemLog } from "@/lib/dal/system-logs"
import { requestStockAdjustmentApproval } from "@/lib/dal/approvals"

export type CycleCountStatus = "SCHEDULED" | "IN_PROGRESS" | "PENDING_APPROVAL" | "COMPLETED" | "CANCELLED"

export type CycleCountItemDTO = {
    id: string
    entity: string
    entityId: string
    entityName: string
    expectedQuantity: number
    actualQuantity: number | null
    variance: number | null
    notes: string | null
}

export type CycleCountDTO = {
    id: string
    name: string
    status: CycleCountStatus
    scheduledDate: Date
    completedAt: Date | null
    notes: string | null
    createdAt: Date
    createdBy: { name: string | null } | null
    items?: CycleCountItemDTO[]
}

type CycleCountInput = {
    id: string
    name: string
    status: string
    scheduledDate: Date
    completedAt: Date | null
    notes: string | null
    createdAt: Date
    createdBy: { name: string | null } | null
    items?: {
        id: string
        entity: string
        entityId: string
        entityName?: string | null
        expectedQuantity: number
        actualQuantity: number | null
        variance: number | null
        notes: string | null
    }[]
}

function toCycleCountDTO(cc: CycleCountInput): CycleCountDTO {
    return {
        id: cc.id,
        name: cc.name,
        status: cc.status as CycleCountStatus,
        scheduledDate: cc.scheduledDate,
        completedAt: cc.completedAt,
        notes: cc.notes,
        createdAt: cc.createdAt,
        createdBy: cc.createdBy ? { name: cc.createdBy.name } : null,
        items: cc.items ? cc.items.map(i => ({
            id: i.id,
            entity: i.entity,
            entityId: i.entityId,
            entityName: i.entityName || "Unknown",
            expectedQuantity: i.expectedQuantity,
            actualQuantity: i.actualQuantity,
            variance: i.variance,
            notes: i.notes
        })) : undefined
    }
}

export const getCycleCounts = cache(async (): Promise<CycleCountDTO[]> => {
    await requireCurrentUser()

    const counts = await prisma.cycleCount.findMany({
        include: { createdBy: { select: { name: true } } },
        orderBy: { createdAt: "desc" }
    })

    return counts.map(toCycleCountDTO)
})

export async function getCycleCountById(id: string): Promise<CycleCountDTO | null> {
    await requireCurrentUser()

    const cc = await prisma.cycleCount.findUnique({
        where: { id },
        include: {
            createdBy: { select: { name: true } },
            items: true
        }
    })

    if (!cc) return null

    // Fetch entity names (assuming they are all PRODUCTS for now as per constraints)
    const productIds = cc.items.filter(i => i.entity === "PRODUCT").map(i => i.entityId)
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true }
    })
    const productMap = new Map(products.map(p => [p.id, p.name]))

    const enrichedItems = cc.items.map(i => ({
        ...i,
        entityName: i.entity === "PRODUCT" ? productMap.get(i.entityId) : "Unknown Material"
    }))

    return toCycleCountDTO({ ...cc, items: enrichedItems })
}

export type CreateCycleCountInput = {
    name: string
    scheduledDate: Date
    notes?: string
    productIds: string[]
}

export async function createCycleCount(data: CreateCycleCountInput): Promise<CycleCountDTO> {
    const user = await requireCurrentUser()

    const products = await prisma.product.findMany({
        where: { id: { in: data.productIds } },
        select: { id: true, quantity: true }
    })

    if (products.length === 0) throw new Error("No products found")

    const cc = await prisma.cycleCount.create({
        data: {
            name: data.name,
            scheduledDate: data.scheduledDate,
            notes: data.notes,
            createdById: user.id,
            items: {
                create: products.map(p => ({
                    entity: "PRODUCT",
                    entityId: p.id,
                    expectedQuantity: p.quantity
                }))
            }
        },
        include: { createdBy: { select: { name: true } } }
    })

    await createSystemLog(user.id, "CREATE", "CYCLE_COUNT", cc.id, JSON.stringify({ name: data.name }))
    return toCycleCountDTO(cc)
}

export type UpdateCycleCountItemInput = {
    id: string
    actualQuantity: number
    notes?: string
}

export async function updateCycleCountItem(ccId: string, data: UpdateCycleCountItemInput) {
    const user = await requireCurrentUser()

    const item = await prisma.cycleCountItem.findUnique({ where: { id: data.id } })
    if (!item || item.cycleCountId !== ccId) throw new Error("Item not found")

    const variance = data.actualQuantity - item.expectedQuantity

    await prisma.cycleCountItem.update({
        where: { id: data.id },
        data: {
            actualQuantity: data.actualQuantity,
            variance,
            notes: data.notes
        }
    })

    await createSystemLog(user.id, "UPDATE", "CYCLE_COUNT_ITEM", item.id, `Set actual to ${data.actualQuantity}`)
}

export async function completeCycleCount(id: string) {
    const user = await requireCurrentUser()

    const cc = await prisma.cycleCount.findUnique({
        where: { id },
        include: { items: true }
    })

    if (!cc) throw new Error("Cycle count not found")
    if (cc.status === "COMPLETED") throw new Error("Already completed")

    // Check if there are variances
    let needsApproval = false
    const itemsWithVariance = cc.items.filter(i => i.variance !== null && i.variance !== 0)

    await prisma.$transaction(async (tx) => {
        if (itemsWithVariance.length > 0) {
            for (const item of itemsWithVariance) {
                // Configurable Rule Simulation: absolute variance > 100 requires approval
                if (Math.abs(item.variance!) > 100) {
                    needsApproval = true
                    await requestStockAdjustmentApproval({
                        entity: item.entity,
                        entityId: item.entityId,
                        variance: item.variance!,
                        cycleCountId: cc.id,
                        requesterId: user.id!
                    }, tx)
                } else {
                    // Auto approve small variances
                    if (item.entity === "PRODUCT") {
                        await tx.product.update({
                            where: { id: item.entityId },
                            data: { quantity: { increment: item.variance! } }
                        })
                    } else if (item.entity === "RAW_MATERIAL") {
                        await tx.rawMaterial.update({
                            where: { id: item.entityId },
                            data: { quantity: { increment: item.variance! } }
                        })
                    }
                }
            }

            await tx.cycleCount.update({
                where: { id },
                data: { status: needsApproval ? "PENDING_APPROVAL" : "COMPLETED", completedAt: needsApproval ? null : new Date() }
            })
        } else {
            await tx.cycleCount.update({
                where: { id },
                data: { status: "COMPLETED", completedAt: new Date() }
            })
        }
    })

    await createSystemLog(user.id, "UPDATE", "CYCLE_COUNT", id, `Completed cycle count. Needs approval: ${needsApproval}`)
}
