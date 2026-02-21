// app/(dashboard)/layout.tsx
// ---
// Dashboard layout — sidebar + header shell
// All dashboard pages are nested inside this layout
// ---

import { AppSidebar } from "@/components/layout/app-sidebar"
import { Navbar } from "@/components/layout/navbar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <AppSidebar />

            {/* Main content area */}
            <div className="flex flex-1 flex-col">
                <Navbar />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}
