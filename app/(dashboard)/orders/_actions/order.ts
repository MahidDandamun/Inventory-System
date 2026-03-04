"use server"

import { revalidatePath } from "next/cache"
import { createOrder, updateOrderStatus, deleteOrder, type OrderStatus } from "@/lib/dal/orders"
import { orderSchema, orderStatusSchema } from "@/schemas/order"
import { createNotification } from "@/lib/dal/notifications"
import { getAllUsers } from "@/lib/dal/users"
import { validatedAction } from "@/lib/actions/safe-action"
import { z } from "zod"

export async function createOrderAction(formData: FormData) {
    const customerName = formData.get("customerName") as string
    const customerId = formData.get("customerId") as string
    const notesOriginal = formData.get("notes")
    const notes = typeof notesOriginal === "string" ? notesOriginal : undefined
    const itemsRaw = formData.get("items") as string

    let items = []
    try {
        if (itemsRaw) items = JSON.parse(itemsRaw)
    } catch {
        return { success: false, error: "Invalid items format", fieldErrors: { root: ["Invalid items format"] } } as const
    }

    return validatedAction(orderSchema, { customerName, customerId, notes, items }, async (data) => {
        const order = await createOrder(data)

        const users = await getAllUsers()
        const admins = users.filter((u) => u.role === "ADMIN")
        for (const admin of admins) {
            await createNotification(admin.id, "New Order Received", `Order #${order.orderNo} was placed by ${order.customer}.`)
        }

        revalidatePath("/orders")
        return order
    })
}

export async function updateOrderStatusAction(id: string, formData: FormData) {
    return validatedAction(orderStatusSchema, formData.get("status"), async (statusData) => {
        const status: OrderStatus = statusData as OrderStatus
        const order = await updateOrderStatus(id, status)

        if (status === "CANCELLED") {
            const users = await getAllUsers()
            const admins = users.filter((u) => u.role === "ADMIN")
            for (const admin of admins) {
                await createNotification(admin.id, "Order Cancelled", `Order #${order.orderNo} was cancelled.`)
            }
        }

        revalidatePath("/orders")
        return order
    })
}

export async function deleteOrderAction(id: string) {
    return validatedAction(z.any(), {}, async () => {
        await deleteOrder(id)
        revalidatePath("/orders")
        return null
    })
}
