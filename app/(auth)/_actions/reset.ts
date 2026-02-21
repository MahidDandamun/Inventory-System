// app/(auth)/_actions/reset.ts
// ---
// Server action for password reset request
// Looks up user, generates reset token, sends email
// ---

"use server"

import { prisma } from "@/lib/prisma"
import { resetSchema, type ResetInput } from "@/schemas/auth"
import { generatePasswordResetToken } from "@/lib/tokens"
import { sendPasswordResetEmail } from "@/lib/mail"

type ResetResult = { error: string } | { success: string }

export async function resetAction(values: ResetInput): Promise<ResetResult> {
    // 1. Validate input
    const parsed = resetSchema.safeParse(values)
    if (!parsed.success) {
        return { error: "Invalid email." }
    }

    const { email } = parsed.data

    // 2. Check user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (!existingUser) {
        return { error: "Email not found." }
    }

    // 3. Generate token and send reset email
    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

    return { success: "Reset email sent! Please check your inbox." }
}
