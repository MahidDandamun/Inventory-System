import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"

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
    return prisma.user.findUnique({ where: { id } })
})

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
}

export async function getAccountByUserId(userId: string) {
    return prisma.account.findFirst({ where: { userId } })
}

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

export type UserCreateDTO = { name: string, email: string, password?: string, role: "ADMIN" | "USER" }
export type UserUpdateDTO = { name?: string, email?: string, password?: string, role?: "ADMIN" | "USER" }

export async function createUser(data: UserCreateDTO) {
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
    return prisma.user.delete({ where: { id } })
}
