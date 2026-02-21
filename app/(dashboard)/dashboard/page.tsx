// app/(dashboard)/dashboard/page.tsx
// ---
// Dashboard overview page
// Shows stat cards and overview chart placeholder
// ---

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    IconPackage,
    IconBuildingWarehouse,
    IconShoppingCart,
    IconCurrencyDollar,
} from "@tabler/icons-react"

export const metadata = {
    title: "Dashboard",
}

const stats = [
    {
        title: "Total Products",
        value: "—",
        description: "Connect DB to see",
        icon: IconPackage,
    },
    {
        title: "Warehouses",
        value: "—",
        description: "Connect DB to see",
        icon: IconBuildingWarehouse,
    },
    {
        title: "Orders",
        value: "—",
        description: "Connect DB to see",
        icon: IconShoppingCart,
    },
    {
        title: "Revenue",
        value: "—",
        description: "Connect DB to see",
        icon: IconCurrencyDollar,
    },
]

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
