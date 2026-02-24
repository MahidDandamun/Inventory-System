import { getProductById } from "@/lib/dal/products"
import { getWarehouses } from "@/lib/dal/warehouses"
import { ProductForm } from "../_components/product-form"
import { notFound } from "next/navigation"

export const metadata = {
    title: "Edit Product | Inventory System",
}

export default async function EditProductPage({
    params,
}: {
    params: { id: string }
}) {
    const { id } = await params

    const [product, warehouses] = await Promise.all([
        getProductById(id),
        getWarehouses()
    ])

    if (!product) {
        notFound()
    }

    // Allow seeing all warehouses in edit mode, even inactive ones 
    // in case the product is already associated with an inactive warehouse

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Edit Product</h1>
                <p className="text-muted-foreground">
                    Update product details and inventory.
                </p>
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <ProductForm product={product} warehouses={warehouses} />
            </div>
        </div>
    )
}
