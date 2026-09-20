"use client"

import { useState } from "react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"
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
    IconStack3,
    IconArrowsRightLeft,
    IconArrowsExchange,
    IconUserCircle,
    IconTruckDelivery,
    IconClipboardList,
    IconClipboardCheck,
    IconShieldCheck,
    IconChartBar,
    IconLayoutSidebarLeftCollapse,
    IconLayoutSidebarLeftExpand,
} from "@tabler/icons-react"
import { ActiveLink } from "./active-link"
import Image from "next/image"

// ── Navigation structure with sections ──
type NavItem = {
    label: string
    href: string
    icon: React.ComponentType<{ className?: string }>
}

type NavSection = {
    title: string
    items: NavItem[]
}

const adminSections: NavSection[] = [
    {
        title: "Overview",
        items: [
            { label: "Dashboard", href: "/dashboard", icon: IconDashboard },
            { label: "Reports", href: ROUTES.REPORTS, icon: IconChartBar },
        ],
    },
    {
        title: "Inventory",
        items: [
            { label: "Products", href: "/products", icon: IconPackage },
            { label: "Warehouses", href: ROUTES.WAREHOUSES, icon: IconBuildingWarehouse },
            { label: "Raw Materials", href: "/raw-materials", icon: IconBoxSeam },
            { label: "Bill of Materials", href: ROUTES.BILL_OF_MATERIALS, icon: IconStack3 },
            { label: "Stock Movements", href: ROUTES.STOCK_MOVEMENTS, icon: IconArrowsRightLeft },
            { label: "Cycle Counts", href: ROUTES.CYCLE_COUNTS, icon: IconClipboardCheck },
        ],
    },
    {
        title: "Procurement",
        items: [
            { label: "Suppliers", href: ROUTES.SUPPLIERS, icon: IconTruckDelivery },
            { label: "Purchase Orders", href: ROUTES.PURCHASE_ORDERS, icon: IconClipboardList },
        ],
    },
    {
        title: "Sales",
        items: [
            { label: "Customers", href: ROUTES.CUSTOMERS, icon: IconUserCircle },
            { label: "Orders", href: "/orders", icon: IconShoppingCart },
            { label: "Invoices", href: "/invoices", icon: IconFileInvoice },
            { label: "Transfers", href: ROUTES.TRANSFERS, icon: IconArrowsExchange },
        ],
    },
    {
        title: "Administration",
        items: [
            { label: "Users", href: "/users", icon: IconUsers },
            { label: "Approvals", href: ROUTES.APPROVALS, icon: IconShieldCheck },
            { label: "System Logs", href: "/system-logs", icon: IconHistory },
            { label: "Settings", href: "/settings", icon: IconSettings },
        ],
    },
]

const userSections: NavSection[] = [
    {
        title: "Overview",
        items: [
            { label: "Dashboard", href: "/dashboard", icon: IconDashboard },
            { label: "Reports", href: ROUTES.REPORTS, icon: IconChartBar },
        ],
    },
    {
        title: "Inventory",
        items: [
            { label: "Products", href: "/products", icon: IconPackage },
            { label: "Warehouses", href: ROUTES.WAREHOUSES, icon: IconBuildingWarehouse },
            { label: "Raw Materials", href: "/raw-materials", icon: IconBoxSeam },
            { label: "Bill of Materials", href: ROUTES.BILL_OF_MATERIALS, icon: IconStack3 },
            { label: "Stock Movements", href: ROUTES.STOCK_MOVEMENTS, icon: IconArrowsRightLeft },
            { label: "Cycle Counts", href: ROUTES.CYCLE_COUNTS, icon: IconClipboardCheck },
        ],
    },
    {
        title: "Procurement",
        items: [
            { label: "Suppliers", href: ROUTES.SUPPLIERS, icon: IconTruckDelivery },
            { label: "Purchase Orders", href: ROUTES.PURCHASE_ORDERS, icon: IconClipboardList },
        ],
    },
    {
        title: "Sales",
        items: [
            { label: "Customers", href: ROUTES.CUSTOMERS, icon: IconUserCircle },
            { label: "Orders", href: "/orders", icon: IconShoppingCart },
            { label: "Invoices", href: "/invoices", icon: IconFileInvoice },
            { label: "Transfers", href: ROUTES.TRANSFERS, icon: IconArrowsExchange },
        ],
    },
    {
        title: "Settings",
        items: [
            { label: "Settings", href: "/settings", icon: IconSettings },
        ],
    },
]

export function AppSidebar({ isAdmin }: { isAdmin: boolean }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const sections = isAdmin ? adminSections : userSections

    return (
        <aside className={cn(
            "sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col transition-all duration-300 ease-in-out",
            isCollapsed ? "w-[72px]" : "w-64"
        )}>
            {/* Logo */}
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border px-4 gap-2">
                <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden min-w-0">
                    <Image src="/logo.png" alt="Logo" width={28} height={28} className="h-7 w-7 shrink-0 brightness-0 invert" />
                    {!isCollapsed && (
                        <div className="flex flex-col justify-center min-w-0 pr-2">
                            <span className="text-sm font-semibold leading-none tracking-tight text-sidebar-foreground truncate">Theiapollo</span>
                            <span className="text-xs uppercase tracking-widest text-sidebar-foreground/40 mt-0.5 truncate">Inventory</span>
                        </div>
                    )}
                </Link>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="shrink-0 flex items-center justify-center h-8 w-8 rounded-md text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                >
                    {isCollapsed ? <IconLayoutSidebarLeftExpand className="h-5 w-5" /> : <IconLayoutSidebarLeftCollapse className="h-5 w-5" />}
                </button>
            </div>

            {/* Navigation */}
            <nav id="sidebar-nav" className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
                {sections.map((section) => (
                    <div key={section.title}>
                        {!isCollapsed && (
                            <p className="mb-1 px-3 text-xs font-medium uppercase tracking-widest text-sidebar-foreground/40">
                                {section.title}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {section.items.map((item) => (
                                <ActiveLink
                                    key={item.href}
                                    item={{
                                        label: item.label,
                                        href: item.href,
                                        icon: <item.icon className="h-4 w-4 shrink-0" />,
                                    }}
                                    isCollapsed={isCollapsed}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer containing role and copyright */}
            <div className="flex flex-col border-t border-sidebar-border p-3 gap-3">
                <div className={cn("flex", isCollapsed ? "justify-center" : "justify-start")}>
                    <span className={cn(
                        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap",
                        isAdmin
                            ? "bg-primary/15 text-primary"
                            : "bg-sidebar-accent text-sidebar-foreground/60"
                    )}>
                        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", isAdmin ? "bg-primary" : "bg-sidebar-foreground/30")} />
                        {!isCollapsed && (isAdmin ? "Administrator" : "Standard User")}
                    </span>
                </div>
                {!isCollapsed && (
                    <p className="text-center text-xs text-sidebar-foreground/40">
                        © {new Date().getFullYear()} Theiapollo Inventory System
                    </p>
                )}
            </div>
        </aside>
    )
}
