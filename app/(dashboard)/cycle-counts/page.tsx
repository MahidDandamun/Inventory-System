import { getCycleCounts } from "@/lib/dal/cycle-counts"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { columns } from "./_components/columns"
import { IconPlus } from "@tabler/icons-react"

export const metadata = {
    title: "Cycle Counts | Inventory System",
}

export default async function CycleCountsPage() {
    const counts = await getCycleCounts()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Cycle Counts</h1>
                    <p className="text-muted-foreground">
                        Schedule and track physical inventory counts.
                    </p>
                </div>
                <Button asChild>
                    <Link href={`${ROUTES.CYCLE_COUNTS}/new`}>
                        <IconPlus className="mr-2 h-4 w-4" /> New Cycle Count
                    </Link>
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={counts}
                searchKey="name"
            />
        </div>
    )
}
