// Using a union type instead of Prisma enum to bypass IDE sync issues
export type TransferStatus = "REQUESTED" | "APPROVED" | "IN_TRANSIT" | "RECEIVED" | "CANCELLED";

export const TRANSFER_STATUS_VALUES: TransferStatus[] = [
    "REQUESTED",
    "APPROVED",
    "IN_TRANSIT",
    "RECEIVED",
    "CANCELLED",
]

export const TRANSFER_STATUS_FLOW: Record<TransferStatus, TransferStatus[]> = {
    REQUESTED: ["APPROVED", "CANCELLED"],
    APPROVED: ["IN_TRANSIT", "CANCELLED"],
    IN_TRANSIT: ["RECEIVED", "CANCELLED"],
    RECEIVED: [], // Terminal
    CANCELLED: [], // Terminal
}

export function canTransitionTransferStatus(
    from: TransferStatus,
    to: TransferStatus
) {
    if (from === to) return true
    return TRANSFER_STATUS_FLOW[from]?.includes(to) ?? false
}
