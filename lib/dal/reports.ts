import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { requireCurrentUser } from "@/lib/dal/guards"

export type StockValuationDTO = {
    id: string
    name: string
    sku: string
    quantity: number
    price: number
    valuation: number
}

export type DeadStockDTO = {
    id: string
    name: string
    sku: string
    quantity: number
    price: number
    valuation: number
}

export type OrderFillRateDTO = {
    totalOrders: number
    deliveredOrders: number
    fillRate: number
}

export type RevenueByCustomerDTO = {
    customerId: string | null
    customerName: string
    totalRevenue: number
}

export type RevenueByWarehouseDTO = {
    warehouseId: string
    warehouseLocation: string
    totalRevenue: number
}

export type DashboardMetricsDTO = {
    stockTurns: number
    fillRate: number
    topProducts: { id: string; name: string; quantitySold: number; revenue: number }[]
    revenueTrends: { name: string; total: number }[]
}

export const getStockValuation = cache(async (): Promise<{ items: StockValuationDTO[], totalValuation: number }> => {
    await requireCurrentUser()

    const products = await prisma.product.findMany({
        select: { id: true, name: true, sku: true, quantity: true, price: true },
        orderBy: { name: 'asc' }
    })

    let totalValuation = 0
    const items = products.map(p => {
        const val = p.quantity * p.price.toNumber()
        totalValuation += val
        return {
            id: p.id,
            name: p.name,
            sku: p.sku,
            quantity: p.quantity,
            price: p.price.toNumber(),
            valuation: val
        }
    })

    return { items, totalValuation }
})

export const getDeadStock = cache(async (days = 30): Promise<DeadStockDTO[]> => {
    await requireCurrentUser()

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const products = await prisma.product.findMany({
        where: {
            quantity: { gt: 0 },
            orderItems: { none: { order: { createdAt: { gte: cutoffDate } } } }
        },
        select: { id: true, name: true, sku: true, quantity: true, price: true },
        orderBy: { quantity: 'desc' }
    })

    return products.map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        quantity: p.quantity,
        price: p.price.toNumber(),
        valuation: p.quantity * p.price.toNumber()
    }))
})

export const getOrderFillRate = cache(async (): Promise<OrderFillRateDTO> => {
    await requireCurrentUser()

    const totalOrders = await prisma.order.count()
    const deliveredOrders = await prisma.order.count({ where: { status: "DELIVERED" } })

    return {
        totalOrders,
        deliveredOrders,
        fillRate: totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0
    }
})

export const getRevenueByCustomer = cache(async (): Promise<RevenueByCustomerDTO[]> => {
    await requireCurrentUser()

    const orders = await prisma.order.findMany({
        where: { status: { not: 'CANCELLED' } },
        select: { customerId: true, customerName: true, total: true, customerRef: { select: { name: true } } }
    })

    const revenueMap = new Map<string, RevenueByCustomerDTO>()

    for (const order of orders) {
        const cId = order.customerId || "Walk-in"
        const cName = order.customerRef?.name || order.customerName || "Walk-in Customer"

        const existing = revenueMap.get(cId) || { customerId: order.customerId, customerName: cName, totalRevenue: 0 }
        existing.totalRevenue += order.total.toNumber()
        revenueMap.set(cId, existing)
    }

    return Array.from(revenueMap.values()).sort((a, b) => b.totalRevenue - a.totalRevenue)
})

export const getRevenueByWarehouse = cache(async (): Promise<RevenueByWarehouseDTO[]> => {
    await requireCurrentUser()

    // OrderItems have productId, which connects to warehouseId
    const orderItems = await prisma.orderItem.findMany({
        select: {
            quantity: true,
            unitPrice: true,
            product: { select: { warehouse: { select: { id: true, location: true } } } },
            order: { select: { status: true } }
        }
    })

    const revenueMap = new Map<string, RevenueByWarehouseDTO>()

    for (const item of orderItems) {
        if (item.order.status === 'CANCELLED') continue

        const wId = item.product.warehouse.id
        const wLoc = item.product.warehouse.location

        const existing = revenueMap.get(wId) || { warehouseId: wId, warehouseLocation: wLoc, totalRevenue: 0 }
        existing.totalRevenue += (item.quantity * item.unitPrice.toNumber())
        revenueMap.set(wId, existing)
    }

    return Array.from(revenueMap.values()).sort((a, b) => b.totalRevenue - a.totalRevenue)
})

export const getDashboardMetrics = cache(async (): Promise<DashboardMetricsDTO> => {
    await requireCurrentUser()

    // 1. Stock Turns = COGS / Avg Inventory Valuation
    // For simplicity, let's use Total Revenue (all time) / Current Valuation
    const { totalValuation } = await getStockValuation()
    const totalOrdersResult = await prisma.order.aggregate({
        where: { status: { not: 'CANCELLED' } },
        _sum: { total: true }
    })
    const totalRevenue = totalOrdersResult._sum.total?.toNumber() || 0
    const stockTurns = totalValuation > 0 ? totalRevenue / totalValuation : 0

    // 2. Fill Rate
    const fillRateData = await getOrderFillRate()

    // 3. Top Products
    const topItems = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
    })
    const productIds = topItems.map(i => i.productId)
    const products = await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, name: true, price: true } })

    const topProducts = topItems.map(i => {
        const p = products.find(prod => prod.id === i.productId)
        const qty = i._sum.quantity || 0
        return {
            id: i.productId,
            name: p?.name || "Unknown",
            quantitySold: qty,
            revenue: qty * (p?.price.toNumber() || 0)
        }
    })

    // 4. Trend Sparklines (Revenue grouped by last 12 months)
    const targetMonths = 12
    const now = new Date()
    const months = []
    for (let i = targetMonths - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        months.push({
            year: d.getFullYear(),
            month: d.getMonth(),
            name: d.toLocaleString('default', { month: 'short' }) + " '" + d.getFullYear().toString().slice(2)
        })
    }

    const trendsData = months.map(m => ({ name: m.name, year: m.year, month: m.month, total: 0 }))

    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1)

    const recentOrders = await prisma.order.findMany({
        where: {
            createdAt: { gte: twelveMonthsAgo },
            status: { not: 'CANCELLED' }
        },
        select: { createdAt: true, total: true }
    })

    for (const o of recentOrders) {
        const od = new Date(o.createdAt)
        const matchingMonth = trendsData.find(m => m.year === od.getFullYear() && m.month === od.getMonth())
        if (matchingMonth) {
            matchingMonth.total += o.total.toNumber()
        }
    }

    const revenueTrends = trendsData.map(m => ({ name: m.name, total: m.total }))

    return {
        stockTurns,
        fillRate: fillRateData.fillRate,
        topProducts,
        revenueTrends
    }
})
