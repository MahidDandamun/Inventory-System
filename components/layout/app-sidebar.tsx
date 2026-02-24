// components/layout/app-sidebar.tsx
// ---
// Main application sidebar with role-based navigation
// Admin sees all tabs; regular users see a restricted subset
// ---

import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
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
    IconHistory,
} from "@tabler/icons-react"
import { ActiveLink } from "./active-link"
import Image from "next/image"

const adminNavigation = [
    { label: "Dashboard", href: "/dashboard", icon: IconDashboard },
    { label: "Products", href: "/products", icon: IconPackage },
    { label: "Warehouse", href: "/warehouse", icon: IconBuildingWarehouse },
    { label: "Raw Materials", href: "/raw-materials", icon: IconBoxSeam },
    { label: "Orders", href: "/orders", icon: IconShoppingCart },
    { label: "Invoices", href: "/invoices", icon: IconFileInvoice },
    { label: "System Logs", href: "/system-logs", icon: IconHistory },
    { label: "Users", href: "/users", icon: IconUsers },
    { label: "Settings", href: "/settings", icon: IconSettings },
]

const userNavigation = [
    { label: "Dashboard", href: "/dashboard", icon: IconDashboard },
    { label: "Products", href: "/products", icon: IconPackage },
    { label: "Warehouse", href: "/warehouse", icon: IconBuildingWarehouse },
    { label: "Raw Materials", href: "/raw-materials", icon: IconBoxSeam },
    { label: "Orders", href: "/orders", icon: IconShoppingCart },
    { label: "Invoices", href: "/invoices", icon: IconFileInvoice },
    { label: "Settings", href: "/settings", icon: IconSettings },
]

export async function AppSidebar() {
    const user = await getCurrentUser()
    const isAdmin = user?.role === "ADMIN"
    const navigation = isAdmin ? adminNavigation : userNavigation

    return (
        <aside className="hidden w-64 border-r bg-sidebar text-sidebar-foreground md:flex md:flex-col">
            {/* Logo */}
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-3 font-semibold">
                    <Image src="/logo.png" alt="Logo" width={32} height={32} className="h-8 w-8" />
                    <div className="flex flex-col justify-center">
                        <span className="text-lg font-bold leading-none tracking-tight">Theiapollo</span>
                        <span className="text-[10px] text-muted-foreground leading-tight mt-0.5 uppercase tracking-wider">Inventory System</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav id="sidebar-nav" className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => (
                    <ActiveLink
                        key={item.href}
                        item={{
                            label: item.label,
                            href: item.href,
                            icon: <item.icon className="h-4 w-4 shrink-0" />
                        }}
                    />
                ))}
            </nav>

            {/* Role badge at bottom */}
            <div className="px-5 py-4 border-t">
                <span className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                    isAdmin
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                )}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", isAdmin ? "bg-primary" : "bg-muted-foreground/60")} />
                    {isAdmin ? "Administrator" : "Standard User"}
                </span>
            </div>
        </aside>
    )
}
