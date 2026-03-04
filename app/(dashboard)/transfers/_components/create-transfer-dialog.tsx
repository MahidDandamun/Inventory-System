"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { createTransferAction } from "../_actions/transfers"
import { ProductDTO } from "@/lib/dal/products"
import { WarehouseDTO } from "@/lib/dal/warehouses"
import { IconPlus, IconTrash, IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"

type TransferRow = {
    productId: string
    quantity: string
}

export function CreateTransferDialog({
    warehouses,
    products
}: {
    warehouses: WarehouseDTO[],
    products: ProductDTO[]
}) {
    const [open, setOpen] = useState(false)
    const [sourceWarehouseId, setSourceWarehouseId] = useState("")
    const [destinationWarehouseId, setDestinationWarehouseId] = useState("")
    const [notes, setNotes] = useState("")
    const [rows, setRows] = useState<TransferRow[]>([
        { productId: "", quantity: "" },
    ])
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function addRow() {
        setRows((prev) => [...prev, { productId: "", quantity: "" }])
    }

    function removeRow(index: number) {
        setRows((prev) => prev.filter((_, i) => i !== index))
    }

    function updateRow(index: number, field: keyof TransferRow, value: string) {
        setRows((prev) =>
            prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
        )
    }

    function resetForm() {
        setSourceWarehouseId("")
        setDestinationWarehouseId("")
        setNotes("")
        setRows([{ productId: "", quantity: "" }])
    }

    const filteredSourceProducts = products.filter(p => p.warehouseId === sourceWarehouseId)

    function handleSubmit() {
        if (!sourceWarehouseId || !destinationWarehouseId) {
            toast.error("Please select source and destination warehouses")
            return
        }

        if (sourceWarehouseId === destinationWarehouseId) {
            toast.error("Source and destination must be different")
            return
        }

        const validItems = rows
            .filter((r) => r.productId && r.quantity)
            .map((r) => ({
                productId: r.productId,
                quantity: parseInt(r.quantity),
            }))

        if (validItems.length === 0) {
            toast.error("Add at least one product with a quantity")
            return
        }

        startTransition(async () => {
            const result = await createTransferAction({
                sourceWarehouseId,
                destinationWarehouseId,
                notes,
                items: validItems
            })

            if (result && "error" in result) {
                toast.error(typeof result.error === "string" ? result.error : "Failed to create transfer")
                return
            }

            toast.success("Transfer request created successfully")
            resetForm()
            setOpen(false)
            router.refresh()
        })
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
            <DialogTrigger asChild>
                <Button>
                    <IconPlus className="mr-2 h-4 w-4" />
                    New Transfer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Request Warehouse Transfer</DialogTitle>
                    <DialogDescription>
                        Move stock from one warehouse to another. Stock will be updated only after the transfer is marked as RECEIVED.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Source Warehouse *</Label>
                            <Select
                                value={sourceWarehouseId}
                                onValueChange={(val) => {
                                    setSourceWarehouseId(val)
                                    setRows([{ productId: "", quantity: "" }]) // Reset items as they are warehouse-specific
                                }}
                                disabled={isPending}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select source" />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.map((w) => (
                                        <SelectItem key={w.id} value={w.id}>
                                            {w.location}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Destination Warehouse *</Label>
                            <Select
                                value={destinationWarehouseId}
                                onValueChange={setDestinationWarehouseId}
                                disabled={isPending}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select destination" />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.map((w) => (
                                        <SelectItem
                                            key={w.id}
                                            value={w.id}
                                            disabled={w.id === sourceWarehouseId}
                                        >
                                            {w.location}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Notes (Optional)</Label>
                        <Textarea
                            placeholder="Reason for transfer, handling instructions, etc."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Products to Transfer *</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addRow}
                                disabled={isPending || !sourceWarehouseId}
                            >
                                <IconPlus className="mr-1 h-3 w-3" />
                                Add Product
                            </Button>
                        </div>

                        {!sourceWarehouseId && (
                            <p className="text-sm text-muted-foreground italic">
                                Select a source warehouse first to see available products.
                            </p>
                        )}

                        <div className="space-y-3">
                            {rows.map((row, index) => (
                                <div
                                    key={index}
                                    className="flex items-end gap-3 border p-3 rounded-lg bg-card/50"
                                >
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-xs text-muted-foreground">
                                            Product
                                        </Label>
                                        <Select
                                            value={row.productId}
                                            onValueChange={(val) =>
                                                updateRow(index, "productId", val)
                                            }
                                            disabled={isPending || !sourceWarehouseId}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select product" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredSourceProducts.map((p) => (
                                                    <SelectItem
                                                        key={p.id}
                                                        value={p.id}
                                                        disabled={rows.some((r, i) => i !== index && r.productId === p.id)}
                                                    >
                                                        {p.name} ({p.sku}) — Avail: {p.quantity}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="w-28 space-y-1">
                                        <Label className="text-xs text-muted-foreground">
                                            Qty
                                        </Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            placeholder="Quantity"
                                            value={row.quantity}
                                            onChange={(e) =>
                                                updateRow(index, "quantity", e.target.value)
                                            }
                                            disabled={isPending}
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeRow(index)}
                                        disabled={isPending || rows.length === 1}
                                        className="shrink-0"
                                    >
                                        <IconTrash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="w-full"
                    >
                        {isPending && (
                            <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isPending
                            ? "Creating..."
                            : `Request Transfer`}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
