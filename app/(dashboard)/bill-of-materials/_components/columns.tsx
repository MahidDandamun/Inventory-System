"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BillOfMaterialDTO } from "@/lib/dal/bill-of-materials"
import { ProductBOMGroup } from "./bom-list"
import { Button } from "@/components/ui/button"
import { IconLayersLinked, IconTrash, IconLoader2, IconDots } from "@tabler/icons-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useState, useTransition } from "react"
import { deleteBillOfMaterialAction, updateBillOfMaterialAction } from "../_actions/bom"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export const columns: ColumnDef<ProductBOMGroup>[] = [
    {
        accessorKey: "productName",
        header: "Product",
        cell: ({ row }) => <div className="font-medium">{row.getValue("productName")}</div>,
    },
    {
        id: "materialCount",
        header: "Raw Materials",
        cell: ({ row }) => {
            const materials = row.original.materials
            return (
                <div className="text-muted-foreground">
                    {materials.length} material{materials.length !== 1 && "s"}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return <ActionMenu group={row.original} />
        },
    },
]

function ActionMenu({ group }: { group: ProductBOMGroup }) {
    const [open, setOpen] = useState(false)
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                    <DialogTrigger asChild>
                        <DropdownMenuItem className="cursor-pointer">
                            <IconLayersLinked className="mr-2 h-4 w-4" />
                            Manage Materials
                        </DropdownMenuItem>
                    </DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{group.productName} — Bill of Materials</DialogTitle>
                    <DialogDescription>
                        Manage raw materials and quantities required to produce this product.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {group.materials.map((material) => (
                        <MaterialRow key={material.id} material={material} />
                    ))}
                    {group.materials.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4 border rounded bg-muted/20">
                            No materials found.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

function MaterialRow({ material }: { material: BillOfMaterialDTO }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [quantity, setQuantity] = useState(material.quantity.toString())

    const handleUpdate = () => {
        const num = parseFloat(quantity)
        if (isNaN(num) || num <= 0) {
            toast.error("Please enter a valid quantity greater than 0")
            return
        }
        
        startTransition(async () => {
            const result = await updateBillOfMaterialAction(material.id, num)
            if (result && "error" in result) {
                toast.error(typeof result.error === "string" ? result.error : "Failed to update quantity")
            } else {
                toast.success("Quantity updated")
                router.refresh()
            }
        })
    }

    const handleDelete = () => {
        if (!confirm("Remove this raw material from the BOM?")) return
        startTransition(async () => {
            const result = await deleteBillOfMaterialAction(material.id)
            if (result && "error" in result) {
                toast.error(typeof result.error === "string" ? result.error : "Failed to remove material")
            } else {
                toast.success("Material removed")
                router.refresh()
            }
        })
    }

    const isChanged = parseFloat(quantity) !== material.quantity

    return (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-card shadow-sm gap-4">
            <div className="flex-1 font-medium text-sm">
                {material.rawMaterialName}
            </div>
            <div className="flex items-center gap-2">
                <Input 
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    disabled={isPending}
                    className="w-24 h-8 text-sm"
                />
                {isChanged && (
                    <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={handleUpdate}
                        disabled={isPending}
                        className="h-8 px-2"
                    >
                        {isPending ? <IconLoader2 className="h-4 w-4 animate-spin" /> : "Save"}
                    </Button>
                )}
                <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handleDelete}
                    disabled={isPending}
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                >
                    <IconTrash className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
