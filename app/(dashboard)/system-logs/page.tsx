import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getAllSystemLogs } from "@/lib/dal/system-logs"
import { columns } from "./_components/columns"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-primary">System Ledger</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-primary">Audit Trail</CardTitle>
                    <CardDescription>
                        A historical ledger of all modifications across the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable searchKey="entity" columns={columns} data={logs} />
                </CardContent>
            </Card>
        </div>
    )
}
