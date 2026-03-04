"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { receiveGoodsAction } from "../../_actions/receive"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import type { PurchaseOrderDTO } from "@/lib/dal/purchase-orders"
import type { GoodsReceiptDTO } from "@/lib/dal/goods-receipts"

export function ReceiveGoodsDialog({
    po,
    receipts,
}: {
    po: PurchaseOrderDTO
    receipts: GoodsReceiptDTO[]
}) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const receivedByItemId = receipts.flatMap((r) => r.items).reduce((acc, curr) => {
        acc[curr.purchaseOrderItemId] = (acc[curr.purchaseOrderItemId] || 0) + curr.quantityReceived
        return acc
    }, {} as Record<string, number>)

    const initialItems = po.items.map((item) => ({
        purchaseOrderItemId: item.id,
        rawMaterialId: item.rawMaterialId,
        rawMaterialName: item.rawMaterialName,
        ordered: item.quantity,
        received: receivedByItemId[item.id] || 0,
        pending: item.quantity - (receivedByItemId[item.id] || 0),
        quantityReceived: item.quantity - (receivedByItemId[item.id] || 0),
    })).filter(i => i.pending > 0)

    const [items, setItems] = useState(initialItems)
    const [notes, setNotes] = useState("")

    if (po.status === "RECEIVED" || po.status === "CLOSED" || po.status === "CANCELLED" || initialItems.length === 0) {
        return null
    }

    if (po.status === "DRAFT") {
        return null
    }

    const updateQuantity = (index: number, val: string) => {
        const newItems = [...items]
        newItems[index].quantityReceived = Number(val) || 0
        setItems(newItems)
    }

    const resetForm = () => {
        setItems(initialItems)
        setNotes("")
    }

    function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        startTransition(async () => {
            const dataToSubmit = {
                purchaseOrderId: po.id,
                notes,
                items: items.map(i => ({
                    purchaseOrderItemId: i.purchaseOrderItemId,
                    rawMaterialId: i.rawMaterialId,
                    quantityReceived: i.quantityReceived,
                })).filter(i => i.quantityReceived > 0)
            }

            if (dataToSubmit.items.length === 0) {
                toast.error("Please receive at least one item.")
                return
            }

            const result = await receiveGoodsAction(dataToSubmit)

            if (result && "error" in result) {
                toast.error("Failed to receive goods")
            } else {
                toast.success("Goods received successfully")
                resetForm()
                setOpen(false)
                router.refresh()
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) resetForm()
        }}>
            <DialogTrigger asChild>
                <Button>Receive Goods</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Receive Goods for PO {po.poNumber}</DialogTitle>
                    <DialogDescription>
                        Record received quantities. You can receive partial amounts.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {items.map((item, index) => (
                            <div key={item.purchaseOrderItemId} className="flex gap-4 items-end border-b pb-4 border-border">
                                <div className="flex-1 space-y-1">
                                    <p className="font-medium text-sm">{item.rawMaterialName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Ordered: {item.ordered} | Pending: {item.pending}
                                    </p>
                                </div>
                                <div className="w-1/3 space-y-2">
                                    <Label>Receive Qty</Label>
                                    <Input
                                        type="number"
                                        value={item.quantityReceived}
                                        onChange={(e) => updateQuantity(index, e.target.value)}
                                        max={item.pending}
                                        min={0}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Label>Notes (Optional)</Label>
                        <Textarea
                            placeholder="Condition of goods, delivery notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || items.every(i => i.quantityReceived === 0)}>
                            {isPending ? "Receiving..." : "Confirm Receipt"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
