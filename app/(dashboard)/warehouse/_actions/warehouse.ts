"use server"

import { revalidatePath } from "next/cache"
import { createWarehouse, updateWarehouse, deleteWarehouse } from "@/lib/dal/warehouses"
import { warehouseSchema } from "@/schemas/warehouse"

export async function createWarehouseAction(formData: FormData) {
    const parsed = warehouseSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const warehouse = await createWarehouse(parsed.data)
        revalidatePath("/warehouse")
        return { success: true, data: warehouse }
    } catch (error: unknown) {
        return { error: { root: [error instanceof Error ? error.message : "Unexpected Error"] } }
    }
}

export async function updateWarehouseAction(id: string, formData: FormData) {
    const parsed = warehouseSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const warehouse = await updateWarehouse(id, parsed.data)
        revalidatePath("/warehouse")
        return { success: true, data: warehouse }
    } catch (error: unknown) {
        return { error: { root: [error instanceof Error ? error.message : "Unexpected Error"] } }
    }
}

export async function deleteWarehouseAction(id: string) {
    try {
        await deleteWarehouse(id)
        revalidatePath("/warehouse")
        return { success: true }
    } catch (error: unknown) {
        return { error: { root: [error instanceof Error ? error.message : "Unexpected Error"] } }
    }
}   
