import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { createSystemLog } from "@/lib/dal/system-logs"

const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
}

async function requireCurrentUser() {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")
    return user
}

function canTransitionOrderStatus(from: OrderStatus, to: OrderStatus) {
    if (from === to) return true
    return ORDER_STATUS_FLOW[from].includes(to)
}

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
        productId: string
        productName: string
        quantity: number
        unitPrice: number
    }[]
}

export const getOrders = cache(async (): Promise<OrderDTO[]> => {
    await requireCurrentUser()

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
    await requireCurrentUser()

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
            productId: item.productId,
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
    const user = await requireCurrentUser()

    const productIds = [...new Set(data.items.map((item) => item.productId))]

    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, price: true, quantity: true, name: true },
    })

    if (products.length !== productIds.length) {
        throw new Error("One or more selected products were not found")
    }

    const productById = new Map(products.map((p) => [p.id, p]))

    for (const item of data.items) {
        const product = productById.get(item.productId)
        if (!product) throw new Error("Invalid product selection")
        if (product.quantity < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`)
        }
    }

    const calculatedItems = data.items.map((item) => {
        const product = productById.get(item.productId)
        if (!product) throw new Error("Invalid product selection")

        return {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product.price.toNumber(),
        }
    })

    const total = calculatedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const orderNo = `ORD-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`

    const order = await prisma.$transaction(async (tx) => {
        const created = await tx.order.create({
            data: {
                customer: data.customer,
                orderNo,
                total,
                createdById: user.id,
                items: {
                    create: calculatedItems,
                },
            },
        })

        for (const item of calculatedItems) {
            await tx.product.update({
                where: { id: item.productId },
                data: { quantity: { decrement: item.quantity } },
            })
        }

        return created
    })

    await createSystemLog(user.id, "CREATE", "ORDER", order.id, JSON.stringify(data))
    return order
}

export async function updateOrderStatus(
    id: string,
    status: OrderStatus
) {
    const user = await requireCurrentUser()

    const existingOrder = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
    })

    if (!existingOrder) {
        throw new Error("Order not found")
    }

    if (!canTransitionOrderStatus(existingOrder.status, status)) {
        throw new Error(`Invalid status transition: ${existingOrder.status} -> ${status}`)
    }

    const order = await prisma.$transaction(async (tx) => {
        const updated = await tx.order.update({
            where: { id },
            data: { status },
        })

        if (status === "CANCELLED") {
            for (const item of existingOrder.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { quantity: { increment: item.quantity } },
                })
            }
        }

        return updated
    })

    await createSystemLog(user.id, "UPDATE", "ORDER", id, JSON.stringify({ status }))
    return order
}

export async function deleteOrder(id: string) {
    const user = await requireCurrentUser()

    const existingOrder = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
    })

    if (!existingOrder) {
        throw new Error("Order not found")
    }

    const order = await prisma.$transaction(async (tx) => {
        if (existingOrder.status !== "CANCELLED") {
            for (const item of existingOrder.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { quantity: { increment: item.quantity } },
                })
            }
        }

        return tx.order.delete({ where: { id } })
    })

    await createSystemLog(user.id, "DELETE", "ORDER", id)
    return order
}
