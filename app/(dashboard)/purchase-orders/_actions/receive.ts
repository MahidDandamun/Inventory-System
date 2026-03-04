"use server"

import { revalidatePath } from "next/cache"
import { receiveGoods } from "@/lib/dal/goods-receipts"
import { goodsReceiptSchema } from "@/schemas/goods-receipt"
import { handleServerError } from "@/lib/error-handling"

export async function receiveGoodsAction(data: {
    purchaseOrderId: string
    notes?: string
    items: { purchaseOrderItemId: string; rawMaterialId: string; quantityReceived: number }[]
}) {
    const parsed = goodsReceiptSchema.safeParse(data)

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const item = await receiveGoods(parsed.data)
        revalidatePath(`/purchase-orders/${data.purchaseOrderId}`)
        revalidatePath("/purchase-orders")
        return { success: true, data: item }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}
