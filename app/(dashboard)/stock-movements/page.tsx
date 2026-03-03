import { requireCurrentUser } from "@/lib/dal/guards"
import { getProducts } from "@/lib/dal/products"
import { getRawMaterials } from "@/lib/dal/raw-materials"
import { getAllStockMovements } from "@/lib/dal/stock-movements"
import { CreateMovementDialog } from "./_components/create-movement-dialog"
import { MovementList } from "./_components/movement-list"

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

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <MovementList items={movements} products={products} rawMaterials={rawMaterials} />
            </div>
        </div>
    )
}
