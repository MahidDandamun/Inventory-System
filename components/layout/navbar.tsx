// components/layout/navbar.tsx
// ---
// Top navigation bar — user menu + theme toggle
// ---

import { ThemeSwitcher } from "@/components/layout/theme-switcher"

export function Navbar() {
    return (
        <header className="flex h-14 items-center justify-between border-b bg-background px-6">
            <div />
            <div className="flex items-center gap-4">
                <ThemeSwitcher />
            </div>
        </header>
    )
}
