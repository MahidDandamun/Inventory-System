"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { settingsSchema, type SettingsInput } from "@/schemas/auth"
import bcrypt from "bcryptjs"

export async function updateSettingsAction(formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: "Unauthorized" } as const

    // Parse form data
    const values = Object.fromEntries(formData)
    // Convert checkbox to boolean
    const isTwoFactorEnabled = values.isTwoFactorEnabled === "true"

    const parsed = settingsSchema.safeParse({
        ...values,
        isTwoFactorEnabled
    })

    if (!parsed.success) {
        return { success: false, error: "Invalid settings data.", fieldErrors: parsed.error.flatten().fieldErrors }
    }

    const data = parsed.data

    try {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } })

        if (!dbUser) {
            return { success: false, error: "Unauthorized" }
        }

        const updateData: Partial<SettingsInput & { emailVerified: Date | null }> = {
            name: data.name,
            isTwoFactorEnabled: data.isTwoFactorEnabled,
        }

        // Only an admin can change roles, usually done via the Users management tab.
        // We prevent standard users from escalating their own privileges here.
        if (data.role && user.role === "ADMIN") {
            updateData.role = data.role
        }

        if (data.email && data.email !== dbUser.email) {
            updateData.email = data.email
            updateData.emailVerified = null // Require re-verification
        }

        if (data.password && data.newPassword && dbUser.password) {
            const passwordsMatch = await bcrypt.compare(data.password, dbUser.password)
            if (!passwordsMatch) {
                return { success: false, error: "Incorrect current password", fieldErrors: { password: ["Incorrect current password"] } }
            }
            updateData.password = await bcrypt.hash(data.newPassword, 10)
        }

        await prisma.user.update({
            where: { id: user.id },
            data: updateData,
        })

        revalidatePath("/settings")
        return { success: true, data: null }
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred." }
    }
}
