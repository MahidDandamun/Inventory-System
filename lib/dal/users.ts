// lib/dal/users.ts
// ---
// Data Access Layer — User operations
// All database queries for users live here
// Returns DTOs only — never raw Prisma models
// ---

import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"

/** DTO for user profile (safe to send to client) */
export type UserDTO = {
    id: string
    name: string | null
    email: string | null
    role: "ADMIN" | "USER"
    isTwoFactorEnabled: boolean
    isOAuth: boolean
    createdAt: Date
}

/**
 * Find a user by ID.
 * Used by auth callbacks — returns the raw user record.
 */
export const getUserById = cache(async (id: string) => {
    return prisma.user.findUnique({ where: { id } })
})

/**
 * Find a user by email.
 * Used during login and registration.
 */
export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
}

/**
 * Get a user account (OAuth provider link).
 */
export async function getAccountByUserId(userId: string) {
    return prisma.account.findFirst({ where: { userId } })
}

/**
 * Get all users as DTOs for the admin user management page.
 */
export async function getAllUsers(): Promise<UserDTO[]> {
    const users = await prisma.user.findMany({
        include: { accounts: { select: { id: true } } },
        orderBy: { createdAt: "desc" },
    })

    return users.map((user: typeof users[number]) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        isOAuth: user.accounts.length > 0,
        createdAt: user.createdAt,
    }))
}
