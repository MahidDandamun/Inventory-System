"use server"

import { revalidatePath } from "next/cache"
import { createUser, updateUser, deleteUser, type UserCreateDTO, type UserUpdateDTO } from "@/lib/dal/users"
import { userAdminSchema } from "@/schemas/user"
import { getCurrentUser } from "@/lib/auth"
import bcrypt from "bcryptjs"

async function requireAdmin() {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required.")
    }
}

export async function createUserAction(formData: FormData) {
    try {
        await requireAdmin()
    } catch {
        return { error: "Unauthorized: Admin access required." }
    }

    const parsed = userAdminSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const data: UserCreateDTO = {
            name: parsed.data.name,
            email: parsed.data.email,
            role: parsed.data.role
        }
        if (parsed.data.password) {
            data.password = await bcrypt.hash(parsed.data.password, 10)
        }

        const user = await createUser(data)
        revalidatePath("/users")
        return { success: true, data: user }
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return { error: { root: ["Email already in use."] } }
        }
        return { error: { root: [error instanceof Error ? error.message : "Unknown error"] } }
    }
}

export async function updateUserAction(id: string, formData: FormData) {
    try {
        await requireAdmin()
    } catch {
        return { error: "Unauthorized: Admin access required." }
    }

    const parsed = userAdminSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const data: UserUpdateDTO = { ...parsed.data }
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10)
        } else {
            delete data.password
        }

        const user = await updateUser(id, data)
        revalidatePath("/users")
        return { success: true, data: user }
    } catch (error: unknown) {
        return { error: { root: [error instanceof Error ? error.message : "Unknown error"] } }
    }
}

export async function deleteUserAction(id: string) {
    try {
        await requireAdmin()
    } catch {
        return { error: "Unauthorized: Admin access required." }
    }

    try {
        await deleteUser(id)
        revalidatePath("/users")
        return { success: true }
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : "Unknown error" }
    }
}
