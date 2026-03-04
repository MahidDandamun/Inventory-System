import { getPurchaseOrders } from "@/lib/dal/purchase-orders"
import { getSuppliers } from "@/lib/dal/suppliers"
import { getRawMaterials } from "@/lib/dal/raw-materials"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./_components/po-table"
import { CreatePurchaseOrderDialog } from "./_components/create-po-dialog"

export const metadata = {
    title: "Purchase Orders | Inventory System",
}

export default async function PurchaseOrdersPage() {
    const [purchaseOrders, suppliers, rawMaterials] = await Promise.all([
        getPurchaseOrders(),
        getSuppliers(),
        getRawMaterials(),
    ])

    const rawMaterialOptions = rawMaterials
        .filter((rm) => rm.status === "ACTIVE")
        .map((rm) => ({ id: rm.id, name: rm.name, sku: rm.sku }))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">
                        Purchase Orders
                    </h1>
                    <p className="text-muted-foreground">
                        Track and manage purchase orders to your suppliers.
                    </p>
                </div>
                <CreatePurchaseOrderDialog
                    suppliers={suppliers}
                    rawMaterials={rawMaterialOptions}
                />
            </div>

            <DataTable
                columns={columns}
                data={purchaseOrders}
                searchKey="poNumber"
                filterColumns={[
                    {
                        id: "status",
                        title: "Status",
                        options: [
                            { label: "Draft", value: "DRAFT" },
                            { label: "Sent", value: "SENT" },
                            { label: "Partial", value: "PARTIALLY_RECEIVED" },
                            { label: "Received", value: "RECEIVED" },
                            { label: "Closed", value: "CLOSED" },
                            { label: "Cancelled", value: "CANCELLED" },
                        ],
                    },
                ]}
            />
        </div>
    )
}
