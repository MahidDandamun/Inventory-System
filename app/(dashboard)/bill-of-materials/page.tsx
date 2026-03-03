import { requireCurrentUser } from "@/lib/dal/guards"
import { getProducts } from "@/lib/dal/products"
import { getRawMaterials } from "@/lib/dal/raw-materials"
import { getAllBillOfMaterials } from "@/lib/dal/bill-of-materials"
import { CreateBomDialog } from "./_components/create-bom-dialog"
import { BomList } from "./_components/bom-list"

export const metadata = {
    title: "Bill of Materials | Inventory System",
}

export default async function BillOfMaterialsPage() {
    await requireCurrentUser()

    const [boms, products, rawMaterials] = await Promise.all([
        getAllBillOfMaterials(),
        getProducts(),
        getRawMaterials()
    ])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Bill of Materials</h1>
                    <p className="text-muted-foreground">
                        Manage product compositions and required raw materials.
                    </p>
                </div>
                <CreateBomDialog products={products} rawMaterials={rawMaterials} />
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <BomList items={boms} />
            </div>
        </div>
    )
}
