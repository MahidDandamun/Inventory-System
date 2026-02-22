// components/layout/navbar.tsx
// ---
// Top navigation bar — reads session role and passes to MobileSidebar
// ---

import { getCurrentUser } from "@/lib/auth"
import { ThemeSwitcher } from "@/components/layout/theme-switcher"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { UserButton } from "@/components/layout/user-button"

export async function Navbar() {
    const user = await getCurrentUser()

    return (
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
            <div className="flex items-center">
                <MobileSidebar role={user?.role} />
            </div>
            <div className="flex items-center gap-2">
                <ThemeSwitcher />
                <UserButton />
            </div>
        </header>
    )
}
