"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { createPurchaseOrderAction } from "../_actions/purchase-orders"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"
import type { SupplierDTO } from "@/lib/dal/suppliers"

type RawMaterialOption = {
    id: string
    name: string
    sku: string
}

type POLineItem = {
    rawMaterialId: string
    quantity: number
    unitCost: number
}

export function CreatePurchaseOrderDialog({
    suppliers,
    rawMaterials,
}: {
    suppliers: SupplierDTO[]
    rawMaterials: RawMaterialOption[]
}) {
    const [open, setOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [supplierId, setSupplierId] = useState("")
    const [notes, setNotes] = useState("")
    const [items, setItems] = useState<POLineItem[]>([
        { rawMaterialId: "", quantity: 1, unitCost: 0 },
    ])
    const router = useRouter()

    const addItem = () => {
        setItems([...items, { rawMaterialId: "", quantity: 1, unitCost: 0 }])
    }

    const removeItem = (index: number) => {
        if (items.length <= 1) return
        setItems(items.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, field: keyof POLineItem, value: string | number) => {
        const updated = [...items]
        if (field === "rawMaterialId") {
            updated[index] = { ...updated[index], rawMaterialId: value as string }
        } else if (field === "quantity") {
            updated[index] = { ...updated[index], quantity: Number(value) || 0 }
        } else if (field === "unitCost") {
            updated[index] = { ...updated[index], unitCost: Number(value) || 0 }
        }
        setItems(updated)
    }

    const totalAmount = items.reduce(
        (sum, item) => sum + item.quantity * item.unitCost,
        0
    )

    const resetForm = () => {
        setSupplierId("")
        setNotes("")
        setItems([{ rawMaterialId: "", quantity: 1, unitCost: 0 }])
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsPending(true)

        try {
            const result = await createPurchaseOrderAction({
                supplierId,
                notes: notes || undefined,
                items,
            })

            if (result && "error" in result && typeof result.error === "string") {
                toast.error(result.error)
                return
            }

            if (result && "error" in result && typeof result.error === "object") {
                const firstError = Object.values(result.error as Record<string, string[]>)
                    .flat()
                    .find(Boolean)
                toast.error(firstError || "Validation error")
                return
            }

            if (result && "success" in result && result.success) {
                toast.success("Purchase order created successfully")
                resetForm()
                setOpen(false)
                router.refresh()
            }
        } finally {
            setIsPending(false)
        }
    }

    const activeSuppliers = suppliers.filter((s) => s.status === "ACTIVE")

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen)
                if (!isOpen) resetForm()
            }}
        >
            <DialogTrigger asChild>
                <Button>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Create Purchase Order
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Purchase Order</DialogTitle>
                    <DialogDescription>
                        Create a new purchase order for raw materials from a supplier.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Supplier selection */}
                    <div className="space-y-2">
                        <Label>Supplier *</Label>
                        <Select value={supplierId} onValueChange={setSupplierId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a supplier" />
                            </SelectTrigger>
                            <SelectContent>
                                {activeSuppliers.map((supplier) => (
                                    <SelectItem key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="po-notes">Notes</Label>
                        <Input
                            id="po-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Optional notes for this order..."
                        />
                    </div>

                    {/* Line items */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-semibold">Line Items</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addItem}
                            >
                                <IconPlus className="mr-1 h-3 w-3" />
                                Add Item
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-[1fr_80px_100px_36px] gap-2 items-end rounded-lg border p-3"
                                >
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">
                                            Raw Material
                                        </Label>
                                        <Select
                                            value={item.rawMaterialId}
                                            onValueChange={(val) =>
                                                updateItem(index, "rawMaterialId", val)
                                            }
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Select material" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {rawMaterials.map((rm) => (
                                                    <SelectItem key={rm.id} value={rm.id}>
                                                        {rm.name} ({rm.sku})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">
                                            Qty
                                        </Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            className="h-9"
                                            value={item.quantity || ""}
                                            onChange={(e) =>
                                                updateItem(index, "quantity", e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">
                                            Unit Cost
                                        </Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="h-9"
                                            value={item.unitCost || ""}
                                            onChange={(e) =>
                                                updateItem(index, "unitCost", e.target.value)
                                            }
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-muted-foreground hover:text-red-600"
                                        onClick={() => removeItem(index)}
                                        disabled={items.length <= 1}
                                    >
                                        <IconTrash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                        <span className="text-sm font-medium">Estimated Total</span>
                        <span className="text-lg font-bold">
                            ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending || !supplierId || items.some((i) => !i.rawMaterialId)}
                        className="w-full"
                    >
                        {isPending ? "Creating..." : "Create Purchase Order"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
