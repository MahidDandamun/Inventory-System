"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { IconLoader2 } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { invoiceSchema, type InvoiceInput } from "@/schemas/invoice"
import { createInvoiceAction, updateInvoiceAction } from "../_actions/invoice"
import { OrderDTO } from "@/lib/dal/orders"

interface InvoiceFormProps {
    invoice?: { id: string, orderId: string, paidAt: Date | null } | null
    orders: OrderDTO[]
}

export function InvoiceForm({ invoice, orders }: InvoiceFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()

    const {
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<InvoiceInput>({
        resolver: zodResolver(invoiceSchema) as never,
        defaultValues: {
            orderId: invoice?.orderId || "",
            markAsPaid: !!invoice?.paidAt,
        },
    })

    const orderValue = useWatch({ control, name: "orderId" });
    const isPaidValue = useWatch({ control, name: "markAsPaid" });

    function onSubmit(values: InvoiceInput) {
        setError(undefined)
        startTransition(async () => {
            const formData = new FormData()
            formData.append("orderId", values.orderId)
            if (values.markAsPaid) {
                formData.append("markAsPaid", "true")
            }

            let result: { error?: string | Record<string, string[]>; success?: boolean } | undefined
            if (invoice?.id) {
                result = await updateInvoiceAction(invoice.id, formData)
            } else {
                result = await createInvoiceAction(formData)
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
                router.push("/invoices")
                router.refresh()
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Select Order</Label>
                    {invoice ? (
                        <Select disabled value={orderValue}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={orderValue}>
                                    {orders.find(o => o.id === orderValue)?.orderNo || orderValue}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <Select
                            disabled={isPending}
                            value={orderValue}
                            onValueChange={(val) => setValue("orderId", val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select an order to invoice" />
                            </SelectTrigger>
                            <SelectContent>
                                {orders.map(o => (
                                    <SelectItem key={o.id} value={o.id}>
                                        {o.orderNo} - {o.customer} (${o.total})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {errors.orderId && (
                        <p className="text-sm text-destructive">{errors.orderId.message}</p>
                    )}
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                        id="markAsPaid"
                        checked={isPaidValue}
                        onCheckedChange={(checked) => setValue("markAsPaid", checked === true)}
                        disabled={isPending}
                    />
                    <Label htmlFor="markAsPaid" className="cursor-pointer">
                        Mark this invoice as Paid
                    </Label>
                </div>
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
                    onClick={() => router.push("/invoices")}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {invoice ? "Update Invoice" : "Generate Invoice"}
                </Button>
            </div>
        </form>
    )
}
