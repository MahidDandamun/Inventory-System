// app/(auth)/_actions/login.ts
// ---
// Server action for credentials login
// Handles: email verification check, 2FA flow, and signIn call
// ---

"use server"

import { AuthError } from "next-auth"
import bcrypt from "bcryptjs"

import { signIn } from "@/auth"
import { prisma } from "@/lib/prisma"
import { loginSchema, type LoginInput } from "@/schemas/auth"
import {
    generateVerificationToken,
    generateTwoFactorToken,
} from "@/lib/tokens"
import {
    sendVerificationEmail,
    sendTwoFactorEmail,
} from "@/lib/mail"
import { rateLimit } from "@/lib/rate-limit"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

type LoginResult =
    | { error: string }
    | { success: string }
    | { twoFactor: true }
    | undefined

export async function loginAction(values: LoginInput): Promise<LoginResult> {
    // 0. Apply rate limiter (5 attempts per 15 minutes per email)
    const ipOrEmail = values.email || "unknown_ip"
    const { success } = await rateLimit(`login_${ipOrEmail}`, 5, 15 * 60 * 1000)

    if (!success) {
        return { error: "Too many login attempts. Please try again later." }
    }

    // 1. Validate input
    const parsed = loginSchema.safeParse(values)
    if (!parsed.success) {
        return { error: "Invalid fields." }
    }

    const { email, password, code } = parsed.data

    // 2. Look up user
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist." }
    }

    // 3. Compare password
    const passwordsMatch = await bcrypt.compare(password, existingUser.password)
    if (!passwordsMatch) {
        return { error: "Invalid credentials." }
    }

    // 4. Email not verified — resend verification email
    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email)
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
        return { success: "Verification email sent. Please check your inbox." }
    }

    // 5. Two-factor authentication flow
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            // Validate the submitted code
            const twoFactorToken = await prisma.twoFactorToken.findFirst({
                where: { email: existingUser.email },
            })

            if (!twoFactorToken || twoFactorToken.token !== code) {
                return { error: "Invalid code." }
            }

            if (new Date(twoFactorToken.expires) < new Date()) {
                return { error: "Code has expired." }
            }

            // Clean up used token
            await prisma.twoFactorToken.delete({ where: { id: twoFactorToken.id } })

            // Upsert the confirmation record (consumed by auth callback)
            const existing = await prisma.twoFactorConfirmation.findUnique({
                where: { userId: existingUser.id },
            })
            if (existing) {
                await prisma.twoFactorConfirmation.delete({ where: { id: existing.id } })
            }
            await prisma.twoFactorConfirmation.create({
                data: { userId: existingUser.id },
            })
        } else {
            // First step — send the 2FA code
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)
            await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token)
            return { twoFactor: true }
        }
    }

    // 6. Sign in (throws a redirect internally on success)
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials." }
                default:
                    return { error: "Something went wrong." }
            }
        }
        // Re-throw the NEXT_REDIRECT so Next.js can handle it
        throw error
    }
}
