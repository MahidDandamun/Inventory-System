// lib/tokens.ts
// ---
// Token generation for email verification, password reset, and 2FA
// ---

import { v4 as uuidv4 } from "uuid"
import { prisma } from "@/lib/prisma"

/**
 * Generate a verification token for email confirmation.
 * Expires in 1 hour. Deletes any existing token for the email.
 */
export async function generateVerificationToken(email: string) {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000) // 1 hour

    // Delete existing token for this email
    const existing = await prisma.verificationToken.findFirst({
        where: { email },
    })
    if (existing) {
        await prisma.verificationToken.delete({ where: { id: existing.id } })
    }

    return prisma.verificationToken.create({
        data: { email, token, expires },
    })
}

/**
 * Generate a password reset token.
 * Expires in 1 hour.
 */
export async function generatePasswordResetToken(email: string) {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existing = await prisma.passwordResetToken.findFirst({
        where: { email },
    })
    if (existing) {
        await prisma.passwordResetToken.delete({ where: { id: existing.id } })
    }

    return prisma.passwordResetToken.create({
        data: { email, token, expires },
    })
}

/**
 * Generate a 6-digit two-factor authentication code.
 * Expires in 5 minutes.
 */
export async function generateTwoFactorToken(email: string) {
    const token = Math.floor(100_000 + Math.random() * 900_000).toString()
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000) // 5 minutes

    const existing = await prisma.twoFactorToken.findFirst({
        where: { email },
    })
    if (existing) {
        await prisma.twoFactorToken.delete({ where: { id: existing.id } })
    }

    return prisma.twoFactorToken.create({
        data: { email, token, expires },
    })
}
