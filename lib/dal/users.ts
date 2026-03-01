import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { requireAdminUser, requireCurrentUser } from "@/lib/dal/guards"

export type UserDTO = {
    id: string
    name: string | null
    email: string | null
    role: "ADMIN" | "USER"
    isTwoFactorEnabled: boolean
    isOAuth: boolean
    createdAt: Date
}

export const getUserById = cache(async (id: string) => {
    await requireAdminUser()
    return prisma.user.findUnique({ where: { id } })
})

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
}

export async function getAccountByUserId(userId: string) {
    return prisma.account.findFirst({ where: { userId } })
}

export async function getAllUsers(): Promise<UserDTO[]> {
    await requireAdminUser()

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

/**
 * Internal notification-recipient lookup for system events.
 * Requires an authenticated caller but does not require admin role.
 */
export async function getAdminUserIdsForNotifications(): Promise<string[]> {
    await requireCurrentUser()

    const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
    })

    return admins.map((admin) => admin.id)
}

export type UserCreateDTO = { name: string, email: string, password?: string, role: "ADMIN" | "USER" }
export type UserUpdateDTO = { name?: string, email?: string, password?: string, role?: "ADMIN" | "USER" }

export async function createUser(data: UserCreateDTO) {
    await requireAdminUser()

    return prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password || null,
            role: data.role,
        }
    })
}

export async function updateUser(id: string, data: UserUpdateDTO) {
    await requireAdminUser()

    const updateData: Partial<UserUpdateDTO> = { ...data }
    if (!updateData.password) {
        delete updateData.password
    }

    return prisma.user.update({
        where: { id },
        data: updateData,
    })
}

export async function deleteUser(id: string) {
    await requireAdminUser()
    return prisma.user.delete({ where: { id } })
}
