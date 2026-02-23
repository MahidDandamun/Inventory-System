"use server"

import { getCurrentUser } from "@/lib/auth"
import { updateNotificationAsRead, updateAllNotificationsAsRead } from "@/lib/dal/notifications"
import { revalidatePath } from "next/cache"

export async function markNotificationAsRead(id: string) {
    try {
        const user = await getCurrentUser()
        if (!user || !user.id) return { error: "Unauthorized" }

        await updateNotificationAsRead(id, user.id)

        revalidatePath("/", "layout")
        return { success: true }
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : "Unknown error" }
    }
}

export async function markAllNotificationsAsRead() {
    try {
        const user = await getCurrentUser()
        if (!user || !user.id) return { error: "Unauthorized" }

        await updateAllNotificationsAsRead(user.id)

        revalidatePath("/", "layout")
        return { success: true }
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : "Unknown error" }
    }
}
