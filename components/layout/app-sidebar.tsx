// components/layout/app-sidebar.tsx
// ---
// Main application sidebar
// Uses tabler icons (as per shadcn preset)
// ---

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    IconDashboard,
    IconPackage,
    IconBuildingWarehouse,
    IconBoxSeam,
    IconShoppingCart,
    IconFileInvoice,
    IconUsers,
    IconSettings,
} from "@tabler/icons-react"

const navigation = [
    { label: "Dashboard", href: "/dashboard", icon: IconDashboard },
    { label: "Products", href: "/products", icon: IconPackage },
    { label: "Warehouse", href: "/warehouse", icon: IconBuildingWarehouse },
    { label: "Raw Materials", href: "/raw-materials", icon: IconBoxSeam },
    { label: "Orders", href: "/orders", icon: IconShoppingCart },
    { label: "Invoices", href: "/invoices", icon: IconFileInvoice },
    { label: "Users", href: "/users", icon: IconUsers },
    { label: "Settings", href: "/settings", icon: IconSettings },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden w-64 border-r bg-sidebar text-sidebar-foreground md:flex md:flex-col">
            {/* Logo */}
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <IconPackage className="h-5 w-5 text-sidebar-primary" />
                    <span>Inventory</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
