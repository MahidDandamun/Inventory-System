"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { rawMaterialSchema, type RawMaterialInput } from "@/schemas/raw-material"
import { createRawMaterialAction, updateRawMaterialAction } from "../_actions/raw-material"
import { RawMaterialDTO } from "@/lib/dal/raw-materials"

interface RawMaterialFormProps {
    item?: RawMaterialDTO | null
}

export function RawMaterialForm({ item }: RawMaterialFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<RawMaterialInput>({
        resolver: zodResolver(rawMaterialSchema) as never,
        defaultValues: {
            name: item?.name || "",
            sku: item?.sku || "",
            description: item?.description || "",
            unit: item?.unit || "pcs",
            quantity: item?.quantity || 0,
            reorderAt: item?.reorderAt || 10,
            status: item?.status || "ACTIVE",
        },
    })

    const statusValue = useWatch({ control, name: "status" });

    function onSubmit(values: RawMaterialInput) {
        setError(undefined)
        startTransition(async () => {
            const formData = new FormData()
            formData.append("name", values.name)
            formData.append("sku", values.sku)
            if (values.description) formData.append("description", values.description)
            formData.append("unit", values.unit)
            formData.append("quantity", values.quantity.toString())
            formData.append("reorderAt", values.reorderAt.toString())
            formData.append("status", values.status || "ACTIVE")

            let result
            if (item?.id) {
                result = await updateRawMaterialAction(item.id, formData)
            } else {
                result = await createRawMaterialAction(formData)
            }

            if (result?.error) {
                if (typeof result.error === "object") {
                    const err = result.error as Record<string, string[]>
                    const firstError = Object.values(err).find(e => e && e.length > 0)
                    if (firstError) {
                        setError(firstError[0])
                        toast.error(firstError[0])
                    } else if (err.root) {
                        setError(err.root[0])
                        toast.error(err.root[0])
                    }
                } else {
                    setError(String(result.error))
                    toast.error(String(result.error))
                }
            } else {
                toast.success(item ? "Raw Material updated successfully" : "Raw Material added successfully")
                router.push("/raw-materials")
                router.refresh()
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Material Name *</Label>
                    <Input
                        id="name"
                        placeholder="Aluminum Sheet"
                        disabled={isPending}
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                        id="sku"
                        placeholder="MAT-123"
                        disabled={isPending}
                        {...register("sku")}
                    />
                    {errors.sku && (
                        <p className="text-sm text-destructive">{errors.sku.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="unit">Unit Measure *</Label>
                    <Input
                        id="unit"
                        placeholder="kg, pcs, meters..."
                        disabled={isPending}
                        {...register("unit")}
                    />
                    {errors.unit && (
                        <p className="text-sm text-destructive">{errors.unit.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                        disabled={isPending}
                        value={statusValue}
                        onValueChange={(value: "ACTIVE" | "INACTIVE") => setValue("status", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.status && (
                        <p className="text-sm text-destructive">{errors.status.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="quantity">Current Inventory / Quantity *</Label>
                    <Input
                        id="quantity"
                        type="number"
                        placeholder="100"
                        disabled={isPending}
                        {...register("quantity")}
                    />
                    {errors.quantity && (
                        <p className="text-sm text-destructive">{errors.quantity.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="reorderAt">Reorder Alert Point *</Label>
                    <Input
                        id="reorderAt"
                        type="number"
                        placeholder="10"
                        disabled={isPending}
                        {...register("reorderAt")}
                    />
                    {errors.reorderAt && (
                        <p className="text-sm text-destructive">{errors.reorderAt.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Alerts will trigger when inventory falls below this amount.</p>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Enter material description..."
                    disabled={isPending}
                    className="resize-none"
                    {...register("description")}
                />
                {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
            </div>

            {error && (
                <div className="p-3 rounded bg-destructive/15 text-destructive text-sm">
                    {error}
                </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => router.push("/raw-materials")}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {item ? "Update Material" : "Create Material"}
                </Button>
            </div>
        </form>
    )
}
