import { getOrders } from "@/lib/dal/orders"
import { InvoiceForm } from "../_components/invoice-form"

export const metadata = {
    title: "New Invoice | Inventory System",
}

export default async function NewInvoicePage() {
    const allOrders = await getOrders()
    // For simplicity we show all orders. In real app might want to filter out those with an existing invoice.

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Generate Invoice</h1>
                <p className="text-muted-foreground">
                    Select an order to create a new invoice.
                </p>
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <InvoiceForm orders={allOrders} />
            </div>
        </div>
    )
}
