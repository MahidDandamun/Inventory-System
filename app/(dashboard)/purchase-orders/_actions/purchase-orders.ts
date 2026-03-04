"use server"

import { revalidatePath } from "next/cache"
import {
    createPurchaseOrder,
    updatePurchaseOrderStatus,
    deletePurchaseOrder,
} from "@/lib/dal/purchase-orders"
import { purchaseOrderSchema, updatePurchaseOrderStatusSchema } from "@/schemas/purchase-order"
import { handleServerError } from "@/lib/error-handling"
import type { POStatus } from "@/lib/po-status"

export async function createPurchaseOrderAction(data: {
    supplierId: string
    notes?: string
    items: { rawMaterialId: string; quantity: number; unitCost: number }[]
}) {
    const parsed = purchaseOrderSchema.safeParse(data)

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const item = await createPurchaseOrder(parsed.data)
        revalidatePath("/purchase-orders")
        return { success: true, data: item }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function updatePurchaseOrderStatusAction(id: string, status: POStatus) {
    const parsed = updatePurchaseOrderStatusSchema.safeParse({ status })

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const item = await updatePurchaseOrderStatus(id, parsed.data.status as POStatus)
        revalidatePath("/purchase-orders")
        return { success: true, data: item }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function deletePurchaseOrderAction(id: string) {
    try {
        await deletePurchaseOrder(id)
        revalidatePath("/purchase-orders")
        return { success: true }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}
