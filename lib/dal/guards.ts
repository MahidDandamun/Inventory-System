import "server-only"
import { getCurrentUser } from "@/lib/auth"

export async function requireCurrentUser() {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error("Unauthorized")
    }

    return user
}

export async function requireAdminUser() {
    const user = await requireCurrentUser()
    if (user.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required.")
    }

    return user
}
