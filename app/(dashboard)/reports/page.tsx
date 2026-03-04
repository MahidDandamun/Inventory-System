import { getStockValuation, getDeadStock, getRevenueByCustomer, getRevenueByWarehouse } from "@/lib/dal/reports"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import {
    stockValuationColumns,
    deadStockColumns,
    revenueByCustomerColumns,
    revenueByWarehouseColumns,
} from "./_components/columns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
    title: "Reports | Inventory System",
}

export default async function ReportsPage() {
    const [
        stockValuation,
        deadStock,
        revenueByCustomer,
        revenueByWarehouse,
    ] = await Promise.all([
        getStockValuation(),
        getDeadStock(30), // 30 days of inactivity
        getRevenueByCustomer(),
        getRevenueByWarehouse(),
    ])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Reports & Export Center</h1>
                <p className="text-muted-foreground">
                    Analyze inventory valuation, dead stock, and revenue trends. Use the export button in each table to download data.
                </p>
            </div>

            <Tabs defaultValue="valuation" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="valuation">Stock Valuation</TabsTrigger>
                    <TabsTrigger value="dead_stock">Dead Stock</TabsTrigger>
                    <TabsTrigger value="revenue_customer">Revenue by Customer</TabsTrigger>
                    <TabsTrigger value="revenue_warehouse">Revenue by Warehouse</TabsTrigger>
                </TabsList>

                <TabsContent value="valuation" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Stock Valuation</CardTitle>
                            <CardDescription>
                                Current inventory value across all active products. Total: {" "}
                                <span className="font-bold text-primary">
                                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stockValuation.totalValuation)}
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={stockValuationColumns}
                                data={stockValuation.items}
                                searchKey="name"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="dead_stock" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dead Stock (30 Days)</CardTitle>
                            <CardDescription>
                                Products sitting in inventory with no outbound movements or orders in the last 30 days.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={deadStockColumns}
                                data={deadStock}
                                searchKey="name"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="revenue_customer" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue by Customer</CardTitle>
                            <CardDescription>
                                Total revenue generated per customer (excluding cancelled orders).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={revenueByCustomerColumns}
                                data={revenueByCustomer}
                                searchKey="customerName"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="revenue_warehouse" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue by Warehouse</CardTitle>
                            <CardDescription>
                                Total revenue broken down by fulfillment source warehouse.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={revenueByWarehouseColumns}
                                data={revenueByWarehouse}
                                searchKey="warehouseLocation"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}
