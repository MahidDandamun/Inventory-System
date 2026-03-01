import { getInvoiceById } from "@/lib/dal/invoices"
import { getOrders, OrderDTO } from "@/lib/dal/orders"
import { InvoiceForm } from "../_components/invoice-form"
import { notFound } from "next/navigation"

export const metadata = {
    title: "Edit Invoice | Inventory System",
}

export default async function EditInvoicePage({
    params,
}: {
    params: { id: string }
}) {
    const { id } = await params

    const invoice = await getInvoiceById(id)
    if (!invoice) {
        notFound()
    }
    const allOrders = await getOrders()


    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Edit Invoice</h1>
                <p className="text-muted-foreground">
                    Update invoice status and details.
                </p>
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <InvoiceForm
                    invoice={{
                        id: invoice.id,
                        orderId: invoice.orderId,
                        paidAt: invoice.paidAt
                    }}
                    orders={allOrders as OrderDTO[]}
                />
            </div>
        </div>
    )
}
