"use server"

import { revalidatePath } from "next/cache"
import { createOrder, updateOrderStatus, deleteOrder, type OrderStatus } from "@/lib/dal/orders"
import { orderSchema, orderStatusSchema } from "@/schemas/order"
import { createNotification } from "@/lib/dal/notifications"
import { getAllUsers } from "@/lib/dal/users"
import { handleServerError } from "@/lib/error-handling"

export async function createOrderAction(formData: FormData) {
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

        const users = await getAllUsers()
        const admins = users.filter((u) => u.role === "ADMIN")
        for (const admin of admins) {
            await createNotification(admin.id, "New Order Received", `Order #${order.orderNo} was placed by ${order.customer}.`)
        }

        revalidatePath("/orders")
        return { success: true, data: order }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function updateOrderStatusAction(id: string, formData: FormData) {
    const parsedStatus = orderStatusSchema.safeParse(formData.get("status"))

    if (!parsedStatus.success) {
        return { error: { status: ["Invalid order status"] } }
    }

    const status: OrderStatus = parsedStatus.data

    try {
        const order = await updateOrderStatus(id, status)

        if (status === "CANCELLED") {
            const users = await getAllUsers()
            const admins = users.filter((u) => u.role === "ADMIN")
            for (const admin of admins) {
                await createNotification(admin.id, "Order Cancelled", `Order #${order.orderNo} was cancelled.`)
            }
        }

        revalidatePath("/orders")
        return { success: true, data: order }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function deleteOrderAction(id: string) {
    try {
        await deleteOrder(id)
        revalidatePath("/orders")
        return { success: true }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}
