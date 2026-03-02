"use server"

import { revalidatePath } from "next/cache"
import { createWarehouse, updateWarehouse, deleteWarehouse } from "@/lib/dal/warehouses"
import { warehouseSchema } from "@/schemas/warehouse"
import { validatedAction } from "@/lib/actions/safe-action"
import { z } from "zod"

export async function createWarehouseAction(formData: FormData) {
    return validatedAction(warehouseSchema, formData, async (data) => {

        const warehouse = await createWarehouse(data)
        revalidatePath("/warehouse")
        return warehouse
    })
}

export async function updateWarehouseAction(id: string, formData: FormData) {
    return validatedAction(warehouseSchema, formData, async (data) => {

        const warehouse = await updateWarehouse(id, data)
        revalidatePath("/warehouse")
        return warehouse
    })
}

export async function deleteWarehouseAction(id: string) {
    return validatedAction(z.any(), {}, async () => {
        await deleteWarehouse(id)
        revalidatePath("/warehouse")
        return null
    })
}
