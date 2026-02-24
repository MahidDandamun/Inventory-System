import { getProducts } from "@/lib/dal/products"
import { OrderForm } from "../_components/order-form"

export const metadata = {
    title: "New Order | Inventory System",
}

export default async function NewOrderPage() {
    // Only fetch active products that have inventory > 0
    const allProducts = await getProducts()
    const availableProducts = allProducts.filter(p => p.status === "ACTIVE")

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Create Order</h1>
                <p className="text-muted-foreground">
                    Create a new customer order and itemize products.
                </p>
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <OrderForm products={availableProducts} />
            </div>
        </div>
    )
}

