export const PO_STATUS_VALUES = [
    "DRAFT",
    "SENT",
    "PARTIALLY_RECEIVED",
    "RECEIVED",
    "CLOSED",
    "CANCELLED",
] as const

export type POStatus = (typeof PO_STATUS_VALUES)[number]

export const PO_STATUS_FLOW: Record<POStatus, POStatus[]> = {
    DRAFT: ["SENT", "CANCELLED"],
    SENT: ["PARTIALLY_RECEIVED", "RECEIVED", "CANCELLED"],
    PARTIALLY_RECEIVED: ["RECEIVED", "CANCELLED"],
    RECEIVED: ["CLOSED"],
    CLOSED: [],
    CANCELLED: [],
}

export function getAllowedPOStatuses(currentStatus: POStatus): POStatus[] {
    return [currentStatus, ...PO_STATUS_FLOW[currentStatus]]
}

export function canTransitionPOStatus(from: POStatus, to: POStatus) {
    if (from === to) return true
    return PO_STATUS_FLOW[from].includes(to)
}
