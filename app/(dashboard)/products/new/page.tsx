import { ProductForm } from "../_components/product-form"
import { getWarehouses } from "@/lib/dal/warehouses"

export const metadata = {
    title: "New Product | Inventory System",
}

export default async function NewProductPage() {
    // Fetch available warehouses for the dropdown
    const warehouses = await getWarehouses()

    // Filter out inactive warehouses
    const activeWarehouses = warehouses.filter(w => w.status === "ACTIVE")

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Product</h1>
                <p className="text-muted-foreground">
                    Add a new product to your inventory.
                </p>
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <ProductForm warehouses={activeWarehouses} />
            </div>
        </div>
    )
}
