// app/(auth)/_actions/register.ts
// ---
// Server action for user registration
// Hashes password, creates user, sends verification email
// ---

"use server"

import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { registerSchema, type RegisterInput } from "@/schemas/auth"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"

type RegisterResult = { error: string } | { success: string }

export async function registerAction(values: RegisterInput): Promise<RegisterResult> {
    // 1. Validate input
    const parsed = registerSchema.safeParse(values)
    if (!parsed.success) {
        return { error: "Invalid fields." }
    }

    const { name, email, password } = parsed.data

    // 2. Check if email is already registered
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        return { error: "Email already in use." }
    }

    // 3. Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
        data: { name, email, password: hashedPassword },
    })

    // 4. Send email verification
    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return { success: "Confirmation email sent! Please check your inbox." }
}
