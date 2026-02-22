"use server"

import { revalidatePath } from "next/cache"
import { createRawMaterial, updateRawMaterial, deleteRawMaterial } from "@/lib/dal/raw-materials"
import { rawMaterialSchema } from "@/schemas/raw-material"

export async function createRawMaterialAction(formData: FormData) {
    const parsed = rawMaterialSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const item = await createRawMaterial(parsed.data)
        revalidatePath("/raw-materials")
        return { success: true, data: item }
    } catch (error: unknown) {
        return { error: { root: [error instanceof Error ? error.message : "Unknown error"] } }
    }
}

export async function updateRawMaterialAction(id: string, formData: FormData) {
    const parsed = rawMaterialSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const item = await updateRawMaterial(id, parsed.data)
        revalidatePath("/raw-materials")
        return { success: true, data: item }
    } catch (error: unknown) {
        return { error: { root: [error instanceof Error ? error.message : "Unknown error"] } }
    }
}

export async function deleteRawMaterialAction(id: string) {
    try {
        await deleteRawMaterial(id)
        revalidatePath("/raw-materials")
        return { success: true }
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : "Unknown error" }
    }
}
