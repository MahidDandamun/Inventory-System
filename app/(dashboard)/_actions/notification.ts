"use server"

import { revalidatePath } from "next/cache"
import { updateNotificationAsRead, updateAllNotificationsAsRead } from "@/lib/dal/notifications"
import { requireCurrentUser } from "@/lib/dal/guards"

export async function markNotificationAsRead(id: string) {
    try {
        const user = await requireCurrentUser()
        if (!user.id) return { error: "Unauthorized" }

        await updateNotificationAsRead(id, user.id)

        revalidatePath("/", "layout")
        return { success: true }
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : "Unknown error" }
    }
}

export async function markAllNotificationsAsRead() {
    try {
        const user = await requireCurrentUser()
        if (!user.id) return { error: "Unauthorized" }

        await updateAllNotificationsAsRead(user.id)

        revalidatePath("/", "layout")
        return { success: true }
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : "Unknown error" }
    }
}
