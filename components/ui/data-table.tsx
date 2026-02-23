"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconDownload } from "@tabler/icons-react"

export interface DataTableFilterColumn {
    id: string
    title: string
    options: { label: string; value: string }[]
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchKey?: string
    filterColumns?: DataTableFilterColumn[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    filterColumns,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "auto",
        state: {
            columnFilters,
            globalFilter,
        },
    })

    const exportTableToCSV = () => {
        const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

        const exportColumns = table.getAllLeafColumns().filter(c => c.id !== "actions");

        const headers = exportColumns
            .map((c) => toSnakeCase(c.id))
            .join(",")

        const rows = table.getCoreRowModel().rows.map((row) =>
            row.getVisibleCells()
                .filter((cell) => cell.column.id !== "actions")
                .map((cell) => {
                    const value = cell.getValue()
                    // Escape quotes and wrap in quotes to handle commas within data
                    return `"${String(value ?? "").replace(/"/g, '""')}"`
                })
                .join(",")
        )

        const csvContent = "\uFEFF" + [headers, ...rows].join("\n")
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", "table_export.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div>
            <div className="flex items-center gap-2 pb-4">
                {searchKey && (
                    <Input
                        placeholder="Search across all columns..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="max-w-sm"
                    />
                )}

                {filterColumns?.map((filterCol) => {
                    const column = table.getColumn(filterCol.id)
                    if (!column) return null

                    return (
                        <Select
                            key={filterCol.id}
                            value={(column.getFilterValue() as string) ?? "ALL"}
                            onValueChange={(val) => {
                                if (val === "ALL") {
                                    column.setFilterValue(undefined)
                                } else {
                                    column.setFilterValue(val)
                                }
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={`Filter by ${filterCol.title}`} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All {filterCol.title}</SelectItem>
                                {filterCol.options.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )
                })}
            </div>

            <div className="flex justify-end pb-4">
                <Button onClick={exportTableToCSV} variant="outline" size="sm">
                    <IconDownload className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Pagination Controls */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
