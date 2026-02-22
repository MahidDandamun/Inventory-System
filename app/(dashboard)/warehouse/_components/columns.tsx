"use client"

import { ColumnDef } from "@tanstack/react-table"
import { WarehouseDTO } from "@/lib/dal/warehouses"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react"
import Link from "next/link"
import { deleteWarehouseAction } from "../_actions/warehouse"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export const columns: ColumnDef<WarehouseDTO>[] = [
    {
        accessorKey: "location",
        header: "Location",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "productCount",
        header: "Products",
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return <div className="text-muted-foreground">{date.toLocaleDateString()}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const warehouse = row.original

            return <ActionMenu warehouse={warehouse} />
        },
    },
]

function ActionMenu({ warehouse }: { warehouse: WarehouseDTO }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this warehouse?")) return

        startTransition(async () => {
            const result = await deleteWarehouseAction(warehouse.id)
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
                    <Link href={`/warehouse/${warehouse.id}`} className="cursor-pointer">
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
