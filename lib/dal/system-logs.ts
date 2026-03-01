import "server-only"
import { prisma } from "@/lib/prisma"
import { requireAdminUser, requireCurrentUser } from "@/lib/dal/guards"

export async function createSystemLog(
    userId: string | null | undefined,
    action: string,
    entity: string,
    entityId?: string,
    details?: string
) {
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

export async function getAllSystemLogs() {
    await requireAdminUser()

    const logs = await prisma.systemLog.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } }
    })

    return logs.map(log => ({
        id: log.id,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        details: log.details,
        createdAt: log.createdAt,
        user: log.user ? { name: log.user.name, email: log.user.email } : null
    }))
}

export type SystemLogDTO = Awaited<ReturnType<typeof getAllSystemLogs>>[number]
