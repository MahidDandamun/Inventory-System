import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getUserById } from "@/lib/dal/users"
import { UserForm } from "../_components/user-form"
import { notFound } from "next/navigation"

export const metadata = {
    title: "Edit User | Inventory System",
}

export default async function EditUserPage({
    params,
}: {
    params: { id: string }
}) {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const { id } = await params

    const user = await getUserById(id)

    if (!user) {
        notFound()
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
                <p className="text-muted-foreground">
                    Update profile, role, and access credentials.
                </p>
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <UserForm user={{
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isTwoFactorEnabled: user.isTwoFactorEnabled,
                    isOAuth: false,
                    createdAt: user.createdAt
                }} />
            </div>
        </div>
    )
}
