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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { invoiceSchema, type InvoiceInput } from "@/schemas/invoice"
import { createInvoiceAction, recordPaymentAction, updateInvoiceAction } from "../_actions/invoice"
import { OrderDTO } from "@/lib/dal/orders"
import { INVOICE_STATUS_VALUES } from "@/lib/invoice-status"

interface InvoiceFormProps {
    invoice?: {
        id: string
        orderId: string
        status: string
        dueDate: Date | null
        balance: number
    } | null
    orders: OrderDTO[]
}

function toDateInputValue(date: Date | null | undefined): string {
    if (!date) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

export function InvoiceForm({ invoice, orders }: InvoiceFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [isPaymentPending, startPaymentTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()
    const [paymentError, setPaymentError] = useState<string | undefined>()
    const [paymentAmount, setPaymentAmount] = useState<string>("")
    const [paymentMethod, setPaymentMethod] = useState<string>("BANK_TRANSFER")
    const [paymentReference, setPaymentReference] = useState<string>("")
    const [paymentDate, setPaymentDate] = useState<string>(toDateInputValue(new Date()))

    const {
        handleSubmit,
        register,
        setValue,
        control,
        formState: { errors },
    } = useForm<InvoiceInput>({
        resolver: zodResolver(invoiceSchema) as never,
        defaultValues: {
            orderId: invoice?.orderId || "",
            dueDate: invoice?.dueDate ?? undefined,
            status: (invoice?.status as InvoiceInput["status"]) || "DRAFT",
        },
    })

    const orderValue = useWatch({ control, name: "orderId" });
    const statusValue = useWatch({ control, name: "status" });

    function onSubmit(values: InvoiceInput) {
        setError(undefined)
        startTransition(async () => {
            const formData = new FormData()
            formData.append("orderId", values.orderId)
            formData.append("status", values.status)
            if (values.dueDate) {
                formData.append("dueDate", values.dueDate.toISOString())
            }

            let result
            if (invoice?.id) {
                result = await updateInvoiceAction(invoice.id, formData)
            } else {
                result = await createInvoiceAction(formData)
            }

            if (result && !result.success) {
                if (result.fieldErrors) {
                    const err = result.fieldErrors
                    const firstError = Object.values(err).find(e => e && e.length > 0)
                    if (firstError) {
                        setError(firstError[0])
                        toast.error(firstError[0])
                    } else if (err.root) {
                        setError(err.root[0])
                        toast.error(err.root[0])
                    }
                } else if (result.error) {
                    setError(result.error)
                    toast.error(result.error)
                }
            } else {
                toast.success(invoice ? "Invoice updated successfully" : "Invoice generated successfully")
                router.push("/invoices")
                router.refresh()
            }
        })
    }

    function onRecordPayment() {
        if (!invoice?.id) return

        setPaymentError(undefined)
        startPaymentTransition(async () => {
            const formData = new FormData()
            formData.append("invoiceId", invoice.id)
            formData.append("amount", paymentAmount)
            formData.append("method", paymentMethod)
            if (paymentReference.trim()) formData.append("reference", paymentReference.trim())
            if (paymentDate) formData.append("paidAt", paymentDate)

            const result = await recordPaymentAction(formData)
            if (!result.success) {
                if (result.fieldErrors) {
                    const err = result.fieldErrors
                    const firstError = Object.values(err).find(e => e && e.length > 0)
                    if (firstError) {
                        setPaymentError(firstError[0])
                        toast.error(firstError[0])
                    } else if (err.root) {
                        setPaymentError(err.root[0])
                        toast.error(err.root[0])
                    }
                } else {
                    setPaymentError(result.error)
                    toast.error(result.error)
                }
                return
            }

            setPaymentAmount("")
            setPaymentReference("")
            toast.success("Payment recorded successfully")
            router.refresh()
        })
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select Order *</Label>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Invoice Status *</Label>
                            <Select
                                disabled={isPending}
                                value={statusValue}
                                onValueChange={(value) => setValue("status", value as InvoiceInput["status"])}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {INVOICE_STATUS_VALUES.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">{errors.status.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                disabled={isPending}
                                defaultValue={toDateInputValue(invoice?.dueDate)}
                                {...register("dueDate", {
                                    setValueAs: (value: string) => value ? new Date(value) : undefined,
                                })}
                            />
                            {errors.dueDate && (
                                <p className="text-sm text-destructive">{errors.dueDate.message}</p>
                            )}
                        </div>
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

            {invoice && (
                <div className="border rounded-lg p-4 space-y-4">
                    <div>
                        <h3 className="font-semibold">Record Payment</h3>
                        <p className="text-sm text-muted-foreground">
                            Outstanding balance: ${invoice.balance.toFixed(2)}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="paymentAmount">Amount *</Label>
                            <Input
                                id="paymentAmount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={paymentAmount}
                                disabled={isPaymentPending}
                                onChange={(event) => setPaymentAmount(event.target.value)}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentMethod">Method *</Label>
                            <Select
                                disabled={isPaymentPending}
                                value={paymentMethod}
                                onValueChange={setPaymentMethod}
                            >
                                <SelectTrigger id="paymentMethod">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BANK_TRANSFER">BANK_TRANSFER</SelectItem>
                                    <SelectItem value="CASH">CASH</SelectItem>
                                    <SelectItem value="CHECK">CHECK</SelectItem>
                                    <SelectItem value="OTHER">OTHER</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentDate">Paid At</Label>
                            <Input
                                id="paymentDate"
                                type="date"
                                value={paymentDate}
                                disabled={isPaymentPending}
                                onChange={(event) => setPaymentDate(event.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentReference">Reference</Label>
                            <Input
                                id="paymentReference"
                                value={paymentReference}
                                disabled={isPaymentPending}
                                onChange={(event) => setPaymentReference(event.target.value)}
                                placeholder="Transaction/receipt reference"
                            />
                        </div>
                    </div>

                    {paymentError && (
                        <div className="p-3 rounded bg-destructive/15 text-destructive text-sm">
                            {paymentError}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button
                            type="button"
                            onClick={onRecordPayment}
                            disabled={isPaymentPending}
                        >
                            {isPaymentPending && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Record Payment
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
