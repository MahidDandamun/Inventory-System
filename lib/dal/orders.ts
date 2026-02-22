import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export type OrderDTO = {
    id: string
    orderNo: string
    customer: string
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
    total: number
    itemCount: number
    createdAt: Date
}

export type OrderDetailDTO = OrderDTO & {
    items: {
        id: string
        productName: string
        quantity: number
        unitPrice: number
    }[]
}

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

export type OrderCreateDTO = {
    customer: string
    items: { productId: string; quantity: number; unitPrice: number }[]
}

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

export async function createOrder(data: OrderCreateDTO) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    const total = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const orderNo = `ORD-${Date.now().toString().slice(-6)}`

    return prisma.order.create({
        data: {
            customer: data.customer,
            orderNo,
            total,
            items: {
                create: data.items.map(i => ({
                    productId: i.productId,
                    quantity: i.quantity,
                    unitPrice: i.unitPrice
                }))
            }
        },
    })
}

export async function updateOrderStatus(
    id: string,
    status: OrderStatus
) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.order.update({
        where: { id },
        data: { status }
    })
}

export async function deleteOrder(id: string) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.order.delete({ where: { id } })
}
