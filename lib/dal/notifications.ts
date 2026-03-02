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

export async function createNotification(userId: string, title: string, message: string) {
    await requireCurrentUser()

    return prisma.notification.create({
        data: {
            userId,
            title,
            message,
        }
    })
}

export async function checkLowStock() {
    const products = await prisma.product.findMany({
        where: { quantity: { lte: 10 } },
        select: { id: true, name: true, sku: true, quantity: true }
    })

    const materials = await prisma.rawMaterial.findMany({
        select: { id: true, name: true, sku: true, quantity: true, reorderAt: true }
    })
    const lowMaterials = materials.filter((m: { quantity: number; reorderAt: number }) => m.quantity <= m.reorderAt)

    if (products.length === 0 && lowMaterials.length === 0) return

    const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true }
    })

    if (admins.length === 0) return

    const existingUnread = await prisma.notification.findMany({
        where: {
            title: { startsWith: "Low Stock Alert" },
            isRead: false
        },
        select: { message: true, userId: true }
    })
    const existingSet = new Set(existingUnread.map((n: { userId: string; message: string }) => `${n.userId}-${n.message}`))

    const notifications: { userId: string; title: string; message: string }[] = []

    for (const p of products) {
        for (const admin of admins) {
            const msg = `Product ${p.name} (${p.sku}) is low on stock (${p.quantity} remaining).`
            if (!existingSet.has(`${admin.id}-${msg}`)) {
                notifications.push({
                    userId: admin.id,
                    title: "Low Stock Alert (Product)",
                    message: msg,
                })
            }
        }
    }

    for (const m of lowMaterials) {
        for (const admin of admins) {
            const msg = `Raw Material ${m.name} (${m.sku}) is low on stock (${m.quantity} remaining, reorder at ${m.reorderAt}).`
            if (!existingSet.has(`${admin.id}-${msg}`)) {
                notifications.push({
                    userId: admin.id,
                    title: "Low Stock Alert (Raw Material)",
                    message: msg,
                })
            }
        }
    }

    if (notifications.length > 0) {
        await prisma.notification.createMany({
            data: notifications
        })
    }
}
