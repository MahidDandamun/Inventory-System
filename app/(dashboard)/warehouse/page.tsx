import { getWarehouses } from "@/lib/dal/warehouses"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./_components/columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"

export const metadata = {
    title: "Warehouses | Inventory System",
}

export default async function WarehousePage() {
    const warehouses = await getWarehouses()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Warehouses</h1>
                    <p className="text-muted-foreground">
                        Manage your storage locations.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/warehouse/new">
                        <IconPlus className="mr-2 h-4 w-4" />
                        Add Warehouse
                    </Link>
                </Button>
            </div>

            <DataTable columns={columns} data={warehouses} searchKey="location" />
        </div>
    )
}

