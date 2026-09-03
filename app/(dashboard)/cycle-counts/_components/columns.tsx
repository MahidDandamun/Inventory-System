"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { format } from "date-fns"
import { CycleCountDTO } from "@/lib/dal/cycle-counts"

export const columns: ColumnDef<CycleCountDTO>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const badgeVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
                SCHEDULED: "outline",
                IN_PROGRESS: "default",
                PENDING_APPROVAL: "secondary",
                COMPLETED: "default",
                CANCELLED: "destructive",
            }
            return (
                <Badge variant={badgeVariants[status] || "outline"}>
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "scheduledDate",
        header: "Scheduled For",
        cell: ({ row }) => format(new Date(row.getValue("scheduledDate") as Date | string | number), "PPP")
    },
    {
        accessorKey: "createdBy.name",
        header: "Created By",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const id = row.original.id
            return (
                <Button variant="outline" size="sm" asChild>
                    <Link href={`${ROUTES.CYCLE_COUNTS}/${id}`}>View / Count</Link>
                </Button>
            )
        }
    }
]
