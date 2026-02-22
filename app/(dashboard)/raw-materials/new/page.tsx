import { RawMaterialForm } from "../_components/raw-material-form"

export const metadata = {
    title: "New Raw Material | Inventory System",
}

export default function NewRawMaterialPage() {
    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Raw Material</h1>
                <p className="text-muted-foreground">
                    Add a raw material item to your inventory tracking.
                </p>
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <RawMaterialForm />
            </div>
        </div>
    )
}
