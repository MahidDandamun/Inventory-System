// schemas/auth.ts
// ---
// Zod validation schemas for auth forms
// Shared between client forms (via react-hook-form) and server actions
// ---

import { z } from "zod"
import { UserRole } from "@prisma/client"

export const loginSchema = z.object({
    email: z.string().email({ message: "Valid email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    code: z.optional(z.string()),
})

export const registerSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Valid email is required" }),
    password: z.string().min(6, { message: "Minimum 6 characters required" }),
})

export const resetSchema = z.object({
    email: z.string().email({ message: "Valid email is required" }),
})

export const newPasswordSchema = z.object({
    password: z.string().min(6, { message: "Minimum 6 characters required" }),
})

export const settingsSchema = z
    .object({
        name: z.optional(z.string()),
        isTwoFactorEnabled: z.optional(z.boolean()),
        role: z.enum([UserRole.ADMIN, UserRole.USER]),
        email: z.optional(z.string().email()),
        password: z.optional(z.string().min(6)),
        newPassword: z.optional(z.string().min(6)),
    })
    .refine((data) => !(data.password && !data.newPassword), {
        message: "New password is required",
        path: ["newPassword"],
    })
    .refine((data) => !(data.newPassword && !data.password), {
        message: "Current password is required",
        path: ["password"],
    })

// Inferred types for form usage
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ResetInput = z.infer<typeof resetSchema>
export type NewPasswordInput = z.infer<typeof newPasswordSchema>
export type SettingsInput = z.infer<typeof settingsSchema>
