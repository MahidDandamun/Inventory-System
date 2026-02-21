// lib/dal/orders.ts
// ---
// Data Access Layer — Order operations
// ---

import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

/** DTO for order list views */
export type OrderDTO = {
    id: string
    orderNo: string
    customer: string
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
    total: number
    itemCount: number
    createdAt: Date
}

/** DTO for order detail with line items */
export type OrderDetailDTO = OrderDTO & {
    items: {
        id: string
        productName: string
        quantity: number
        unitPrice: number
    }[]
}

/**
 * Get all orders.
 */
export const getOrders = cache(async (): Promise<OrderDTO[]> => {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    const orders = await prisma.order.findMany({
        include: { _count: { select: { items: true } } },
        orderBy: { createdAt: "desc" },
    })

    return orders.map((o: typeof orders[number]) => ({
        id: o.id,
        orderNo: o.orderNo,
        customer: o.customer,
        status: o.status,
        total: o.total.toNumber(),
        itemCount: o._count.items,
        createdAt: o.createdAt,
    }))
})

/**
 * Get a single order with line items.
 */
export async function getOrderById(
    id: string
): Promise<OrderDetailDTO | null> {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    const o = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: { product: { select: { name: true } } },
            },
            _count: { select: { items: true } },
        },
    })
    if (!o) return null

    return {
        id: o.id,
        orderNo: o.orderNo,
        customer: o.customer,
        status: o.status,
        total: o.total.toNumber(),
        itemCount: o._count.items,
        createdAt: o.createdAt,
        items: o.items.map((item: typeof o.items[number]) => ({
            id: item.id,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice.toNumber(),
        })),
    }
}
