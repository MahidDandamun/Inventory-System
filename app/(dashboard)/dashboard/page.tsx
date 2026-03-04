import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    IconPackage,
    IconCurrencyDollar,
    IconTrendingUp,
    IconShoppingCartDiscount,
} from "@tabler/icons-react"
import { getOrders } from "@/lib/dal/orders"
import { getReplenishmentSuggestions } from "@/lib/dal/replenishment"
import { getSuppliers } from "@/lib/dal/suppliers"
import { getDashboardMetrics } from "@/lib/dal/reports"
import { OverviewChart } from "./_components/overview-chart"
import { ReplenishmentWidget } from "./_components/replenishment-widget"

export const metadata = {
    title: "Dashboard | Inventory System",
}

export default async function DashboardPage() {
    // Parallel fetching for performance
    const [orders, suggestions, suppliers, metrics] = await Promise.all([
        getOrders(),
        getReplenishmentSuggestions(),
        getSuppliers(),
        getDashboardMetrics()
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
            title: "Stock Turns",
            value: metrics.stockTurns.toFixed(2),
            description: "Cost vs Avg Inventory",
            icon: IconTrendingUp,
        },
        {
            title: "Order Fill Rate",
            value: `${metrics.fillRate.toFixed(1)}%`,
            description: "Percentage of orders delivered",
            icon: IconShoppingCartDiscount,
        },
        {
            title: "Top Products Sold",
            value: metrics.topProducts.reduce((acc, p) => acc + p.quantitySold, 0).toString(),
            description: "Across top 5 items",
            icon: IconPackage,
        },
    ]

    const hasChartData = metrics.revenueTrends.some(t => t.total > 0)

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
                            <CardTitle className="text-primary">Revenue Trend</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            {hasChartData ? (
                                <OverviewChart data={metrics.revenueTrends} />
                            ) : (
                                <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                                    <div className="text-center space-y-2">
                                        <IconCurrencyDollar className="h-10 w-10 mx-auto opacity-30" />
                                        <p className="text-sm">No revenue data available yet.</p>
                                        <p className="text-xs">Create your first order to see revenue trends.</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-primary">Top Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {metrics.topProducts.map((p, i) => (
                                    <div key={p.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium leading-none">{p.name}</p>
                                                <p className="text-sm text-muted-foreground">{p.quantitySold} units sold</p>
                                            </div>
                                        </div>
                                        <div className="font-medium text-primary">
                                            ${p.revenue.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                                {metrics.topProducts.length === 0 && (
                                    <div className="text-center text-sm text-muted-foreground py-4">
                                        No product sales yet.
                                    </div>
                                )}
                            </div>
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
                                            <p className="text-sm font-medium leading-none text-primary">{order.customer || "Walk-in"}</p>
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
