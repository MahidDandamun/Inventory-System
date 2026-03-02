"use server"

import { revalidatePath } from "next/cache"
import { createRawMaterial, updateRawMaterial, deleteRawMaterial } from "@/lib/dal/raw-materials"
import { rawMaterialSchema } from "@/schemas/raw-material"
import { notifyAdmins } from "@/lib/domain/notifications"
import { handleServerError } from "@/lib/error-handling"

export async function createRawMaterialAction(formData: FormData) {
    const parsed = rawMaterialSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const item = await createRawMaterial(parsed.data)
        await notifyAdmins("New Material Added", `Raw Material "${item.name}" was added.`)
        revalidatePath("/raw-materials")
        return { success: true, data: item }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function updateRawMaterialAction(id: string, formData: FormData) {
    const parsed = rawMaterialSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const item = await updateRawMaterial(id, parsed.data)

        if (item.quantity <= item.reorderAt) {
            await notifyAdmins("Material Reorder Alert", `Material "${item.name}" reached the reorder point (${item.quantity} ${item.unit}).`)
        }

        revalidatePath("/raw-materials")
        return { success: true, data: item }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function deleteRawMaterialAction(id: string) {
    try {
        await deleteRawMaterial(id)
        revalidatePath("/raw-materials")
        return { success: true }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}
