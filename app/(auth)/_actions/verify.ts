// app/(auth)/_actions/verify.ts
// ---
// Server action for email verification
// Called with a token from the verification link
// ---

"use server"

import { prisma } from "@/lib/prisma"

type VerifyResult = { error: string } | { success: string }

export async function verifyEmailAction(token: string): Promise<VerifyResult> {
    // 1. Look up the verification token
    const existingToken = await prisma.verificationToken.findFirst({
        where: { token },
    })
    if (!existingToken) {
        return { error: "Token does not exist." }
    }

    // 2. Check expiration
    if (new Date(existingToken.expires) < new Date()) {
        return { error: "Token has expired." }
    }

    // 3. Look up the user
    const existingUser = await prisma.user.findUnique({
        where: { email: existingToken.email },
    })
    if (!existingUser) {
        return { error: "Email does not exist." }
    }

    // 4. Mark email as verified and clean up token
    await prisma.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: existingToken.email,
        },
    })
    await prisma.verificationToken.delete({ where: { id: existingToken.id } })

    return { success: "Email verified! You can now sign in." }
}
