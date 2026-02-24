import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    IconPackage,
    IconBuildingWarehouse,
    IconShoppingCart,
    IconCurrencyDollar,
} from "@tabler/icons-react"
import { getProducts } from "@/lib/dal/products"
import { getWarehouses } from "@/lib/dal/warehouses"
import { getOrders } from "@/lib/dal/orders"
import { OverviewChart } from "./_components/overview-chart"

export const metadata = {
    title: "Dashboard",
}

export default async function DashboardPage() {
    // Parallel fetching for performance
    const [products, warehouses, orders] = await Promise.all([
        getProducts(),
        getWarehouses(),
        getOrders(),
    ])

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)

    // Format revenue
    const formattedRevenue = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(totalRevenue)

    const stats = [
        {
            title: "Total Revenue",
            value: formattedRevenue,
            description: "+20.1% from last month", // Hardcoded mock growth
            icon: IconCurrencyDollar,
        },
        {
            title: "Products",
            value: products.length.toString(),
            description: "Active in the catalog",
            icon: IconPackage,
        },
        {
            title: "Warehouses",
            value: warehouses.length.toString(),
            description: "Operating locations",
            icon: IconBuildingWarehouse,
        },
        {
            title: "Orders",
            value: orders.length.toString(),
            description: "Total orders placed",
            icon: IconShoppingCart,
        },
    ]

    // Generate chart data: grouped by month from orders
    // In a real app we'd do a complex SQL GROUP BY on the timeline.
    // For this boilerplate we'll just mock a 12-month array and fill it with our current orders.
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const chartData = months.map(m => ({ name: m, total: 0 }))

    // Distribute orders into the chart
    orders.forEach(order => {
        const date = new Date(order.createdAt)
        const monthIndex = date.getMonth()
        chartData[monthIndex].total += order.total
    })

    // If there are no orders, give it some fake data so the chart isn't empty on first run
    if (orders.length === 0) {
        chartData.forEach((data, i) => {
            const mockFactor = (i * 13) % 10;
            data.total = Math.floor((mockFactor / 10) * 5000) + 1000 + (i * 500)
        })
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard Overview</h1>

            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-5 w-5 text-primary/80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-primary">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle className="text-primary">Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewChart data={chartData} />
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="text-primary">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {orders.slice(0, 5).map(order => (
                                <div key={order.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none text-primary">{order.customer}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.orderNo}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        +${order.total.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            {orders.length === 0 && (
                                <div className="text-sm text-muted-foreground text-center py-4">
                                    No orders yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

