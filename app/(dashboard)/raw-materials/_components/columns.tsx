"use client"

import { ColumnDef } from "@tanstack/react-table"
import { RawMaterialDTO } from "@/lib/dal/raw-materials"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react"
import Link from "next/link"
import { deleteRawMaterialAction } from "../_actions/raw-material"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export const columns: ColumnDef<RawMaterialDTO>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "sku",
        header: "SKU",
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
        accessorKey: "quantity",
        header: "Inventory",
        cell: ({ row }) => {
            const qty = row.getValue("quantity") as number
            const unit = row.original.unit
            const reorder = row.original.reorderAt

            const isLowStock = qty <= reorder

            return (
                <div className="flex items-center gap-2">
                    <span className={isLowStock ? "text-destructive font-medium" : ""}>
                        {qty} {unit}
                    </span>
                    {isLowStock && (
                        <Badge variant="outline" className="text-destructive border-destructive">Low Stock</Badge>
                    )}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const item = row.original
            return <ActionMenu item={item} />
        },
    },
]

function ActionMenu({ item }: { item: RawMaterialDTO }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this raw material?")) return

        startTransition(async () => {
            const result = await deleteRawMaterialAction(item.id)
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
                    <Link href={`/raw-materials/${item.id}`} className="cursor-pointer">
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
