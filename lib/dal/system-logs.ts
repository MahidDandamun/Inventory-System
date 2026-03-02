import "server-only"
import { prisma } from "@/lib/prisma"
import { requireAdminUser, requireCurrentUser } from "@/lib/dal/guards"
import type { SystemLog } from "@prisma/client"

export type SystemLogDTO = {
    id: string
    action: string
    entity: string
    entityId: string | null
    details: string | null
    createdAt: Date
    user: { name: string | null, email: string | null } | null
}

export function toSystemLogDTO(log: SystemLog & { user?: { name: string | null, email: string | null } | null }): SystemLogDTO {
    return {
        id: log.id,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        details: log.details,
        createdAt: log.createdAt,
        user: log.user ? { name: log.user.name, email: log.user.email } : null
    }
}

export async function createSystemLog(
    userId: string | null | undefined,
    action: string,
    entity: string,
    entityId?: string,
    details?: string
): Promise<void> {
    try {
        await requireCurrentUser()

        await prisma.systemLog.create({
            data: {
                userId: userId || null,
                action,
                entity,
                entityId,
                details
            }
        })
    } catch (error) {
        console.error("Failed to write system log:", error)
    }
}

export async function getAllSystemLogs(): Promise<SystemLogDTO[]> {
    await requireAdminUser()

    const logs = await prisma.systemLog.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } }
    })

    return logs.map((log) => toSystemLogDTO(log))
}
