import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getAllSystemLogs } from "@/lib/dal/system-logs"
import { columns } from "./_components/columns"
import { DataTable } from "@/components/ui/data-table"

export const metadata: Metadata = {
    title: "System Ledger | Inventory System",
    description: "Audit trail of all administrative actions.",
}

export default async function SystemLogsPage() {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const logs = await getAllSystemLogs()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">System Ledger</h1>
                    <p className="text-muted-foreground">
                        A historical ledger of all modifications across the system.
                    </p>
                </div>
            </div>

            <DataTable
                searchKey="entity"
                columns={columns}
                data={logs}
                filterColumns={[
                    {
                        id: "action",
                        title: "Action",
                        options: [
                            { label: "Create", value: "CREATE" },
                            { label: "Update", value: "UPDATE" },
                            { label: "Delete", value: "DELETE" },
                        ],
                    },
                    {
                        id: "entity",
                        title: "Entity",
                        options: [
                            { label: "Product", value: "PRODUCT" },
                            { label: "Order", value: "ORDER" },
                            { label: "Invoice", value: "INVOICE" },
                            { label: "Warehouse", value: "WAREHOUSE" },
                            { label: "Raw Material", value: "RAW_MATERIAL" },
                            { label: "BOM", value: "BOM" },
                            { label: "Customer", value: "CUSTOMER" },
                            { label: "User", value: "USER" },
                        ],
                    },
                ]}
            />
        </div>
    )
}
