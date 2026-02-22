import { getProducts } from "@/lib/dal/products"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./_components/columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"

export const metadata = {
    title: "Products | Inventory System",
}

export default async function ProductsPage() {
    const products = await getProducts()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">
                        Manage your inventory items.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/products/new">
                        <IconPlus className="mr-2 h-4 w-4" />
                        Add Product
                    </Link>
                </Button>
            </div>

            <DataTable columns={columns} data={products} />
        </div>
    )
}
