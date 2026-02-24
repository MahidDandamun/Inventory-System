import { getRawMaterials } from "@/lib/dal/raw-materials"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./_components/columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"

export const metadata = {
    title: "Raw Materials | Inventory System",
}

export default async function RawMaterialsPage() {
    const items = await getRawMaterials()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Raw Materials</h1>
                    <p className="text-muted-foreground">
                        Manage your raw materials and stock levels.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/raw-materials/new">
                        <IconPlus className="mr-2 h-4 w-4" />
                        Add Material
                    </Link>
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={items}
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
        </div>
    )
}

