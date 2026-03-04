import { getProducts } from "@/lib/dal/products"
import { NewCycleCountForm } from "../_components/new-cycle-count-form"

export const metadata = {
    title: "New Cycle Count | Inventory System",
}

export default async function NewCycleCountPage() {
    const products = await getProducts()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Schedule Cycle Count</h1>
                <p className="text-muted-foreground">
                    Select products and schedule a cycle count.
                </p>
            </div>

            <NewCycleCountForm products={products} />
        </div>
    )
}
