import "server-only"
import { prisma } from "@/lib/prisma"
import { getAdminUserIdsForNotifications } from "@/lib/dal/users"

export async function notifyAdmins(title: string, message: string) {
    const adminIds = await getAdminUserIdsForNotifications()

    await Promise.all(
        adminIds.map((adminId) =>
            prisma.notification.create({
                data: { userId: adminId, title, message },
            })
        )
    )
}
