import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getAllUsers } from "@/lib/dal/users"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./_components/columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"

export const metadata = {
    title: "Users | Inventory System",
}

export default async function UsersPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const users = await getAllUsers()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Manage system access and roles.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/users/new">
                        <IconPlus className="mr-2 h-4 w-4" />
                        Add User
                    </Link>
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={users}
                searchKey="email"
                filterColumns={[
                    {
                        id: "role",
                        title: "Role",
                        options: [
                            { label: "Admin", value: "ADMIN" },
                            { label: "User", value: "USER" },
                        ]
                    }
                ]}
            />
        </div>
    )
}
