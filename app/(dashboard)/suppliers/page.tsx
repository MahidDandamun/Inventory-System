import { getSuppliers } from "@/lib/dal/suppliers"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./_components/supplier-table"
import { CreateSupplierDialog } from "./_components/create-supplier-dialog"

export const metadata = {
    title: "Suppliers | Inventory System",
}

export default async function SuppliersPage() {
    const suppliers = await getSuppliers()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">
                        Suppliers
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your supplier directory and procurement contacts.
                    </p>
                </div>
                <CreateSupplierDialog />
            </div>

            <DataTable
                columns={columns}
                data={suppliers}
                searchKey="name"
                filterColumns={[
                    {
                        id: "status",
                        title: "Status",
                        options: [
                            { label: "Active", value: "ACTIVE" },
                            { label: "Inactive", value: "INACTIVE" },
                        ],
                    },
                ]}
            />
        </div>
    )
}
