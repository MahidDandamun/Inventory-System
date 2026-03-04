"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import type { StockMovementDTO } from "@/lib/dal/stock-movements"

function getBadgeVariant(type: string) {
    switch (type) {
        case "IN": return "default" as const
        case "OUT": return "destructive" as const
        case "ADJUST": return "secondary" as const
        default: return "outline" as const
    }
}

export const columns: ColumnDef<StockMovementDTO>[] = [
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return (
                <span className="text-muted-foreground">
                    {date.toLocaleDateString()}{" "}
                    {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
            )
        },
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("type") as string
            return <Badge variant={getBadgeVariant(type)}>{type}</Badge>
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "entity",
        header: "Category",
        cell: ({ row }) => {
            const entity = row.getValue("entity") as string
            return (
                <Badge variant="outline" className="font-mono text-xs">
                    {entity === "PRODUCT" ? "Product" : "Raw Material"}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "entityId",
        header: "Item",
        cell: ({ row }) => {
            return (
                <span className="font-mono text-xs text-muted-foreground">
                    {row.getValue("entityId")}
                </span>
            )
        },
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => {
            return (
                <span className="font-mono font-medium">
                    {row.getValue("quantity")}
                </span>
            )
        },
    },
    {
        accessorKey: "reason",
        header: "Reason",
    },
    {
        accessorKey: "userName",
        header: "User",
        cell: ({ row }) => {
            const name = row.original.userName
            return (
                <span className="text-muted-foreground">
                    {name || "System"}
                </span>
            )
        },
    },
]
