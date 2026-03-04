import { getCustomers } from "@/lib/dal/customers"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./_components/customer-table"
import { CreateCustomerDialog } from "./_components/create-customer-dialog"

export const metadata = {
    title: "Customers | Inventory System",
}

export default async function CustomersPage() {
    const customers = await getCustomers()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">
                        Customers
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your customer directory and contact information.
                    </p>
                </div>
                <CreateCustomerDialog />
            </div>

            <DataTable
                columns={columns}
                data={customers}
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
