"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { IconLoader2 } from "@tabler/icons-react"

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

import { productSchema, type ProductInput } from "@/schemas/product"
import { createProductAction, updateProductAction } from "../_actions/product"
import { ProductDTO } from "@/lib/dal/products"

interface ProductFormProps {
    product?: ProductDTO | null
    warehouses: { id: string; location: string }[]
}

export function ProductForm({ product, warehouses }: ProductFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<ProductInput>({
        resolver: zodResolver(productSchema) as never,
        defaultValues: {
            name: product?.name || "",
            sku: product?.sku || "",
            description: product?.description || "",
            price: product?.price || 0,
            quantity: product?.quantity || 0,
            warehouseId: product?.warehouseId || "",
        },
    })

    const warehouseValue = useWatch({ control, name: "warehouseId" });

    function onSubmit(values: ProductInput) {
        setError(undefined)
        startTransition(async () => {
            const formData = new FormData()
            formData.append("name", values.name)
            formData.append("sku", values.sku)
            if (values.description) formData.append("description", values.description)
            formData.append("price", values.price.toString())
            formData.append("quantity", values.quantity.toString())
            formData.append("warehouseId", values.warehouseId)

            let result
            if (product?.id) {
                // For updates
                result = await updateProductAction(product.id, formData)
            } else {
                result = await createProductAction(formData)
            }

            if (result?.error) {
                if (typeof result.error === "object") {
                    const err = result.error as Record<string, string[]>
                    const firstError = Object.values(err).find(e => e && e.length > 0)
                    if (firstError) {
                        setError(firstError[0])
                    } else if (err.root) {
                        setError(err.root[0])
                    }
                } else {
                    setError(String(result.error))
                }
            } else {
                router.push("/products")
                router.refresh()
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                        id="name"
                        placeholder="Logitech MX Master 3S"
                        disabled={isPending}
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                        id="sku"
                        placeholder="PRD-12345"
                        disabled={isPending}
                        {...register("sku")}
                    />
                    {errors.sku && (
                        <p className="text-sm text-destructive">{errors.sku.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="99.99"
                        disabled={isPending}
                        {...register("price")}
                    />
                    {errors.price && (
                        <p className="text-sm text-destructive">{errors.price.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
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
            </div>

            <div className="space-y-2">
                <Label htmlFor="warehouseId">Warehouse</Label>
                <Select
                    disabled={isPending}
                    value={warehouseValue}
                    onValueChange={(value) => setValue("warehouseId", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                        {warehouses.map((w) => (
                            <SelectItem key={w.id} value={w.id}>
                                {w.location}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.warehouseId && (
                    <p className="text-sm text-destructive">{errors.warehouseId.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Enter product description..."
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
                    onClick={() => router.push("/products")}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {product ? "Update Product" : "Create Product"}
                </Button>
            </div>
        </form>
    )
}
