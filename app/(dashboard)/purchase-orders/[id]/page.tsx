import { notFound } from "next/navigation"
import { getPurchaseOrderById } from "@/lib/dal/purchase-orders"
import { getReceiptsByPurchaseOrderId } from "@/lib/dal/goods-receipts"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ReceiveGoodsDialog } from "./_components/receive-goods-dialog"

export const metadata = {
    title: "Purchase Order Details | Inventory System",
}

const statusVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    DRAFT: "secondary",
    SENT: "default",
    PARTIALLY_RECEIVED: "outline",
    RECEIVED: "default",
    CLOSED: "secondary",
    CANCELLED: "destructive",
}

const statusLabelMap: Record<string, string> = {
    DRAFT: "Draft",
    SENT: "Sent",
    PARTIALLY_RECEIVED: "Partial",
    RECEIVED: "Received",
    CLOSED: "Closed",
    CANCELLED: "Cancelled",
}

export default async function PurchaseOrderDetailPage({
    params,
}: {
    params: { id: string }
}) {
    const pId = params.id
    const po = await getPurchaseOrderById(pId)
    if (!po) notFound()

    const receipts = await getReceiptsByPurchaseOrderId(pId)

    // Calculate total received quantities
    const receivedByItemId = receipts.flatMap((r) => r.items).reduce((acc, curr) => {
        acc[curr.purchaseOrderItemId] = (acc[curr.purchaseOrderItemId] || 0) + curr.quantityReceived
        return acc
    }, {} as Record<string, number>)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
                        PO {po.poNumber}
                        <Badge variant={statusVariantMap[po.status] || "secondary"}>
                            {statusLabelMap[po.status] || po.status}
                        </Badge>
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Supplier: {po.supplierName} • Created on {po.createdAt.toLocaleDateString()}
                    </p>
                </div>

                <div className="flex gap-2">
                    <ReceiveGoodsDialog po={po} receipts={receipts} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Total Value:</span>
                            <span className="font-medium">${po.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Notes:</span>
                            <span className="font-medium">{po.notes || "None"}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>PO Items</CardTitle>
                        <CardDescription>Ordered vs Received</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {po.items.map(item => {
                                const received = receivedByItemId[item.id] || 0
                                const isFullyReceived = received >= item.quantity
                                return (
                                    <div key={item.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                        <div>
                                            <p className="font-medium">{item.rawMaterialName}</p>
                                            <p className="text-xs text-muted-foreground">SKU: {item.rawMaterialSku} • ${item.unitCost.toLocaleString()}/unit</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">{item.quantity} ordered</p>
                                            <p className={`text-sm ${isFullyReceived ? "text-green-600" : "text-amber-600"}`}>
                                                {received} received
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {receipts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Goods Receipts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {receipts.map(receipt => (
                                <div key={receipt.id} className="border rounded-md p-4 space-y-2">
                                    <div className="flex justify-between font-medium">
                                        <span className="text-primary">{receipt.receiptNumber}</span>
                                        <span className="text-muted-foreground">{receipt.receivedAt.toLocaleString()}</span>
                                    </div>
                                    {receipt.notes && (
                                        <p className="text-sm text-muted-foreground">Note: {receipt.notes}</p>
                                    )}
                                    <div className="text-sm space-y-1 bg-muted p-2 rounded">
                                        {receipt.items.map(ri => (
                                            <div key={ri.id} className="flex justify-between">
                                                <span>{ri.rawMaterialName}</span>
                                                <span className="font-medium">+{ri.quantityReceived}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
