import { getWarehouseById } from "@/lib/dal/warehouses"
import { getProducts } from "@/lib/dal/products"
import { WarehouseForm } from "../_components/warehouse-form"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"

export const metadata = {
    title: "Edit Warehouse | Inventory System",
}

export default async function EditWarehousePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const [warehouse, allProducts] = await Promise.all([
        getWarehouseById(id),
        getProducts()
    ])

    if (!warehouse) {
        notFound()
    }

    const warehouseProducts = allProducts.filter(p => p.warehouseId === id)

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Edit Warehouse</h1>
                <p className="text-muted-foreground">
                    Update location details and view assigned inventory.
                </p>
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <WarehouseForm warehouse={warehouse} />
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold tracking-tight">Products in {warehouse.location}</h2>
                    <Badge variant="secondary">{warehouseProducts.length} items</Badge>
                </div>
                
                {warehouseProducts.length > 0 ? (
                    <div className="border rounded-md divide-y">
                        {warehouseProducts.map(product => (
                            <div key={product.id} className="p-3 flex items-center justify-between hover:bg-muted/50">
                                <div>
                                    <div className="font-medium text-sm text-primary">
                                        <Link href={`/products/${product.id}`} className="hover:underline">
                                            {product.name}
                                        </Link>
                                    </div>
                                    <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold">{product.quantity}</div>
                                    <div className="text-xs text-muted-foreground">in stock</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 bg-muted/20 border rounded-md border-dashed text-muted-foreground">
                        <p>No products assigned to this warehouse yet.</p>
                        <Link href="/products" className="text-primary hover:underline text-sm inline-flex items-center mt-2">
                            Go to Products <IconArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
