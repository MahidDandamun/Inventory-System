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
import { createBillOfMaterialAction } from "../_actions/bom"
import { ProductDTO } from "@/lib/dal/products"
import { RawMaterialDTO } from "@/lib/dal/raw-materials"
import { IconPlus } from "@tabler/icons-react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creating..." : "Create BOM Entry"}
        </Button>
    )
}

export function CreateBomDialog({
    products,
    rawMaterials
}: {
    products: ProductDTO[],
    rawMaterials: RawMaterialDTO[]
}) {
    const [open, setOpen] = useState(false)

    async function action(formData: FormData) {
        const result = await createBillOfMaterialAction(formData)

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
                    New Entry
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Bill of Material Entry</DialogTitle>
                    <DialogDescription>
                        Link a raw material to a product to define its composition.
                    </DialogDescription>
                </DialogHeader>

                <form action={action} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="productId">Product</Label>
                        <Select name="productId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rawMaterialId">Raw Material</Label>
                        <Select name="rawMaterialId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a raw material" />
                            </SelectTrigger>
                            <SelectContent>
                                {rawMaterials.map(rm => (
                                    <SelectItem key={rm.id} value={rm.id}>{rm.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                            id="quantity"
                            name="quantity"
                            type="number"
                            step="0.01"
                            min="0.01"
                            required
                            placeholder="Amount needed"
                        />
                    </div>

                    <SubmitButton />
                </form>
            </DialogContent>
        </Dialog>
    )
}
