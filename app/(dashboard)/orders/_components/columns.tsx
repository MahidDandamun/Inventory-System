"use client"

import { ColumnDef } from "@tanstack/react-table"
import { OrderDTO } from "@/lib/dal/orders"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconDots, IconEye, IconTrash } from "@tabler/icons-react"
import Link from "next/link"
import { deleteOrderAction } from "../_actions/order"
import { useTransition } from "react"
import { useRouter } from "next/navigation"


export const columns: ColumnDef<OrderDTO>[] = [
    {
        accessorKey: "orderNo",
        header: "Order #",
        cell: ({ row }) => <span className="font-semibold">{row.getValue("orderNo")}</span>
    },
    {
        accessorKey: "customer",
        header: "Customer",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return <StatusBadge status={status} />
        },
    },
    {
        accessorKey: "itemCount",
        header: "Items",
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("total"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)
            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return <div className="text-muted-foreground">{date.toLocaleDateString()}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const order = row.original
            return <ActionMenu order={order} />
        },
    },
]

function ActionMenu({ order }: { order: OrderDTO }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this order?")) return

        startTransition(async () => {
            const result = await deleteOrderAction(order.id)
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
                    <Link href={`/orders/${order.id}`} className="cursor-pointer">
                        <IconEye className="mr-2 h-4 w-4" />
                        View / Edit
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
