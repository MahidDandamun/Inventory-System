"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StockMovementDTO } from "@/lib/dal/stock-movements"
import { ProductDTO } from "@/lib/dal/products"
import { RawMaterialDTO } from "@/lib/dal/raw-materials"

function getBadgeVariant(type: string) {
    switch (type) {
        case "IN": return "default"
        case "OUT": return "destructive"
        case "ADJUST": return "secondary"
        default: return "outline"
    }
}

export function MovementList({
    items,
    products,
    rawMaterials
}: {
    items: StockMovementDTO[],
    products: ProductDTO[],
    rawMaterials: RawMaterialDTO[]
}) {
    if (items.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg bg-card text-muted-foreground mt-4">
                No recent stock movements found.
            </div>
        )
    }

    // Lookup caches to map IDs to Names quickly
    const productMap = new Map(products.map(p => [p.id, p.name]))
    const materialMap = new Map(rawMaterials.map(rm => [rm.id, rm.name]))

    function getItemName(entity: string, entityId: string) {
        if (entity === "PRODUCT") return productMap.get(entityId) || "Unknown Product"
        if (entity === "RAW_MATERIAL") return materialMap.get(entityId) || "Unknown Material"
        return "Unknown Item"
    }

    return (
        <div className="mt-4 rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>User</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">
                                {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </TableCell>
                            <TableCell>
                                <Badge variant={getBadgeVariant(item.type)}>{item.type}</Badge>
                            </TableCell>
                            <TableCell>
                                <span className="text-xs text-muted-foreground mr-2">{item.entity === "PRODUCT" ? "P" : "RM"}</span>
                                {getItemName(item.entity, item.entityId)}
                            </TableCell>
                            <TableCell className="font-mono">{item.quantity}</TableCell>
                            <TableCell>{item.reason}</TableCell>
                            <TableCell className="text-muted-foreground">
                                {item.userName || "System"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
