"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconAlertTriangle, IconPlus, IconLoader2 } from "@tabler/icons-react"
import { ReplenishmentSuggestion } from "@/lib/dal/replenishment"
import { SupplierDTO } from "@/lib/dal/suppliers"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { createPurchaseOrderAction } from "@/app/(dashboard)/purchase-orders/_actions/purchase-orders"
import { toast } from "sonner"

interface ReplenishmentWidgetProps {
    suggestions: ReplenishmentSuggestion[]
    suppliers: SupplierDTO[]
}

export function ReplenishmentWidget({
    suggestions,
    suppliers
}: ReplenishmentWidgetProps) {
    const router = useRouter()
    const [selectedItem, setSelectedItem] = useState<ReplenishmentSuggestion | null>(null)
    const [supplierId, setSupplierId] = useState("")
    const [quantity, setQuantity] = useState("")
    const [unitCost, setUnitCost] = useState("")
    const [isPending, setIsPending] = useState(false)

    if (suggestions.length === 0) return null

    const handleOpenRestock = (item: ReplenishmentSuggestion) => {
        setSelectedItem(item)
        setQuantity(item.suggestedQuantity.toString())
        setUnitCost("1.00") // Default
        setSupplierId("")
    }

    const handleCreatePO = async () => {
        if (!selectedItem || !supplierId || !quantity || !unitCost) {
            toast.error("Please fill in all fields")
            return
        }

        setIsPending(true)
        try {
            const result = await createPurchaseOrderAction({
                supplierId,
                items: [
                    {
                        rawMaterialId: selectedItem.id,
                        quantity: parseInt(quantity),
                        unitCost: parseFloat(unitCost)
                    }
                ],
                notes: `Auto-generated from replenishment suggestion for ${selectedItem.sku}`
            })

            if (result && "error" in result) {
                toast.error(typeof result.error === "string" ? result.error : "Failed to create PO")
            } else {
                toast.success("Purchase Order created successfully")
                setSelectedItem(null)
                router.refresh()
            }
        } catch {
            toast.error("An unexpected error occurred")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Card className="col-span-full xl:col-span-3 h-fit">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                    <IconAlertTriangle className="h-5 w-5 text-yellow-500" />
                    Low Stock Alerts
                </CardTitle>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {suggestions.length} items
                </Badge>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto pr-4">
                <div className="space-y-4">
                    {suggestions.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-card/50">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium leading-none truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                    {item.sku} • {item.warehouseName || "Raw Material"}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary" className="text-[10px] px-1.5 h-4">
                                        Stock: {item.currentQuantity}
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px] px-1.5 h-4 border-yellow-200 text-yellow-700">
                                        Min: {item.reorderLevel}
                                    </Badge>
                                </div>
                            </div>
                            {item.entity === "RAW_MATERIAL" && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="shrink-0 h-8 gap-1 border-primary/20 hover:bg-primary/5 text-primary"
                                    onClick={() => handleOpenRestock(item)}
                                >
                                    <IconPlus className="h-3 w-3" />
                                    Restock
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>

            <Dialog open={!!selectedItem} onOpenChange={(v) => !v && setSelectedItem(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Purchase Order</DialogTitle>
                        <DialogDescription>
                            Create a PO for {selectedItem?.name} ({selectedItem?.sku}).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Supplier</Label>
                            <Select value={supplierId} onValueChange={setSupplierId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select supplier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Quantity</Label>
                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Est. Unit Cost</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={unitCost}
                                    onChange={(e) => setUnitCost(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button className="w-full" onClick={handleCreatePO} disabled={isPending}>
                            {isPending && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Purchase Order
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
