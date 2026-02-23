// components/layout/navbar.tsx
// ---
// Top navigation bar — reads session role and passes to MobileSidebar
// ---

import { getCurrentUser } from "@/lib/auth"
import { getNotificationsByUserId } from "@/lib/dal/notifications"
import { ThemeSwitcher } from "@/components/layout/theme-switcher"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { UserButton } from "@/components/layout/user-button"
import { NotificationsBell } from "@/components/layout/notifications-bell"

export async function Navbar() {
    const user = await getCurrentUser()
    const notifications = user?.id ? await getNotificationsByUserId(user.id) : []

    return (
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
            <div className="flex items-center">
                <MobileSidebar role={user?.role} />
            </div>
            <div className="flex items-center gap-2">
                <NotificationsBell initialNotifications={notifications} />
                <ThemeSwitcher />
                <UserButton />
            </div>
        </header>
    )
}
