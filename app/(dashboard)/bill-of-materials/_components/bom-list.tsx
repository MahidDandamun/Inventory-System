"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { BillOfMaterialDTO } from "@/lib/dal/bill-of-materials"
import { EmptyState } from "@/components/ui/empty-state"
import { IconLayersLinked } from "@tabler/icons-react"

export type ProductBOMGroup = {
    productId: string
    productName: string
    materials: BillOfMaterialDTO[]
}

export function BomList({ items }: { items: BillOfMaterialDTO[] }) {
    if (items.length === 0) {
        return (
            <EmptyState
                icon={<IconLayersLinked className="h-6 w-6 text-muted-foreground" />}
                title="No Bill of Materials"
                description="Create one to get started defining your product compositions."
            />
        )
    }

    const groupedMap = items.reduce((acc, item) => {
        if (!acc[item.productId]) {
            acc[item.productId] = {
                productId: item.productId,
                productName: item.productName,
                materials: []
            }
        }
        acc[item.productId].materials.push(item)
        return acc
    }, {} as Record<string, ProductBOMGroup>)

    const groupedList = Object.values(groupedMap).sort((a, b) => 
        a.productName.localeCompare(b.productName)
    )

    return (
        <DataTable
            columns={columns}
            data={groupedList}
            searchKey="productName"
        />
    )
}
