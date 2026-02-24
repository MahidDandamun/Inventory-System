import { getOrders } from "@/lib/dal/orders"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./_components/columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"

export const metadata = {
    title: "Orders | Inventory System",
}

export default async function OrdersPage() {
    const orders = await getOrders()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Orders</h1>
                    <p className="text-muted-foreground">
                        Manage customer quotes and fulfillment.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/orders/new">
                        <IconPlus className="mr-2 h-4 w-4" />
                        Create Order
                    </Link>
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={orders}
                searchKey="orderNo"
                filterColumns={[
                    {
                        id: "status",
                        title: "Status",
                        options: [
                            { label: "Pending", value: "PENDING" },
                            { label: "Processing", value: "PROCESSING" },
                            { label: "Shipped", value: "SHIPPED" },
                            { label: "Delivered", value: "DELIVERED" },
                            { label: "Cancelled", value: "CANCELLED" },
                        ]
                    }
                ]}
            />
        </div>
    )
}

