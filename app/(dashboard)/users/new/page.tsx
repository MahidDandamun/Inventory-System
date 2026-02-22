import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { UserForm } from "../_components/user-form"

export const metadata = {
    title: "Add User | Inventory System",
}

export default async function NewUserPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add User</h1>
                <p className="text-muted-foreground">
                    Create a new system user profile.
                </p>
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <UserForm />
            </div>
        </div>
    )
}
