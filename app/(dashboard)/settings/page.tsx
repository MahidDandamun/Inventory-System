import { getCurrentUser } from "@/lib/auth"
import { SettingsForm } from "./_components/settings-form"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Settings | Inventory System",
}

export default async function SettingsPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <SettingsForm user={{
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isTwoFactorEnabled: user.isTwoFactorEnabled
                }} />
            </div>
        </div>
    )
}

