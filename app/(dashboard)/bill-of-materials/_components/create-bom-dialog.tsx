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
import { createBillOfMaterialsBatchAction } from "../_actions/bom"
import { ProductDTO } from "@/lib/dal/products"
import { RawMaterialDTO } from "@/lib/dal/raw-materials"
import { IconPlus, IconTrash, IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"

type MaterialRow = {
    rawMaterialId: string
    quantity: string
}

export function CreateBomDialog({
    products,
    rawMaterials
}: {
    products: ProductDTO[],
    rawMaterials: RawMaterialDTO[]
}) {
    const [open, setOpen] = useState(false)
    const [productId, setProductId] = useState("")
    const [rows, setRows] = useState<MaterialRow[]>([
        { rawMaterialId: "", quantity: "" },
    ])
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function addRow() {
        setRows((prev) => [...prev, { rawMaterialId: "", quantity: "" }])
    }

    function removeRow(index: number) {
        setRows((prev) => prev.filter((_, i) => i !== index))
    }

    function updateRow(index: number, field: keyof MaterialRow, value: string) {
        setRows((prev) =>
            prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
        )
    }

    function resetForm() {
        setProductId("")
        setRows([{ rawMaterialId: "", quantity: "" }])
    }

    function handleSubmit() {
        if (!productId) {
            toast.error("Please select a product")
            return
        }

        const validItems = rows
            .filter((r) => r.rawMaterialId && r.quantity)
            .map((r) => ({
                rawMaterialId: r.rawMaterialId,
                quantity: parseFloat(r.quantity),
            }))

        if (validItems.length === 0) {
            toast.error("Add at least one material with a quantity")
            return
        }

        // Check for duplicate materials
        const materialIds = validItems.map((i) => i.rawMaterialId)
        if (new Set(materialIds).size !== materialIds.length) {
            toast.error("Remove duplicate material entries")
            return
        }

        startTransition(async () => {
            const result = await createBillOfMaterialsBatchAction(productId, validItems)

            if (result && "error" in result && typeof result.error === "string") {
                toast.error(result.error)
                return
            }

            if (result && "success" in result && result.success) {
                toast.success(`Added ${validItems.length} material(s) to BOM`)
                resetForm()
                setOpen(false)
                router.refresh()
            }
        })
    }

    // Determine which materials are already selected to help prevent duplicates in the UI
    const selectedMaterialIds = new Set(rows.map((r) => r.rawMaterialId).filter(Boolean))

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
            <DialogTrigger asChild>
                <Button>
                    <IconPlus className="mr-2 h-4 w-4" />
                    New Entry
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create Bill of Material</DialogTitle>
                    <DialogDescription>
                        Select a product, then add one or more raw materials that
                        make up its composition.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Product selector */}
                    <div className="space-y-2">
                        <Label>Product *</Label>
                        <Select
                            value={productId}
                            onValueChange={setProductId}
                            disabled={isPending}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Material rows */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Raw Materials *</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addRow}
                                disabled={isPending}
                            >
                                <IconPlus className="mr-1 h-3 w-3" />
                                Add Material
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {rows.map((row, index) => (
                                <div
                                    key={index}
                                    className="flex items-end gap-3 border p-3 rounded-lg bg-card/50"
                                >
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-xs text-muted-foreground">
                                            Material
                                        </Label>
                                        <Select
                                            value={row.rawMaterialId}
                                            onValueChange={(val) =>
                                                updateRow(index, "rawMaterialId", val)
                                            }
                                            disabled={isPending}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select material" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {rawMaterials.map((rm) => (
                                                    <SelectItem
                                                        key={rm.id}
                                                        value={rm.id}
                                                        disabled={
                                                            selectedMaterialIds.has(rm.id) &&
                                                            rm.id !== row.rawMaterialId
                                                        }
                                                    >
                                                        {rm.name} ({rm.unit})
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
                                            step="0.01"
                                            min="0.01"
                                            placeholder="Amount"
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
                            : `Create ${rows.length} BOM ${rows.length === 1 ? "Entry" : "Entries"}`}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
