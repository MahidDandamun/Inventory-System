// components/layout/active-link.tsx
// ---
// Client component for nav links that need usePathname for active detection
// ---

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
// import type { ForwardRefExoticComponent, RefAttributes } from "react"
// import type { IconProps } from "@tabler/icons-react"

interface NavItem {
    label: string
    href: string
    icon: React.ReactNode
}

export function ActiveLink({ item }: { item: NavItem }) {
    const pathname = usePathname()
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
        >
            {item.icon}
            {item.label}
        </Link>
    )
}
