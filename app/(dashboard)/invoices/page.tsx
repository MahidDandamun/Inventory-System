import { getInvoices } from "@/lib/dal/invoices"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./_components/columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"

export const metadata = {
    title: "Invoices | Inventory System",
}

export default async function InvoicesPage() {
    const invoices = await getInvoices()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
                    <p className="text-muted-foreground">
                        Manage billing and payment statuses.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/invoices/new">
                        <IconPlus className="mr-2 h-4 w-4" />
                        Generate Invoice
                    </Link>
                </Button>
            </div>

            <DataTable columns={columns} data={invoices} />
        </div>
    )
}
