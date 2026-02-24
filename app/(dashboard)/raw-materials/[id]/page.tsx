import { getRawMaterialById } from "@/lib/dal/raw-materials"
import { RawMaterialForm } from "../_components/raw-material-form"
import { notFound } from "next/navigation"

export const metadata = {
    title: "Edit Raw Material | Inventory System",
}

export default async function EditRawMaterialPage({
    params,
}: {
    params: { id: string }
}) {
    const { id } = await params

    const item = await getRawMaterialById(id)

    if (!item) {
        notFound()
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Edit Raw Material</h1>
                <p className="text-muted-foreground">
                    Update material details and quantity.
                </p>
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <RawMaterialForm item={item} />
            </div>
        </div>
    )
}
