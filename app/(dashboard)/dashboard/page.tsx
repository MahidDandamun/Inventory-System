import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    IconCurrencyDollar,
    IconTrendingUp,
    IconShoppingCartDiscount,
    IconPackage,
} from "@tabler/icons-react"
import { getOrders } from "@/lib/dal/orders"
import { getReplenishmentSuggestions } from "@/lib/dal/replenishment"
import { getSuppliers } from "@/lib/dal/suppliers"
import { getDashboardMetrics } from "@/lib/dal/reports"
import { OverviewChart } from "./_components/overview-chart"
import { ReplenishmentWidget } from "./_components/replenishment-widget"

export const metadata = {
    title: "Dashboard — Theiapollo",
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
            iconBg: "bg-emerald-500/10",
            iconColor: "text-emerald-600 dark:text-emerald-400",
        },
        {
            title: "Stock Turns",
            value: metrics.stockTurns.toFixed(2),
            description: "Cost vs Avg Inventory",
            icon: IconTrendingUp,
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-600 dark:text-blue-400",
        },
        {
            title: "Order Fill Rate",
            value: `${metrics.fillRate.toFixed(1)}%`,
            description: "Percentage of orders delivered",
            icon: IconShoppingCartDiscount,
            iconBg: "bg-amber-500/10",
            iconColor: "text-amber-600 dark:text-amber-400",
        },
        {
            title: "Top Products Sold",
            value: metrics.topProducts.reduce((acc, p) => acc + p.quantitySold, 0).toString(),
            description: "Across top 5 items",
            icon: IconPackage,
            iconBg: "bg-violet-500/10",
            iconColor: "text-violet-600 dark:text-violet-400",
        },
    ]

    const hasChartData = metrics.revenueTrends.some(t => t.total > 0)

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Overview of your inventory and sales performance.</p>
            </div>

            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.iconBg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-semibold tracking-tight">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
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
                            <CardTitle className="text-base font-medium">Revenue Trend</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            {hasChartData ? (
                                <OverviewChart data={metrics.revenueTrends} />
                            ) : (
                                <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                                    <div className="text-center space-y-2">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                            <IconCurrencyDollar className="h-6 w-6 opacity-40" />
                                        </div>
                                        <p className="text-sm font-medium">No revenue data yet</p>
                                        <p className="text-xs text-muted-foreground">Create your first order to see revenue trends.</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-medium">Top Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {metrics.topProducts.map((p, i) => (
                                    <div key={p.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium leading-none">{p.name}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{p.quantitySold} units sold</p>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium">
                                            ${p.revenue.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                                {metrics.topProducts.length === 0 && (
                                    <div className="text-center text-sm text-muted-foreground py-6">
                                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted mb-2">
                                            <IconPackage className="h-5 w-5 opacity-40" />
                                        </div>
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
                            <CardTitle className="text-base font-medium">Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {orders.slice(0, 5).map(order => (
                                    <div key={order.id} className="flex items-center">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground shrink-0">
                                            {(order.customer || "W")[0]}
                                        </div>
                                        <div className="ml-3 space-y-0.5 min-w-0 flex-1">
                                            <p className="text-sm font-medium leading-none truncate">{order.customer || "Walk-in"}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.orderNo}
                                            </p>
                                        </div>
                                        <div className="ml-auto text-sm font-medium tabular-nums">
                                            +${order.total.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                                {orders.length === 0 && (
                                    <div className="text-center text-sm text-muted-foreground py-6">
                                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted mb-2">
                                            <IconPackage className="h-5 w-5 opacity-40" />
                                        </div>
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
