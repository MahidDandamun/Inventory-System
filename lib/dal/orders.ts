import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { createSystemLog } from "@/lib/dal/system-logs"
import { requireCurrentUser } from "@/lib/dal/guards"
import {
    type OrderStatus,
    ORDER_STATUS_FLOW,
    canTransitionOrderStatus,
} from "@/lib/order-status"

import { recordStockMovement } from "@/lib/dal/stock-movements"
import { checkLowStock } from "@/lib/dal/notifications"
import type { Order, OrderItem } from "@prisma/client"

export { ORDER_STATUS_FLOW }

export type OrderDTO = {
    id: string
    orderNo: string
    customer: string | null
    customerId: string | null
    status: OrderStatus
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

export function toOrderDTO(order: Order & { _count?: { items: number }, customerRef?: { name: string } | null }): OrderDTO {
    return {
        id: order.id,
        orderNo: order.orderNo,
        customer: order.customerRef?.name || order.customerName || null,
        customerId: order.customerId,
        status: order.status as OrderStatus,
        total: typeof order.total?.toNumber === 'function' ? order.total.toNumber() : Number(order.total),
        itemCount: order._count?.items ?? 0,
        createdAt: order.createdAt,
    }
}

export function toOrderDetailDTO(order: Order & { _count?: { items: number }, customerRef?: { name: string } | null, items: (OrderItem & { product: { name: string } })[] }): OrderDetailDTO {
    return {
        ...toOrderDTO(order),
        items: order.items.map(item => ({
            id: item.id,
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: typeof item.unitPrice?.toNumber === 'function' ? item.unitPrice.toNumber() : Number(item.unitPrice),
        }))
    }
}

export const getOrders = cache(async (): Promise<OrderDTO[]> => {
    await requireCurrentUser()

    const orders = await prisma.order.findMany({
        include: { _count: { select: { items: true } }, customerRef: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
    })

    return orders.map((o) => toOrderDTO(o))
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
            customerRef: { select: { name: true } },
        },
    })
    if (!o) return null

    return toOrderDetailDTO(o)
}

export type OrderCreateDTO = {
    customerName?: string
    customerId?: string
    items: { productId: string; quantity: number; unitPrice: number }[]
}

export type { OrderStatus }

export async function createOrder(data: OrderCreateDTO): Promise<OrderDetailDTO> {
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
                customerName: data.customerName,
                customerId: data.customerId,
                orderNo,
                total,
                createdById: user.id,
                items: {
                    create: calculatedItems,
                },
            },
            include: {
                items: {
                    include: { product: { select: { name: true } } }
                },
                _count: { select: { items: true } },
                customerRef: { select: { name: true } }
            }
        })

        for (const item of calculatedItems) {
            await tx.product.update({
                where: { id: item.productId },
                data: { quantity: { decrement: item.quantity } },
            })
            await recordStockMovement({
                entity: "PRODUCT",
                entityId: item.productId,
                type: "OUT",
                quantity: item.quantity,
                reason: `Order ${orderNo} created`,
                userId: user.id
            }, tx)
        }

        return created
    })

    await createSystemLog(user.id, "CREATE", "ORDER", order.id, JSON.stringify(data))
    await checkLowStock()
    return toOrderDetailDTO(order)
}

export async function updateOrderStatus(
    id: string,
    status: OrderStatus
): Promise<OrderDetailDTO> {
    const user = await requireCurrentUser()

    const existingOrder = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
    })

    if (!existingOrder) {
        throw new Error("Order not found")
    }

    if (!canTransitionOrderStatus(existingOrder.status as OrderStatus, status)) {
        throw new Error(`Invalid status transition: ${existingOrder.status} -> ${status}`)
    }

    const order = await prisma.$transaction(async (tx) => {
        const updated = await tx.order.update({
            where: { id },
            data: { status },
            include: {
                items: {
                    include: { product: { select: { name: true } } }
                },
                _count: { select: { items: true } },
                customerRef: { select: { name: true } }
            }
        })

        if (status === "CANCELLED") {
            for (const item of existingOrder.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { quantity: { increment: item.quantity } },
                })
                await recordStockMovement({
                    entity: "PRODUCT",
                    entityId: item.productId,
                    type: "IN",
                    quantity: item.quantity,
                    reason: `Order ${existingOrder.orderNo} cancelled`,
                    userId: user.id
                }, tx)
            }
        }

        return updated
    })

    await createSystemLog(user.id, "UPDATE", "ORDER", id, JSON.stringify({ status }))
    if (status === "CANCELLED") await checkLowStock()
    return toOrderDetailDTO(order)
}

export async function deleteOrder(id: string): Promise<OrderDetailDTO> {
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
                await recordStockMovement({
                    entity: "PRODUCT",
                    entityId: item.productId,
                    type: "IN",
                    quantity: item.quantity,
                    reason: `Order ${existingOrder.orderNo} deleted`,
                    userId: user.id
                }, tx)
            }
        }

        return tx.order.delete({
            where: { id },
            include: {
                items: {
                    include: { product: { select: { name: true } } }
                },
                _count: { select: { items: true } },
                customerRef: { select: { name: true } }
            }
        })
    })

    await createSystemLog(user.id, "DELETE", "ORDER", id)
    return toOrderDetailDTO(order)
}
