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
import { getReplenishmentSuggestions } from "@/lib/dal/replenishment"
import { getSuppliers } from "@/lib/dal/suppliers"
import { OverviewChart } from "./_components/overview-chart"
import { ReplenishmentWidget } from "./_components/replenishment-widget"

export const metadata = {
    title: "Dashboard",
}

export default async function DashboardPage() {
    // Parallel fetching for performance
    const [products, warehouses, orders, suggestions, suppliers] = await Promise.all([
        getProducts(),
        getWarehouses(),
        getOrders(),
        getReplenishmentSuggestions(),
        getSuppliers(),
    ])

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)

    // Calculate real period-over-period revenue growth
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const thisMonthRevenue = orders
        .filter((o) => {
            const d = new Date(o.createdAt)
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear
        })
        .reduce((sum, o) => sum + (o.total || 0), 0)

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const lastMonthRevenue = orders
        .filter((o) => {
            const d = new Date(o.createdAt)
            return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
        })
        .reduce((sum, o) => sum + (o.total || 0), 0)

    let revenueDescription: string
    if (lastMonthRevenue === 0 && thisMonthRevenue > 0) {
        revenueDescription = "New revenue this month"
    } else if (lastMonthRevenue === 0) {
        revenueDescription = "No revenue data yet"
    } else {
        const growthPct = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        const sign = growthPct >= 0 ? "+" : ""
        revenueDescription = `${sign}${growthPct.toFixed(1)}% from last month`
    }

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
            description: revenueDescription,
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
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const chartData = months.map(m => ({ name: m, total: 0 }))

    // Distribute orders into the chart
    orders.forEach(order => {
        const date = new Date(order.createdAt)
        const monthIndex = date.getMonth()
        chartData[monthIndex].total += order.total
    })

    const hasChartData = orders.length > 0

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
                <div className="col-span-4 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-primary">Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            {hasChartData ? (
                                <OverviewChart data={chartData} />
                            ) : (
                                <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                                    <div className="text-center space-y-2">
                                        <IconShoppingCart className="h-10 w-10 mx-auto opacity-30" />
                                        <p className="text-sm">No order data available yet.</p>
                                        <p className="text-xs">Create your first order to see revenue trends.</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-3 space-y-4">
                    {/* Replenishment Widget */}
                    <ReplenishmentWidget suggestions={suggestions} suppliers={suppliers} />

                    <Card>
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
        </div>
    )
}

