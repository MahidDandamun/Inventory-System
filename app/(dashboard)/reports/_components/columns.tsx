"use client"

import { ColumnDef } from "@tanstack/react-table"
import { StockValuationDTO, DeadStockDTO, RevenueByCustomerDTO, RevenueByWarehouseDTO } from "@/lib/dal/reports"

export const stockValuationColumns: ColumnDef<StockValuationDTO>[] = [
    {
        accessorKey: "sku",
        header: "SKU",
    },
    {
        accessorKey: "name",
        header: "Product Name",
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },
    {
        accessorKey: "price",
        header: "Unit Price",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"))
            return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
        },
    },
    {
        accessorKey: "valuation",
        header: "Total Valuation",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("valuation"))
            return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
        },
    },
]

export const deadStockColumns: ColumnDef<DeadStockDTO>[] = [
    {
        accessorKey: "sku",
        header: "SKU",
    },
    {
        accessorKey: "name",
        header: "Product Name",
    },
    {
        accessorKey: "quantity",
        header: "Quantity in Stock",
    },
    {
        accessorKey: "valuation",
        header: "Tied-Up Capital",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("valuation"))
            return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
        },
    },
]

export const revenueByCustomerColumns: ColumnDef<RevenueByCustomerDTO>[] = [
    {
        accessorKey: "customerName",
        header: "Customer",
    },
    {
        accessorKey: "totalRevenue",
        header: "Total Revenue",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalRevenue"))
            return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
        },
    },
]

export const revenueByWarehouseColumns: ColumnDef<RevenueByWarehouseDTO>[] = [
    {
        accessorKey: "warehouseLocation",
        header: "Warehouse Location",
    },
    {
        accessorKey: "totalRevenue",
        header: "Total Revenue",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalRevenue"))
            return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
        },
    },
]
