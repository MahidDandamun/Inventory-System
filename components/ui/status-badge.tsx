import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
    status: string
}

// Semantic status color mapping
const STATUS_STYLES: Record<string, string> = {
    // Success states (green)
    ACTIVE: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    DELIVERED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    PAID: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    COMPLETED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    RECEIVED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    APPROVED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    IN_STOCK: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",

    // Warning / in-progress states (amber)
    PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    DRAFT: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    SCHEDULED: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    PENDING_APPROVAL: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    PARTIALLY_PAID: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    PARTIALLY_RECEIVED: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    REQUESTED: "bg-amber-500/10 text-amber-700 dark:text-amber-400",

    // Info / transitional states (blue)
    PROCESSING: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    SHIPPED: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    IN_TRANSIT: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    SENT: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    IN_PROGRESS: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    ISSUED: "bg-blue-500/10 text-blue-700 dark:text-blue-400",

    // Destructive states (red)
    OVERDUE: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
    REJECTED: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
    EXPIRED: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
    RMA: "bg-rose-500/10 text-rose-700 dark:text-rose-400",

    // Muted / terminal states (gray)
    INACTIVE: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    CANCELLED: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    VOID: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    CLOSED: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    DEPLETED: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    QUARANTINED: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    SOLD: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
}

const FALLBACK_STYLE = "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"

export function StatusBadge({ status }: StatusBadgeProps) {
    const colorClass = STATUS_STYLES[status.toUpperCase()] ?? FALLBACK_STYLE

    // Format display: PARTIALLY_RECEIVED → Partially Received
    const displayText = status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase())

    return (
        <Badge variant="outline" className={`border-none font-medium ${colorClass}`}>
            {displayText}
        </Badge>
    )
}
