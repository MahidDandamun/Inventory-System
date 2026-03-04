import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { requireAdminUser } from "@/lib/dal/guards"
import { createSystemLog } from "@/lib/dal/system-logs"
import { recordStockMovement } from "@/lib/dal/stock-movements"
import type { Prisma } from "@prisma/client"

export type ApprovalRequestDTO = {
    id: string
    entity: string
    entityId: string
    actionType: string
    status: "PENDING" | "APPROVED" | "REJECTED"
    payload: string | null
    comments: string | null
    requesterId: string
    requesterName: string | null
    approverId: string | null
    approverName: string | null
    createdAt: Date
    updatedAt: Date
}

type ApprovalRequestInput = {
    id: string
    entity: string
    entityId: string
    actionType: string
    status: string
    payload: string | null
    comments: string | null
    requesterId: string
    requester?: { name: string | null } | null
    approverId: string | null
    approver?: { name: string | null } | null
    createdAt: Date
    updatedAt: Date
}

function toApprovalRequestDTO(ar: ApprovalRequestInput): ApprovalRequestDTO {
    return {
        id: ar.id,
        entity: ar.entity,
        entityId: ar.entityId,
        actionType: ar.actionType,
        status: ar.status as "PENDING" | "APPROVED" | "REJECTED",
        payload: ar.payload,
        comments: ar.comments,
        requesterId: ar.requesterId,
        requesterName: ar.requester?.name || null,
        approverId: ar.approverId || null,
        approverName: ar.approver?.name || null,
        createdAt: ar.createdAt,
        updatedAt: ar.updatedAt
    }
}

export const getApprovalRequests = cache(async (): Promise<ApprovalRequestDTO[]> => {
    await requireAdminUser()

    const requests = await prisma.approvalRequest.findMany({
        include: {
            requester: { select: { name: true } },
            approver: { select: { name: true } }
        },
        orderBy: { createdAt: "desc" }
    })

    return requests.map(toApprovalRequestDTO)
})

export type StockAdjustmentRequestInput = {
    entity: string
    entityId: string
    variance: number
    cycleCountId?: string
    requesterId: string
}

export async function requestStockAdjustmentApproval(
    data: StockAdjustmentRequestInput,
    tx?: Prisma.TransactionClient
) {
    const db = tx || prisma
    const req = await db.approvalRequest.create({
        data: {
            entity: data.entity,
            entityId: data.entityId,
            actionType: "STOCK_ADJUSTMENT",
            status: "PENDING",
            requesterId: data.requesterId,
            payload: JSON.stringify({
                variance: data.variance,
                cycleCountId: data.cycleCountId
            }) // This payload captures the before/after intention
        }
    })

    await createSystemLog(data.requesterId, "CREATE", "APPROVAL_REQUEST", req.id, "Requested variance adjustment", tx)
    return toApprovalRequestDTO({ ...req, requester: null, approver: null })
}

export async function approveRequest(id: string, comments?: string) {
    const user = await requireAdminUser()

    const req = await prisma.approvalRequest.findUnique({
        where: { id }
    })

    if (!req || req.status !== "PENDING") throw new Error("Invalid request or already processed")

    await prisma.$transaction(async (tx) => {
        const approved = await tx.approvalRequest.update({
            where: { id },
            data: { status: "APPROVED", approverId: user.id, comments }
        })

        const payload = req.payload ? JSON.parse(req.payload) : null

        if (req.actionType === "STOCK_ADJUSTMENT" && payload && payload.variance) {
            // Update entity
            if (req.entity === "PRODUCT") {
                await tx.product.update({
                    where: { id: req.entityId },
                    data: { quantity: { increment: payload.variance } }
                })
            } else if (req.entity === "RAW_MATERIAL") {
                await tx.rawMaterial.update({
                    where: { id: req.entityId },
                    data: { quantity: { increment: payload.variance } }
                })
            }

            await recordStockMovement({
                entity: req.entity as "PRODUCT" | "RAW_MATERIAL",
                entityId: req.entityId,
                type: "ADJUST",
                quantity: payload.variance,
                reason: `Approved variance from request ${id}`,
                userId: user.id
            }, tx)

            if (payload.cycleCountId) {
                // Check if all related variances are now processed
                const otherPending = await tx.approvalRequest.findFirst({
                    where: {
                        status: "PENDING",
                        actionType: "STOCK_ADJUSTMENT",
                        payload: { contains: `"cycleCountId":"${payload.cycleCountId}"` }
                    }
                })

                if (!otherPending) {
                    await tx.cycleCount.update({
                        where: { id: payload.cycleCountId },
                        data: { status: "COMPLETED", completedAt: new Date() }
                    })
                }
            }
        }

        return approved
    })

    await createSystemLog(user.id, "UPDATE", "APPROVAL_REQUEST", id, "Approved")
}

export async function rejectRequest(id: string, comments?: string) {
    const user = await requireAdminUser()

    const req = await prisma.approvalRequest.findUnique({
        where: { id }
    })

    if (!req || req.status !== "PENDING") throw new Error("Invalid request or already processed")

    await prisma.$transaction(async (tx) => {
        await tx.approvalRequest.update({
            where: { id },
            data: { status: "REJECTED", approverId: user.id, comments }
        })

        const payload = req.payload ? JSON.parse(req.payload) : null
        if (payload?.cycleCountId) {
            // Mark cycle count as completed even if rejected?
            // Usually if rejected, the actual count remains rejected and stock unaffected.
            // Let's check remaining pending requests for this CC
            const otherPending = await tx.approvalRequest.findFirst({
                where: {
                    status: "PENDING",
                    actionType: "STOCK_ADJUSTMENT",
                    payload: { contains: `"cycleCountId":"${payload.cycleCountId}"` }
                }
            })

            if (!otherPending) {
                await tx.cycleCount.update({
                    where: { id: payload.cycleCountId },
                    data: { status: "COMPLETED", completedAt: new Date() }
                })
            }
        }
    })

    await createSystemLog(user.id, "UPDATE", "APPROVAL_REQUEST", id, "Rejected")
}
