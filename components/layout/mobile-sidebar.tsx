"use client"

import { useState } from "react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    IconMenu2,
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
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

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

interface MobileSidebarProps {
    role?: string | null
}

export function MobileSidebar({ role }: MobileSidebarProps) {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const isAdmin = role === "ADMIN"
    const sections = isAdmin ? adminSections : userSections

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <IconMenu2 className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 bg-sidebar p-0 text-sidebar-foreground border-r-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3"
                        onClick={() => setOpen(false)}
                    >
                        <Image src="/logo.png" alt="Logo" width={28} height={28} className="h-7 w-7" />
                        <div className="flex flex-col justify-center">
                            <span className="text-sm font-semibold leading-none tracking-tight">Theiapollo</span>
                            <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 mt-0.5">Inventory</span>
                        </div>
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
                    {sections.map((section) => (
                        <div key={section.title}>
                            <p className="mb-1 px-3 text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/40">
                                {section.title}
                            </p>
                            <div className="space-y-0.5">
                                {section.items.map((item) => {
                                    const isActive =
                                        pathname === item.href || pathname.startsWith(`${item.href}/`)
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 rounded-md px-3 py-1.5 text-[13px] font-medium transition-all duration-150",
                                                isActive
                                                    ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary"
                                                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground border-l-2 border-transparent"
                                            )}
                                        >
                                            <item.icon className="h-4 w-4 shrink-0" />
                                            {item.label}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
                {/* Role badge */}
                <div className="px-4 py-3 border-t border-sidebar-border">
                    <span className={cn(
                        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium",
                        isAdmin ? "bg-primary/15 text-primary" : "bg-sidebar-accent text-sidebar-foreground/60"
                    )}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", isAdmin ? "bg-primary" : "bg-sidebar-foreground/30")} />
                        {isAdmin ? "Administrator" : "Standard User"}
                    </span>
                </div>
            </SheetContent>
        </Sheet>
    )
}
