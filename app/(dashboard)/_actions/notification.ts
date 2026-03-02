"use server"

import { revalidatePath } from "next/cache"
import { updateNotificationAsRead, updateAllNotificationsAsRead } from "@/lib/dal/notifications"
import { requireCurrentUser } from "@/lib/dal/guards"
import { validatedAction } from "@/lib/actions/safe-action"
import { z } from "zod"

export async function markNotificationAsRead(id: string) {
    return validatedAction(z.any(), {}, async () => {
        const user = await requireCurrentUser()
        if (!user.id) throw new Error("Unauthorized")

        await updateNotificationAsRead(id, user.id)

        revalidatePath("/", "layout")
        return null
    })
}

export async function markAllNotificationsAsRead() {
    return validatedAction(z.any(), {}, async () => {
        const user = await requireCurrentUser()
        if (!user.id) throw new Error("Unauthorized")

        await updateAllNotificationsAsRead(user.id)

        revalidatePath("/", "layout")
        return null
    })
}
