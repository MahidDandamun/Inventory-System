import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { requireAdminUser } from "@/lib/dal/guards"

import type { User } from "@prisma/client"

export type UserDTO = {
    id: string
    name: string | null
    email: string | null
    role: "ADMIN" | "USER"
    isTwoFactorEnabled: boolean
    isOAuth: boolean
    createdAt: Date
}

export type AccountDTO = {
    id: string
    userId: string
}

export function toUserDTO(user: User, isOAuth: boolean = false): UserDTO {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        isOAuth,
        createdAt: user.createdAt,
    }
}

export const getUserById = cache(async (id: string): Promise<UserDTO | null> => {
    await requireAdminUser()
    const user = await prisma.user.findUnique({
        where: { id },
        include: { accounts: { select: { id: true } } }
    })
    return user ? toUserDTO(user, user.accounts.length > 0) : null
})

export async function getUserByEmail(email: string): Promise<UserDTO | null> {
    const user = await prisma.user.findUnique({
        where: { email },
        include: { accounts: { select: { id: true } } }
    })
    return user ? toUserDTO(user, user.accounts.length > 0) : null
}

export async function getAccountByUserId(userId: string): Promise<AccountDTO | null> {
    const account = await prisma.account.findFirst({ where: { userId } })
    return account ? { id: account.id, userId: account.userId } : null
}

export async function getAllUsers(): Promise<UserDTO[]> {
    await requireAdminUser()

    const users = await prisma.user.findMany({
        include: { accounts: { select: { id: true } } },
        orderBy: { createdAt: "desc" },
    })

    return users.map((user) => toUserDTO(user, user.accounts.length > 0))
}

export type UserCreateDTO = { name: string, email: string, password?: string, role: "ADMIN" | "USER" }
export type UserUpdateDTO = { name?: string, email?: string, password?: string, role?: "ADMIN" | "USER" }

export async function createUser(data: UserCreateDTO): Promise<UserDTO> {
    await requireAdminUser()

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password || null,
            role: data.role,
        }
    })
    return toUserDTO(user, false)
}

export async function updateUser(id: string, data: UserUpdateDTO): Promise<UserDTO> {
    await requireAdminUser()

    const updateData: Partial<UserUpdateDTO> = { ...data }
    if (!updateData.password) {
        delete updateData.password
    }

    const user = await prisma.user.update({
        where: { id },
        data: updateData,
        include: { accounts: { select: { id: true } } }
    })
    return toUserDTO(user, user.accounts.length > 0)
}

export async function deleteUser(id: string): Promise<UserDTO> {
    await requireAdminUser()
    const user = await prisma.user.delete({
        where: { id },
        include: { accounts: { select: { id: true } } }
    })
    return toUserDTO(user, user.accounts.length > 0)
}
