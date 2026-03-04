import { OrderDetailDTO } from "@/lib/dal/orders"
import { IconCircle, IconCircleCheck, IconX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export function OrderTimeline({ order }: { order: OrderDetailDTO }) {
    const isCancelled = order.status === "CANCELLED"

    const steps = [
        {
            label: "Order Placed",
            date: order.createdAt,
            completed: true,
            icon: IconCircleCheck,
        },
        {
            label: "Processing",
            date: order.confirmedAt,
            completed: !!order.confirmedAt || (order.status !== "PENDING" && !isCancelled),
            icon: !!order.confirmedAt ? IconCircleCheck : IconCircle,
        },
        {
            label: "Shipped",
            date: order.shippedAt,
            completed: !!order.shippedAt || (order.status === "DELIVERED" || order.status === "SHIPPED"),
            icon: !!order.shippedAt ? IconCircleCheck : IconCircle,
        },
        {
            label: "Delivered",
            date: order.deliveredAt,
            completed: !!order.deliveredAt || order.status === "DELIVERED",
            icon: !!order.deliveredAt ? IconCircleCheck : IconCircle,
        }
    ]

    if (isCancelled) {
        steps.push({
            label: "Cancelled",
            date: order.cancelledAt,
            completed: true,
            icon: IconX,
        })
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Order Timeline</h3>
            <div className="relative border-l border-muted-foreground/30 ml-3 space-y-6 pb-2">
                {steps.map((step, index) => {
                    const Icon = step.icon
                    const isLast = index === steps.length - 1 && isCancelled
                    return (
                        <div key={step.label} className="relative pl-8">
                            <div className={cn("absolute -left-3.5 bg-background rounded-full p-1", step.completed ? (isCancelled && isLast ? "text-destructive" : "text-primary") : "text-muted-foreground")}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className={cn("font-medium", step.completed ? "text-foreground" : "text-muted-foreground")}>
                                    {step.label}
                                </span>
                                {step.date ? (
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(step.date).toLocaleString()}
                                    </span>
                                ) : (
                                    <span className="text-sm text-muted-foreground">Pending</span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
            {order.notes && (
                <div className="mt-6 pt-4 border-t">
                    <span className="font-semibold block mb-1">Order Notes</span>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{order.notes}</p>
                </div>
            )}
        </div>
    )
}
