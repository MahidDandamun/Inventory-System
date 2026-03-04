"use client"

import { ColumnDef } from "@tanstack/react-table"
import { PurchaseOrderListDTO } from "@/lib/dal/purchase-orders"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { IconDots, IconTrash, IconArrowRight } from "@tabler/icons-react"
import {
    deletePurchaseOrderAction,
    updatePurchaseOrderStatusAction,
} from "../_actions/purchase-orders"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getAllowedPOStatuses, type POStatus } from "@/lib/po-status"

const statusVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    DRAFT: "secondary",
    SENT: "default",
    PARTIALLY_RECEIVED: "outline",
    RECEIVED: "default",
    CLOSED: "secondary",
    CANCELLED: "destructive",
}

const statusLabelMap: Record<string, string> = {
    DRAFT: "Draft",
    SENT: "Sent",
    PARTIALLY_RECEIVED: "Partial",
    RECEIVED: "Received",
    CLOSED: "Closed",
    CANCELLED: "Cancelled",
}

export const columns: ColumnDef<PurchaseOrderListDTO>[] = [
    {
        accessorKey: "poNumber",
        header: "PO Number",
        cell: ({ row }) => (
            <span className="font-mono font-semibold text-primary">
                {row.getValue("poNumber")}
            </span>
        ),
    },
    {
        accessorKey: "supplierName",
        header: "Supplier",
    },
    {
        accessorKey: "itemCount",
        header: "Items",
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.getValue("itemCount")} item(s)
            </span>
        ),
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => {
            const total = row.getValue("total") as number
            return (
                <span className="font-medium">
                    ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={statusVariantMap[status] || "secondary"}>
                    {statusLabelMap[status] || status}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return (
                <div className="text-muted-foreground">
                    {date.toLocaleDateString()}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const po = row.original
            return <ActionMenu po={po} />
        },
    },
]

function ActionMenu({ po }: { po: PurchaseOrderListDTO }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const allowedStatuses = getAllowedPOStatuses(po.status).filter(
        (s) => s !== po.status
    )

    const handleStatusChange = (newStatus: POStatus) => {
        startTransition(async () => {
            const result = await updatePurchaseOrderStatusAction(po.id, newStatus)
            if (result && "error" in result) {
                toast.error(
                    typeof result.error === "string"
                        ? result.error
                        : "Failed to update status"
                )
            } else {
                toast.success(`PO status updated to ${statusLabelMap[newStatus]}`)
                router.refresh()
            }
        })
    }

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deletePurchaseOrderAction(po.id)
            if (result && "error" in result) {
                toast.error(
                    typeof result.error === "string"
                        ? result.error
                        : "Failed to delete PO"
                )
            } else {
                toast.success("Purchase order deleted successfully")
                setShowDeleteDialog(false)
                router.refresh()
            }
        })
    }

    return (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
                    {allowedStatuses.length > 0 && (
                        <>
                            {allowedStatuses.map((status) => (
                                <DropdownMenuItem
                                    key={status}
                                    className="cursor-pointer"
                                    onClick={() => handleStatusChange(status)}
                                    disabled={isPending}
                                >
                                    <IconArrowRight className="mr-2 h-4 w-4" />
                                    Move to {statusLabelMap[status]}
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                        </>
                    )}
                    {po.status === "DRAFT" && (
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                                <IconTrash className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Purchase Order?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        PO &quot;{po.poNumber}&quot; and all its line items.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete()
                        }}
                        disabled={isPending}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {isPending ? "Deleting..." : "Delete PO"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
