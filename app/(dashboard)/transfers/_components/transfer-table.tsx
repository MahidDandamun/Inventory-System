"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { TransferDTO } from "@/lib/dal/transfers"

interface TransferTableProps {
    data: TransferDTO[]
}

export const TransferTable: React.FC<TransferTableProps> = ({ data }) => {
    return (
        <DataTable
            columns={columns}
            data={data}
            searchKey="transferNumber"
            filterColumns={[
                {
                    id: "status",
                    title: "Status",
                    options: [
                        { label: "Requested", value: "REQUESTED" },
                        { label: "Approved", value: "APPROVED" },
                        { label: "In Transit", value: "IN_TRANSIT" },
                        { label: "Received", value: "RECEIVED" },
                        { label: "Cancelled", value: "CANCELLED" },
                    ]
                }
            ]}
        />
    )
}
