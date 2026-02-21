// lib/mail.ts
// ---
// Email service using Resend
// Sends verification and password reset emails
// ---

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

/**
 * Send an email verification link to a new user.
 */
export async function sendVerificationEmail(email: string, token: string) {
    const confirmLink = `${domain}/verify?token=${token}`

    await resend.emails.send({
        from: "Inventory System <onboarding@resend.dev>",
        to: email,
        subject: "Verify your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to verify your email.</p>`,
    })
}

/**
 * Send a password reset link.
 */
export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${domain}/new-password?token=${token}`

    await resend.emails.send({
        from: "Inventory System <onboarding@resend.dev>",
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    })
}

/**
 * Send a two-factor authentication code.
 */
export async function sendTwoFactorEmail(email: string, token: string) {
    await resend.emails.send({
        from: "Inventory System <onboarding@resend.dev>",
        to: email,
        subject: "Your 2FA Code",
        html: `<p>Your two-factor authentication code is: <strong>${token}</strong></p>`,
    })
}
