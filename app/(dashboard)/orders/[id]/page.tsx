import { getOrderById } from "@/lib/dal/orders"
import { OrderForm } from "../_components/order-form"
import { OrderTimeline } from "../_components/order-timeline"
import { notFound } from "next/navigation"

export const metadata = {
    title: "View Order | Inventory System",
}

export default async function ViewOrderPage({
    params,
}: {
    params: { id: string }
}) {
    const { id } = await params

    const order = await getOrderById(id)

    if (!order) {
        notFound()
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Order Details</h1>
                <p className="text-muted-foreground">
                    View order information and update status.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                    {/* Empty products array passed because editing an order's items isn't supported in this view, only status updates */}
                    <OrderForm order={order} products={[]} />
                </div>
                <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm h-fit">
                    <OrderTimeline order={order} />
                </div>
            </div>
        </div>
    )
}
