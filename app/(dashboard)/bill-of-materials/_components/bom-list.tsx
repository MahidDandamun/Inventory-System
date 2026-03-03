"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { IconTrash } from "@tabler/icons-react"
import { deleteBillOfMaterialAction } from "../_actions/bom"
import { useState } from "react"
import { BillOfMaterialDTO } from "@/lib/dal/bill-of-materials"
import { useRouter } from "next/navigation"

export function BomList({ items }: { items: BillOfMaterialDTO[] }) {
    const router = useRouter()
    const [deleting, setDeleting] = useState<string | null>(null)

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this BOM entry?")) return

        setDeleting(id)
        const result = await deleteBillOfMaterialAction(id)
        setDeleting(null)

        if (result && 'error' in result) {
            alert(`Error: ${result.error || "Failed to delete entry"}`)
        } else {
            router.refresh()
        }
    }

    if (items.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg bg-card text-muted-foreground mt-4">
                No Bills of Materials configured. Create one to get started.
            </div>
        )
    }

    return (
        <div className="mt-4 rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Raw Material</TableHead>
                        <TableHead>Quantity Needed</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.productName}</TableCell>
                            <TableCell>{item.rawMaterialName}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(item.id)}
                                    disabled={deleting === item.id}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <IconTrash className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
