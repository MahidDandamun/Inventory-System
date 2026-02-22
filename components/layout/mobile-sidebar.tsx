"use client"

import { useState } from "react"
import Link from "next/link"
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
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

const adminNavigation = [
    { label: "Dashboard", href: "/dashboard", icon: IconDashboard },
    { label: "Products", href: "/products", icon: IconPackage },
    { label: "Warehouse", href: "/warehouse", icon: IconBuildingWarehouse },
    { label: "Raw Materials", href: "/raw-materials", icon: IconBoxSeam },
    { label: "Orders", href: "/orders", icon: IconShoppingCart },
    { label: "Invoices", href: "/invoices", icon: IconFileInvoice },
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

interface MobileSidebarProps {
    role?: string | null
}

export function MobileSidebar({ role }: MobileSidebarProps) {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const isAdmin = role === "ADMIN"
    const navigation = isAdmin ? adminNavigation : userNavigation

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <IconMenu2 className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar p-0 text-sidebar-foreground border-r-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex h-14 items-center border-b px-6">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 font-semibold"
                        onClick={() => setOpen(false)}
                    >
                        <Image src="/logo.png" alt="Logo" width={32} height={32} className="h-8 w-8" />
                        <div className="flex flex-col justify-center">
                            <span className="text-lg font-bold leading-none tracking-tight">Theiapollo</span>
                            <span className="text-[10px] text-muted-foreground leading-tight mt-0.5 uppercase tracking-wider">Inventory System</span>
                        </div>
                    </Link>
                </div>
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navigation.map((item) => {
                        const isActive =
                            pathname === item.href || pathname.startsWith(`${item.href}/`)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-md",
                                    isActive
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
                {/* Role badge */}
                <div className="px-5 py-4 border-t">
                    <span className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                        isAdmin ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", isAdmin ? "bg-primary" : "bg-muted-foreground/60")} />
                        {isAdmin ? "Administrator" : "Standard User"}
                    </span>
                </div>
            </SheetContent>
        </Sheet>
    )
}
