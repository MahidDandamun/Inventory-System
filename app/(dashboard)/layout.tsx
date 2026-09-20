// app/(dashboard)/layout.tsx
// ---
// Dashboard layout — sidebar + header shell
// All dashboard pages are nested inside this layout
// ---

import { AppSidebar } from "@/components/layout/app-sidebar"
import { Navbar } from "@/components/layout/navbar"
import { getCurrentUser } from "@/lib/auth"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()
    const isAdmin = user?.role === "ADMIN"

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <AppSidebar isAdmin={isAdmin} />

            {/* Main content area */}
            <div className="flex w-full flex-1 flex-col sm:w-auto overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6 lg:px-8 lg:py-4">
                    {children}
                </main>
            </div>
        </div>
    )
}
