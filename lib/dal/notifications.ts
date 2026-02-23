import "server-only"
import { prisma } from "@/lib/prisma"

export type NotificationDTO = {
    id: string
    userId: string
    title: string
    message: string
    isRead: boolean
    createdAt: Date
}

export async function getNotificationsByUserId(userId: string): Promise<NotificationDTO[]> {
    return prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
    })
}

export async function updateNotificationAsRead(id: string, userId: string) {
    return prisma.notification.update({
        where: { id, userId },
        data: { isRead: true },
    })
}

export async function updateAllNotificationsAsRead(userId: string) {
    return prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    })
}

export async function createNotification(userId: string, title: string, message: string) {
    return prisma.notification.create({
        data: {
            userId,
            title,
            message,
        }
    })
}
