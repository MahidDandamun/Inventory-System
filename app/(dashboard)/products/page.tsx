import { Suspense } from "react"
import { getProducts } from "@/lib/dal/products"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./_components/columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton"

export const metadata = {
    title: "Products | Inventory System",
}

async function ProductsTable() {
    // PERF-INSTRUMENTATION: measure DB/auth latency for product list
    console.time("[PERF] getProducts()")
    const products = await getProducts()
    console.timeEnd("[PERF] getProducts()")
    return (
        <DataTable
            columns={columns}
            data={products}
            searchKey="name"
            filterColumns={[
                {
                    id: "status",
                    title: "Status",
                    options: [
                        { label: "Active", value: "ACTIVE" },
                        { label: "Inactive", value: "INACTIVE" },
                    ]
                }
            ]}
        />
    )
}

export default function ProductsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
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

            <Suspense fallback={<DataTableSkeleton />}>
                <ProductsTable />
            </Suspense>
        </div>
    )
}

