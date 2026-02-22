"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { IconLoader2 } from "@tabler/icons-react"

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

import { warehouseSchema, type WarehouseInput } from "@/schemas/warehouse"
import { createWarehouseAction, updateWarehouseAction } from "../_actions/warehouse"

interface WarehouseFormProps {
    warehouse?: {
        id: string
        location: string
        status: "ACTIVE" | "INACTIVE"
    } | null
}

export function WarehouseForm({ warehouse }: WarehouseFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<WarehouseInput>({
        resolver: zodResolver(warehouseSchema),
        defaultValues: {
            location: warehouse?.location || "",
            status: warehouse?.status || "ACTIVE",
        },
    })

    const statusValue = useWatch({ control, name: "status" });

    function onSubmit(values: WarehouseInput) {
        setError(undefined)
        startTransition(async () => {
            const formData = new FormData()
            formData.append("location", values.location)
            formData.append("status", values.status || "ACTIVE")

            let result
            if (warehouse?.id) {
                result = await updateWarehouseAction(warehouse.id, formData)
            } else {
                result = await createWarehouseAction(formData)
            }

            if (result?.error) {
                if (typeof result.error === "object") {
                    const err = result.error as Record<string, string[]>
                    if (err.location) {
                        setError(err.location[0])
                    } else if (err.root) {
                        setError(err.root[0])
                    }
                } else {
                    setError(String(result.error))
                }
            } else {
                router.push("/warehouse")
                router.refresh()
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    placeholder="Main Warehouse, NY"
                    disabled={isPending}
                    {...register("location")}
                />
                {errors.location && (
                    <p className="text-sm text-destructive">{errors.location.message}</p>
                )}
                <p className="text-xs text-muted-foreground">The physical location or name of the warehouse.</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
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
                <p className="text-xs text-muted-foreground">Inactive warehouses cannot receive new stock.</p>
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
                    onClick={() => router.push("/warehouse")}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {warehouse ? "Update Warehouse" : "Create Warehouse"}
                </Button>
            </div>
        </form>
    )
}
