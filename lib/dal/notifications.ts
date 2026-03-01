import "server-only"
import { prisma } from "@/lib/prisma"
import { requireCurrentUser } from "@/lib/dal/guards"

export type NotificationDTO = {
    id: string
    userId: string
    title: string
    message: string
    isRead: boolean
    createdAt: Date
}

export async function getNotificationsByUserId(userId: string): Promise<NotificationDTO[]> {
    const currentUser = await requireCurrentUser()
    if (currentUser.id !== userId) {
        throw new Error("Forbidden")
    }

    return prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
    })
}

export async function updateNotificationAsRead(id: string, userId: string) {
    const currentUser = await requireCurrentUser()
    if (currentUser.id !== userId) {
        throw new Error("Forbidden")
    }

    return prisma.notification.update({
        where: { id, userId },
        data: { isRead: true },
    })
}

export async function updateAllNotificationsAsRead(userId: string) {
    const currentUser = await requireCurrentUser()
    if (currentUser.id !== userId) {
        throw new Error("Forbidden")
    }

    return prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    })
}

type CreateNotificationOptions = {
    asSystemEvent?: boolean
}

export async function createNotification(
    userId: string,
    title: string,
    message: string,
    options?: CreateNotificationOptions
) {
    const currentUser = await requireCurrentUser()

    const isSelfNotification = currentUser.id === userId
    const isAdmin = currentUser.role === "ADMIN"
    const isSystemEvent = options?.asSystemEvent === true

    if (!isSelfNotification && !isAdmin && !isSystemEvent) {
        throw new Error("Forbidden")
    }

    return prisma.notification.create({
        data: {
            userId,
            title,
            message,
        }
    })
}
