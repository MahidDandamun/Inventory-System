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
import { rateLimit } from "@/lib/rate-limit"

type ResetResult = { error: string } | { success: string }

export async function resetAction(values: ResetInput): Promise<ResetResult> {
    // 0. Apply Rate Limiting (Attempt limit per Email: 3 attempts per 15 minutes)
    const ipOrEmail = values.email || "unknown_ip"
    const { success } = await rateLimit(`reset_${ipOrEmail}`, 3, 15 * 60 * 1000)

    if (!success) {
        return { error: "Too many password reset requests. Please try again later." }
    }

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

    // 2.5 Check if user is an OAuth user
    if (!existingUser.password) {
        return { error: "This account uses sign-in with Google/Github. Password reset is not available." }
    }

    // 3. Generate token and send reset email
    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

    return { success: "Reset email sent! Please check your inbox." }
}
