"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
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
import { createStockMovementAction } from "../_actions/movements"
import { ProductDTO } from "@/lib/dal/products"
import { RawMaterialDTO } from "@/lib/dal/raw-materials"
import { IconPlus } from "@tabler/icons-react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Recording..." : "Record Movement"}
        </Button>
    )
}

export function CreateMovementDialog({
    products,
    rawMaterials
}: {
    products: ProductDTO[],
    rawMaterials: RawMaterialDTO[]
}) {
    const [open, setOpen] = useState(false)
    const [entityType, setEntityType] = useState<"PRODUCT" | "RAW_MATERIAL">("PRODUCT")

    async function action(formData: FormData) {
        const result = await createStockMovementAction(formData)

        if (result?.error) {
            alert("Error: Please check the form fields")
            return
        }

        if (result && 'success' in result && result.success) {
            setOpen(false)
        } else if (result && 'error' in result && typeof result.error === 'string') {
            alert(`Error: ${result.error}`)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Record Movement
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Record Manual Stock Movement</DialogTitle>
                    <DialogDescription>
                        Manually adjust inventory levels for products or raw materials.
                    </DialogDescription>
                </DialogHeader>

                <form action={action} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="entity">Item Type</Label>
                        <Select
                            name="entity"
                            required
                            value={entityType}
                            onValueChange={(v) => setEntityType(v as "PRODUCT" | "RAW_MATERIAL")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PRODUCT">Product</SelectItem>
                                <SelectItem value="RAW_MATERIAL">Raw Material</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="entityId">Item</Label>
                        <Select name="entityId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an item" />
                            </SelectTrigger>
                            <SelectContent>
                                {entityType === "PRODUCT" && products.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>
                                ))}
                                {entityType === "RAW_MATERIAL" && rawMaterials.map(rm => (
                                    <SelectItem key={rm.id} value={rm.id}>{rm.name} ({rm.sku})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Movement Type</Label>
                            <Select name="type" required defaultValue="IN">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IN">Stock In (+)</SelectItem>
                                    <SelectItem value="OUT">Stock Out (-)</SelectItem>
                                    <SelectItem value="ADJUST">Set Exact Amount (=)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                name="quantity"
                                type="number"
                                min="1"
                                required
                                placeholder="Amount"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Input
                            id="reason"
                            name="reason"
                            type="text"
                            required
                            placeholder="e.g. Audit correction, Damaged goods"
                        />
                    </div>

                    <SubmitButton />
                </form>
            </DialogContent>
        </Dialog>
    )
}
