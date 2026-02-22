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
            <div className="flex w-full flex-1 flex-col sm:w-auto">
                <Navbar />
                <main className="flex-1 p-4 md:p-6">{children}</main>
                <footer className="border-t px-4 md:px-6 py-3 text-center text-xs text-muted-foreground">
                    Built by{" "}
                    <span className="font-semibold text-foreground">Mahid Dandamun</span>
                    {" · "}Theiapollo Inventory System{" · "}© {new Date().getFullYear()}
                </footer>
            </div>
        </div>
    )
}
