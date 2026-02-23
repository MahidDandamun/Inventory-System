import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
    status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const s = status.toUpperCase()
    let colorClass = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" // Grey fallback

    if (["ACTIVE", "DELIVERED", "PAID"].includes(s)) {
        colorClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
    } else if (["PENDING", "PROCESSING"].includes(s)) {
        colorClass = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    } else if (["INACTIVE", "CANCELLED", "UNPAID"].includes(s)) {
        colorClass = "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
    } else if (["SHIPPED"].includes(s)) {
        colorClass = "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
    }

    return (
        <Badge variant="outline" className={`border-none ${colorClass}`}>
            {status}
        </Badge>
    )
}
