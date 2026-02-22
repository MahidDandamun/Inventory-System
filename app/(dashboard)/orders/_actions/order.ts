"use server"

import { revalidatePath } from "next/cache"
import { createOrder, updateOrderStatus, deleteOrder, type OrderStatus } from "@/lib/dal/orders"
import { orderSchema } from "@/schemas/order"

export async function createOrderAction(formData: FormData) {
    // We expect a JSON string for items since it's an array of objects
    const customer = formData.get("customer") as string
    const itemsRaw = formData.get("items") as string

    let items = []
    try {
        if (itemsRaw) items = JSON.parse(itemsRaw)
    } catch {
        return { error: { root: ["Invalid items format"] } }
    }

    const parsed = orderSchema.safeParse({ customer, items })

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const order = await createOrder(parsed.data)
        revalidatePath("/orders")
        return { success: true, data: order }
    } catch (error: unknown) {
        return { error: { root: [error instanceof Error ? error.message : "Unknown error"] } }
    }
}

export async function updateOrderStatusAction(id: string, formData: FormData) {
    const status = formData.get("status") as OrderStatus
    try {
        const order = await updateOrderStatus(id, status)
        revalidatePath("/orders")
        return { success: true, data: order }
    } catch (error: unknown) {
        return { error: { root: [error instanceof Error ? error.message : "Unknown error"] } }
    }
}

export async function deleteOrderAction(id: string) {
    try {
        await deleteOrder(id)
        revalidatePath("/orders")
        return { success: true }
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : "Unknown error" }
    }
}
