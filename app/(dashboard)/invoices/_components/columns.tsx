"use client"

import { ColumnDef } from "@tanstack/react-table"
import { InvoiceDTO } from "@/lib/dal/invoices"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react"
import Link from "next/link"
import { deleteInvoiceAction } from "../_actions/invoice"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export const columns: ColumnDef<InvoiceDTO>[] = [
    {
        accessorKey: "invoiceNo",
        header: "Invoice #",
        cell: ({ row }) => <span className="font-semibold">{row.getValue("invoiceNo")}</span>
    },
    {
        accessorKey: "orderNo",
        header: "Order #",
    },
    {
        accessorKey: "customer",
        header: "Customer",
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
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const isPaid = !!row.original.paidAt
            return (
                <Badge variant={isPaid ? "default" : "secondary"}>
                    {isPaid ? "PAID" : "UNPAID"}
                </Badge>
            )
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
            const invoice = row.original
            return <ActionMenu invoice={invoice} />
        },
    },
]

function ActionMenu({ invoice }: { invoice: InvoiceDTO }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this invoice?")) return

        startTransition(async () => {
            const result = await deleteInvoiceAction(invoice.id)
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
                    <Link href={`/invoices/${invoice.id}`} className="cursor-pointer">
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
