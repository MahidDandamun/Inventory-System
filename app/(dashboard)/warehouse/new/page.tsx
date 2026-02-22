import { WarehouseForm } from "../_components/warehouse-form"

export const metadata = {
    title: "New Warehouse | Inventory System",
}

export default function NewWarehousePage() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Warehouse</h1>
                <p className="text-muted-foreground">
                    Create a new tracking location for your inventory.
                </p>
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <WarehouseForm />
            </div>
        </div>
    )
}
