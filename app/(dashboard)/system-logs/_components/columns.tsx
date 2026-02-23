"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { SystemLogDTO } from "@/lib/dal/system-logs"

export const columns: ColumnDef<SystemLogDTO>[] = [
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => format(new Date(row.original.createdAt), "MMM d, yyyy HH:mm"),
    },
    {
        accessorKey: "user.email",
        header: "User",
        cell: ({ row }) => {
            const user = row.original.user
            return user ? (
                <div className="flex flex-col">
                    <span className="font-medium text-sm">{user.name || "Unknown"}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
            ) : (
                <span className="text-muted-foreground italic">System</span>
            )
        },
    },
    {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => {
            const action = row.getValue("action") as string
            let variant: "default" | "destructive" | "outline" | "secondary" = "default"

            if (action === "CREATE") variant = "default"
            else if (action === "UPDATE") variant = "secondary"
            else if (action === "DELETE") variant = "destructive"
            else variant = "outline"

            return <Badge variant={variant}>{action}</Badge>
        },
    },
    {
        accessorKey: "entity",
        header: "Entity",
        cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("entity")}</span>,
    },
    {
        accessorKey: "entityId",
        header: "Entity ID",
        cell: ({ row }) => {
            const id = row.getValue("entityId") as string
            return id ? <span className="font-mono text-xs text-muted-foreground">{id}</span> : "-"
        },
    },
]
