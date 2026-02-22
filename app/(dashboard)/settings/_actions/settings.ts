"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { settingsSchema, type SettingsInput } from "@/schemas/auth"
import bcrypt from "bcryptjs"

export async function updateSettingsAction(formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { error: { root: ["Unauthorized"] } }

    // Parse form data
    const values = Object.fromEntries(formData)
    // Convert checkbox to boolean
    const isTwoFactorEnabled = values.isTwoFactorEnabled === "on" || values.isTwoFactorEnabled === "true"

    const parsed = settingsSchema.safeParse({
        ...values,
        isTwoFactorEnabled
    })

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    const data = parsed.data

    try {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } })

        if (!dbUser) {
            return { error: { root: ["Unauthorized"] } }
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
                return { error: { password: ["Incorrect current password"] } }
            }
            updateData.password = await bcrypt.hash(data.newPassword, 10)
        }

        await prisma.user.update({
            where: { id: user.id },
            data: updateData,
        })

        revalidatePath("/settings")
        return { success: true }
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return { error: { root: ["Email already in use."] } }
        }
        return { error: { root: [error instanceof Error ? error.message : "Unknown error"] } }
    }
}
