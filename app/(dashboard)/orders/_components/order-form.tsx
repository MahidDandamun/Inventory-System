"use client"

import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { IconLoader2, IconPlus, IconTrash } from "@tabler/icons-react"

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

import { orderSchema, type OrderInput } from "@/schemas/order"
import { createOrderAction, updateOrderStatusAction } from "../_actions/order"
import { type OrderStatus } from "@/lib/dal/orders"
import { OrderDetailDTO } from "@/lib/dal/orders"
import { ProductDTO } from "@/lib/dal/products"

interface OrderFormProps {
    order?: OrderDetailDTO | null
    products: ProductDTO[]
}

export function OrderForm({ order, products }: OrderFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()

    const {
        register,
        control,
        handleSubmit,

        setValue,
        formState: { errors },
    } = useForm<OrderInput>({
        resolver: zodResolver(orderSchema) as never,
        defaultValues: {
            customer: order?.customer || "",
            items: order?.items?.map(i => ({
                productId: i.id, // Not exact mapped properly, wait... 
                // Wait, if editing, we only update status anyway, but let's map it correctly for default
                quantity: i.quantity,
                unitPrice: i.unitPrice
            })) || [{ productId: "", quantity: 1, unitPrice: 0 }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    })

    const watchItems = useWatch({ control, name: "items" })

    // Auto-update price when product changes
    const handleProductChange = (index: number, productId: string) => {
        setValue(`items.${index}.productId`, productId)
        const product = products.find(p => p.id === productId)
        if (product) {
            setValue(`items.${index}.unitPrice`, product.price)
        }
    }

    function onSubmit(values: OrderInput) {
        if (order) {
            // Edit is not supported for full order form in this basic version, only status
            return
        }

        setError(undefined)
        startTransition(async () => {
            const formData = new FormData()
            formData.append("customer", values.customer)
            formData.append("items", JSON.stringify(values.items))

            const result = await createOrderAction(formData)

            if (result?.error) {
                const err = result.error as Record<string, string[]>
                const firstError = Object.values(err).find(e => e && e.length > 0)
                if (firstError) {
                    setError(firstError[0])
                } else if (err.root) {
                    setError(err.root[0])
                }
            } else {
                router.push("/orders")
                router.refresh()
            }
        })
    }

    // Status update only form
    if (order) {
        return <OrderStatusForm order={order} />
    }

    const total = watchItems.reduce((acc, item) => acc + (Number(item?.quantity || 0) * Number(item?.unitPrice || 0)), 0)

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="customer">Customer Name</Label>
                <Input
                    id="customer"
                    placeholder="Acme Corp"
                    disabled={isPending}
                    {...register("customer")}
                />
                {errors.customer && (
                    <p className="text-sm text-destructive">{errors.customer.message}</p>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Order Items</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ productId: "", quantity: 1, unitPrice: 0 })}
                    >
                        <IconPlus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                </div>

                {errors.items?.message && typeof errors.items.message === 'string' && (
                    <p className="text-sm text-destructive">{errors.items.message}</p>
                )}

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-end border p-4 rounded-lg bg-card/50">
                            <div className="flex-1 space-y-2 w-full">
                                <Label>Product</Label>
                                <Select
                                    disabled={isPending}
                                    value={watchItems[index]?.productId}
                                    onValueChange={(val) => handleProductChange(index, val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map(p => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.name} - ${p.price} ({p.quantity} in stock)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.items?.[index]?.productId && (
                                    <p className="text-xs text-destructive">{errors.items[index]?.productId?.message}</p>
                                )}
                            </div>

                            <div className="w-full sm:w-24 space-y-2">
                                <Label>Qty</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    disabled={isPending}
                                    {...register(`items.${index}.quantity` as const)}
                                />
                            </div>

                            <div className="w-full sm:w-32 space-y-2">
                                <Label>Price</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    disabled={isPending}
                                    {...register(`items.${index}.unitPrice` as const)}
                                />
                            </div>

                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => remove(index)}
                                disabled={isPending || fields.length === 1}
                                className="shrink-0"
                            >
                                <IconTrash className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <div className="p-3 rounded bg-destructive/15 text-destructive text-sm">
                    {error}
                </div>
            )}

            <div className="flex items-center justify-between border-t pt-4 mt-6 text-xl">
                <span className="font-semibold">Total:</span>
                <span className="font-bold">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total)}
                </span>
            </div>

            <div className="flex justify-end space-x-4">
                <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => router.push("/orders")}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Order
                </Button>
            </div>
        </form>
    )
}

function OrderStatusForm({ order }: { order: OrderDetailDTO }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [status, setStatus] = useState(order.status)

    const handleUpdate = () => {
        startTransition(async () => {
            const formData = new FormData()
            formData.append("status", status)
            await updateOrderStatusAction(order.id, formData)
            router.push("/orders")
            router.refresh()
        })
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="text-muted-foreground block">Order Number</span>
                    <span className="font-medium">{order.orderNo}</span>
                </div>
                <div>
                    <span className="text-muted-foreground block">Customer</span>
                    <span className="font-medium">{order.customer}</span>
                </div>
                <div>
                    <span className="text-muted-foreground block">Date</span>
                    <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                    <span className="text-muted-foreground block">Total Amount</span>
                    <span className="font-medium text-lg">${order.total.toFixed(2)}</span>
                </div>
            </div>

            <div className="border rounded-md p-4 space-y-3 bg-muted/20 text-sm">
                <h3 className="font-semibold">Line Items</h3>
                {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0 border-border/50">
                        <div>
                            <span className="font-medium">{item.productName}</span>
                            <span className="text-muted-foreground text-xs ml-2">x{item.quantity}</span>
                        </div>
                        <span>${(item.quantity * item.unitPrice).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-2 pt-4">
                <Label>Update Status</Label>
                <Select value={status} onValueChange={(val: OrderStatus) => setStatus(val)} disabled={isPending}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => router.push("/orders")}
                >
                    Back
                </Button>
                <Button onClick={handleUpdate} disabled={isPending || status === order.status}>
                    {isPending && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Status
                </Button>
            </div>
        </div>
    )
}
