import "server-only"
import { createNotification } from "@/lib/dal/notifications"
import { getAdminUserIdsForNotifications } from "@/lib/dal/users"

export async function notifyAdmins(title: string, message: string) {
    const adminIds = await getAdminUserIdsForNotifications()

    await Promise.all(
        adminIds.map((adminId) =>
            createNotification(adminId, title, message, { asSystemEvent: true })
        )
    )
}
