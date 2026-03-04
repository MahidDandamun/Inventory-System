import { Suspense } from "react"
import { getTransfers } from "@/lib/dal/transfers"
import { getWarehouses } from "@/lib/dal/warehouses"
import { getProducts } from "@/lib/dal/products"
import { TransferTable } from "@/app/(dashboard)/transfers/_components/transfer-table"
import { CreateTransferDialog } from "@/app/(dashboard)/transfers/_components/create-transfer-dialog"
import { Separator } from "@/components/ui/separator"

export default async function TransfersPage() {
    const [transfers, warehouses, products] = await Promise.all([
        getTransfers(),
        getWarehouses(),
        getProducts(),
    ])

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Transfers ({transfers.length})</h1>
                        <p className="text-muted-foreground">Manage stock transfers between warehouses.</p>
                    </div>
                    <CreateTransferDialog warehouses={warehouses} products={products} />
                </div>
                <Separator />
                <Suspense fallback={<div>Loading transfers...</div>}>
                    <TransferTable data={transfers} />
                </Suspense>
            </div>
        </div>
    )
}
