export const ORDER_STATUS_VALUES = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
] as const

export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number]

export const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
}

export function getAllowedOrderStatuses(currentStatus: OrderStatus): OrderStatus[] {
    return [currentStatus, ...ORDER_STATUS_FLOW[currentStatus]]
}

export function canTransitionOrderStatus(from: OrderStatus, to: OrderStatus) {
    if (from === to) return true
    return ORDER_STATUS_FLOW[from].includes(to)
}
