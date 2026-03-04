import { requireCurrentUser } from "@/lib/dal/guards"
import { getProducts } from "@/lib/dal/products"
import { getRawMaterials } from "@/lib/dal/raw-materials"
import { getAllStockMovements } from "@/lib/dal/stock-movements"
import { CreateMovementDialog } from "./_components/create-movement-dialog"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./_components/columns"

export const metadata = {
    title: "Stock Movements | Inventory System",
}

export default async function StockMovementsPage() {
    await requireCurrentUser()

    const [movements, products, rawMaterials] = await Promise.all([
        getAllStockMovements(),
        getProducts(),
        getRawMaterials()
    ])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Stock Movements</h1>
                    <p className="text-muted-foreground">
                        View inventory history and record manual adjustments.
                    </p>
                </div>
                <CreateMovementDialog products={products} rawMaterials={rawMaterials} />
            </div>

            <DataTable
                columns={columns}
                data={movements}
                searchKey="reason"
                filterColumns={[
                    {
                        id: "type",
                        title: "Type",
                        options: [
                            { label: "Stock In", value: "IN" },
                            { label: "Stock Out", value: "OUT" },
                            { label: "Adjustment", value: "ADJUST" },
                        ],
                    },
                    {
                        id: "entity",
                        title: "Category",
                        options: [
                            { label: "Product", value: "PRODUCT" },
                            { label: "Raw Material", value: "RAW_MATERIAL" },
                        ],
                    },
                ]}
            />
        </div>
    )
}
