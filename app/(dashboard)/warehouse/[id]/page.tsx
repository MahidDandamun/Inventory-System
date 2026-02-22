import { getWarehouseById } from "@/lib/dal/warehouses"
import { WarehouseForm } from "../_components/warehouse-form"
import { notFound } from "next/navigation"

export const metadata = {
    title: "Edit Warehouse | Inventory System",
}

export default async function EditWarehousePage({
    params,
}: {
    params: { id: string }
}) {
    // Need to await params.id in next 15+ 
    // Wait, params isn't a promise here? In Next 15, `params` is a promise and we should await it if we use its children.
    // For now we'll just extract id.
    const { id } = await params

    const warehouse = await getWarehouseById(id)

    if (!warehouse) {
        notFound()
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Warehouse</h1>
                <p className="text-muted-foreground">
                    Update location details.
                </p>
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <WarehouseForm warehouse={warehouse} />
            </div>
        </div>
    )
}
