"use client"

import { ColumnDef } from "@tanstack/react-table"
import { UserDTO } from "@/lib/dal/users"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react"
import Link from "next/link"
import { deleteUserAction } from "../_actions/user"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export const columns: ColumnDef<UserDTO>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.getValue("role") as string
            return (
                <Badge variant={role === "ADMIN" ? "default" : "secondary"}>
                    {role}
                </Badge>
            )
        },
    },
    {
        accessorKey: "isTwoFactorEnabled",
        header: "2FA",
        cell: ({ row }) => {
            const enabled = row.getValue("isTwoFactorEnabled") as boolean
            return enabled ? (
                <Badge variant="outline" className="border-green-500 text-green-600">Enabled</Badge>
            ) : (
                <span className="text-muted-foreground text-sm">Disabled</span>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return <div className="text-muted-foreground">{date.toLocaleDateString()}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original
            return <ActionMenu user={user} />
        },
    },
]

function ActionMenu({ user }: { user: UserDTO }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this user?")) return

        startTransition(async () => {
            const result = await deleteUserAction(user.id)
            if (result.error) {
                alert(result.error)
            } else {
                router.refresh()
            }
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <IconDots className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/users/${user.id}`} className="cursor-pointer">
                        <IconEdit className="mr-2 h-4 w-4" />
                        Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} disabled={isPending} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <IconTrash className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
