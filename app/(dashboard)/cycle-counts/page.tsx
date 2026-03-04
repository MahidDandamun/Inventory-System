import { getCycleCounts } from "@/lib/dal/cycle-counts"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { IconPlus } from "@tabler/icons-react"

export const metadata = {
    title: "Cycle Counts | Inventory System",
}

export default async function CycleCountsPage() {
    const counts = await getCycleCounts()

    const columns = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => {
                const status = row.getValue("status") as string
                const badgeVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
                    SCHEDULED: "outline",
                    IN_PROGRESS: "default",
                    PENDING_APPROVAL: "secondary",
                    COMPLETED: "default",
                    CANCELLED: "destructive",
                }
                return (
                    <Badge variant={badgeVariants[status] || "outline"}>
                        {status}
                    </Badge>
                )
            }
        },
        {
            accessorKey: "scheduledDate",
            header: "Scheduled For",
            cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => format(new Date(row.getValue("scheduledDate") as Date | string | number), "PPP")
        },
        {
            accessorKey: "createdBy.name",
            header: "Created By",
        },
        {
            id: "actions",
            cell: ({ row }: { row: { original: { id: string } } }) => {
                const id = row.original.id
                return (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`${ROUTES.CYCLE_COUNTS}/${id}`}>View / Count</Link>
                    </Button>
                )
            }
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Cycle Counts</h1>
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
