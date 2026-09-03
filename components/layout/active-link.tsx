// components/layout/active-link.tsx
// ---
// Client component for nav links that need usePathname for active detection
// Uses left-border accent indicator for active state
// ---

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

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
                "flex items-center gap-3 rounded-md px-3 py-1.5 text-[13px] font-medium transition-all duration-150",
                isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground border-l-2 border-transparent"
            )}
        >
            {item.icon}
            {item.label}
        </Link>
    )
}
