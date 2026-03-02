"use server"

import { revalidatePath } from "next/cache"
import { createUser, updateUser, deleteUser, type UserCreateDTO, type UserUpdateDTO } from "@/lib/dal/users"
import { userAdminSchema } from "@/schemas/user"
import { getCurrentUser } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { validatedAction } from "@/lib/actions/safe-action"
import { z } from "zod"

async function requireAdmin() {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required.")
    }
}

export async function createUserAction(formData: FormData) {
    return validatedAction(userAdminSchema, formData, async (data) => {
        await requireAdmin()
        const payload: UserCreateDTO = {
            name: data.name,
            email: data.email,
            role: data.role
        }
        if (data.password) {
            payload.password = await bcrypt.hash(data.password, 10)
        }

        const user = await createUser(payload)
        revalidatePath("/users")
        return user
    })
}

export async function updateUserAction(id: string, formData: FormData) {
    return validatedAction(userAdminSchema, formData, async (data) => {
        await requireAdmin()
        const payload: UserUpdateDTO = { ...data }
        if (payload.password) {
            payload.password = await bcrypt.hash(payload.password, 10)
        } else {
            delete payload.password
        }

        const user = await updateUser(id, payload)
        revalidatePath("/users")
        return user
    })
}

export async function deleteUserAction(id: string) {
    return validatedAction(z.any(), {}, async () => {
        await requireAdmin()
        await deleteUser(id)
        revalidatePath("/users")
        return null
    })
}
