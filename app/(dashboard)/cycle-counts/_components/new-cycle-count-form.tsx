"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/routes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createCycleCountAction } from "../_actions/cycle-count-actions"
import { toast } from "sonner"
import type { ProductDTO } from "@/lib/dal/products"
import { Checkbox } from "@/components/ui/checkbox"

export function NewCycleCountForm({ products }: { products: ProductDTO[] }) {
    const router = useRouter()
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
    const [isPending, setIsPending] = useState(false)

    const toggleProduct = (id: string) => {
        const next = new Set(selectedProducts)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setSelectedProducts(next)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const form = new FormData(e.currentTarget)
        const name = form.get("name") as string
        const scheduledDate = form.get("scheduledDate") as string
        const notes = form.get("notes") as string

        if (!name || !scheduledDate) {
            toast.error("Name and Scheduled Date are required.")
            return
        }

        if (selectedProducts.size === 0) {
            toast.error("Select at least one product to count.")
            return
        }

        setIsPending(true)
        const result = await createCycleCountAction({
            name,
            scheduledDate,
            notes,
            productIds: Array.from(selectedProducts)
        }) as { error?: string } | undefined

        setIsPending(false)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success("Cycle count scheduled")
            router.push(ROUTES.CYCLE_COUNTS)
            router.refresh()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Q1 Full Inventory Count" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input id="scheduledDate" name="scheduledDate" type="date" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea id="notes" name="notes" placeholder="Instructions for counters..." />
            </div>

            <div>
                <Label className="mb-4 block">Select Products to Count</Label>
                <div className="border rounded-md max-h-64 overflow-y-auto space-y-2 p-4">
                    {products.map((p) => (
                        <div key={p.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={p.id}
                                checked={selectedProducts.has(p.id)}
                                onCheckedChange={() => toggleProduct(p.id)}
                            />
                            <label
                                htmlFor={p.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                            >
                                {p.name} <span className="text-muted-foreground">({p.sku})</span>
                            </label>
                            <span className="text-sm text-muted-foreground mr-2">Qty: {p.quantity}</span>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <div className="text-sm text-muted-foreground">No products available to count.</div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    Schedule Count
                </Button>
            </div>
        </form>
    )
}
