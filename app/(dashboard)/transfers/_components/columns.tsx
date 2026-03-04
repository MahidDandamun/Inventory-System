"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TransferDTO } from "@/lib/dal/transfers"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CellAction } from "@/app/(dashboard)/transfers/_components/cell-action"

export const columns: ColumnDef<TransferDTO>[] = [
    {
        accessorKey: "transferNumber",
        header: "Transfer #",
    },
    {
        accessorKey: "sourceWarehouseName",
        header: "Source",
    },
    {
        accessorKey: "destinationWarehouseName",
        header: "Destination",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
            const colorMap: Record<string, string> = {
                REQUESTED: "bg-blue-500",
                APPROVED: "bg-yellow-500",
                IN_TRANSIT: "bg-purple-500",
                RECEIVED: "bg-green-500",
                CANCELLED: "bg-red-500",
            }

            return (
                <Badge className={colorMap[status] || "bg-gray-500"}>
                    {status}
                </Badge>
            )
        },
    },
    {
        header: "Items",
        cell: ({ row }) => row.original.items.length,
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => format(row.original.createdAt, "MMM d, yyyy"),
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
]
