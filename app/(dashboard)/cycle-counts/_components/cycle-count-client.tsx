"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { updateCycleCountItemAction, completeCycleCountAction } from "../_actions/cycle-count-actions"
import { toast } from "sonner"
import type { CycleCountDTO } from "@/lib/dal/cycle-counts"

export function CycleCountClientWrapper({ cc }: { cc: CycleCountDTO }) {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [localQuantities, setLocalQuantities] = useState<Record<string, number>>(
        Object.fromEntries(cc.items?.map(i => [i.id, i.actualQuantity ?? i.expectedQuantity]) ?? [])
    )

    const isCompleted = cc.status === "COMPLETED" || cc.status === "PENDING_APPROVAL"

    async function handleSaveItem(id: string) {
        setIsSaving(true)
        const qty = localQuantities[id]
        if (qty === undefined || qty < 0) {
            toast.error("Invalid quantity")
            setIsSaving(false)
            return
        }

        const res = await updateCycleCountItemAction(cc.id, { id, actualQuantity: qty }) as { error?: string } | undefined
        setIsSaving(false)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Count saved")
        }
    }

    async function handleComplete() {
        if (!confirm("Are you sure you want to complete this count? Any uncounted items will use their expected quantities.")) return

        setIsSaving(true)
        const res = await completeCycleCountAction(cc.id) as { error?: string } | undefined
        setIsSaving(false)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Count marked ready/completed!")
            router.refresh()
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">{cc.name}</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Status: <Badge>{cc.status}</Badge> | Scheduled: {new Date(cc.scheduledDate).toLocaleDateString()}
                    </p>
                </div>
                {!isCompleted && (
                    <Button onClick={handleComplete} disabled={isSaving}>Complete Count</Button>
                )}
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="w-[100px]">Expected</TableHead>
                            <TableHead className="w-[150px]">Actual</TableHead>
                            <TableHead className="w-[100px]">Variance</TableHead>
                            {!isCompleted && <TableHead className="w-[100px] text-right">Action</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cc.items?.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.entityName}</TableCell>
                                <TableCell>{item.expectedQuantity}</TableCell>
                                <TableCell>
                                    {isCompleted ? (
                                        item.actualQuantity ?? "-"
                                    ) : (
                                        <Input
                                            type="number"
                                            value={localQuantities[item.id] ?? ""}
                                            onChange={(e) => setLocalQuantities({ ...localQuantities, [item.id]: parseInt(e.target.value) || 0 })}
                                            className="w-full min-w-[80px]"
                                        />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className={item.variance && item.variance !== 0 ? (item.variance > 0 ? "text-green-600 font-bold" : "text-destructive font-bold") : ""}>
                                        {item.variance ?? "-"}
                                    </span>
                                </TableCell>
                                {!isCompleted && (
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => handleSaveItem(item.id)} disabled={isSaving}>Save</Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                        {(!cc.items || cc.items.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">No items scheduled for this count.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
