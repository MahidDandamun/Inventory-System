"use client"

import { ColumnDef } from "@tanstack/react-table"
import { SupplierDTO } from "@/lib/dal/suppliers"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
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
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react"
import { deleteSupplierAction } from "../_actions/suppliers"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { EditSupplierDialog } from "./edit-supplier-dialog"

export const columns: ColumnDef<SupplierDTO>[] = [
    {
        accessorKey: "name",
        header: "Supplier Name",
        cell: ({ row }) => (
            <span className="font-semibold text-primary">{row.getValue("name")}</span>
        ),
    },
    {
        accessorKey: "contactEmail",
        header: "Email",
        cell: ({ row }) => {
            const email = row.getValue("contactEmail") as string | null
            return <span className="text-muted-foreground">{email || "—"}</span>
        },
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => {
            const phone = row.getValue("phone") as string | null
            return <span className="text-muted-foreground">{phone || "—"}</span>
        },
    },
    {
        accessorKey: "terms",
        header: "Terms",
        cell: ({ row }) => {
            const terms = row.getValue("terms") as string | null
            return <span className="text-muted-foreground">{terms || "—"}</span>
        },
    },
    {
        accessorKey: "leadTimeDays",
        header: "Lead Time",
        cell: ({ row }) => {
            const days = row.getValue("leadTimeDays") as number | null
            return (
                <span className="text-muted-foreground">
                    {days !== null ? `${days} days` : "—"}
                </span>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return <StatusBadge status={status} />
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const supplier = row.original
            return <ActionMenu supplier={supplier} />
        },
    },
]

function ActionMenu({ supplier }: { supplier: SupplierDTO }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteSupplierAction(supplier.id)
            if (result && "error" in result) {
                toast.error(
                    typeof result.error === "string"
                        ? result.error
                        : "Failed to delete supplier"
                )
            } else {
                toast.success("Supplier deleted successfully")
                setShowDeleteDialog(false)
                router.refresh()
            }
        })
    }

    return (
        <>
            <EditSupplierDialog
                supplier={supplier}
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
            />
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
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setShowEditDialog(true)}
                        >
                            <IconPencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                                <IconTrash className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete
                            supplier &quot;{supplier.name}&quot; and remove them from our
                            servers. Purchase orders linked to this supplier will also be
                            affected.
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
                            {isPending ? "Deleting..." : "Delete Supplier"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
