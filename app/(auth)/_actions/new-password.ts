// app/(auth)/_actions/new-password.ts
// ---
// Server action for setting a new password via reset token
// Validates token expiration, hashes new password, updates user
// ---

"use server"

import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { newPasswordSchema, type NewPasswordInput } from "@/schemas/auth"

type NewPasswordResult = { error: string } | { success: string }

export async function newPasswordAction(
    values: NewPasswordInput,
    token: string | null
): Promise<NewPasswordResult> {
    // 1. Require token
    if (!token) {
        return { error: "Missing token." }
    }

    // 2. Validate input
    const parsed = newPasswordSchema.safeParse(values)
    if (!parsed.success) {
        return { error: "Invalid fields." }
    }

    const { password } = parsed.data

    // 3. Look up the reset token
    const existingToken = await prisma.passwordResetToken.findFirst({
        where: { token },
    })
    if (!existingToken) {
        return { error: "Invalid token." }
    }

    // 4. Check expiration
    if (new Date(existingToken.expires) < new Date()) {
        return { error: "Token has expired." }
    }

    // 5. Look up user
    const existingUser = await prisma.user.findUnique({
        where: { email: existingToken.email },
    })
    if (!existingUser) {
        return { error: "Email does not exist." }
    }

    // 6. Hash and update password, then delete used token
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
    })
    await prisma.passwordResetToken.delete({ where: { id: existingToken.id } })

    return { success: "Password updated! You can now sign in." }
}
