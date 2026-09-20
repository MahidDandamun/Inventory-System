// components/layout/active-link.tsx
// ---
// Client component for nav links that need usePathname for active detection
// Uses left-border accent indicator for active state
// ---

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface NavItem {
    label: string
    href: string
    icon: React.ReactNode
}

export function ActiveLink({ item, isCollapsed = false }: { item: NavItem, isCollapsed?: boolean }) {
    const pathname = usePathname()
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

    const linkContent = (
        <Link
            href={item.href}
            className={cn(
                "flex items-center rounded-md py-2 font-medium transition-all duration-150",
                isCollapsed ? "justify-center px-0 mx-auto w-10" : "gap-3 px-3 w-full",
                isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground border-l-2 border-transparent",
                !isCollapsed && "text-sm"
            )}
        >
            {item.icon}
            {!isCollapsed && <span>{item.label}</span>}
        </Link>
    )

    if (isCollapsed) {
        return (
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    {linkContent}
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                    {item.label}
                </TooltipContent>
            </Tooltip>
        )
    }

    return linkContent
}
