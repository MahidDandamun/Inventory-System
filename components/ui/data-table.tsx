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
import { IconDownload, IconSearch } from "@tabler/icons-react"

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

    const totalRows = table.getFilteredRowModel().rows.length
    const pageIndex = table.getState().pagination.pageIndex
    const pageSize = table.getState().pagination.pageSize
    const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
    const endRow = Math.min((pageIndex + 1) * pageSize, totalRows)

    return (
        <div className="space-y-4">
            {/* Toolbar: search + filters + export */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                {searchKey && (
                    <div className="relative max-w-sm flex-1">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={globalFilter ?? ""}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="pl-9"
                        />
                    </div>
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
                            <SelectTrigger className="w-[160px]">
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

                <div className="sm:ml-auto">
                    <Button onClick={exportTableToCSV} variant="outline" size="sm">
                        <IconDownload className="mr-1.5 h-3.5 w-3.5" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
                                    className="hover:bg-muted/30 transition-colors"
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
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="text-sm font-medium text-muted-foreground">No results found</p>
                                        <p className="text-xs text-muted-foreground/70">Try adjusting your search or filters.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                    {totalRows > 0
                        ? `Showing ${startRow}–${endRow} of ${totalRows}`
                        : "No results"}
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <span className="text-xs text-muted-foreground tabular-nums">
                        {table.getPageCount() > 0 ? `${pageIndex + 1} / ${table.getPageCount()}` : "—"}
                    </span>
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
        </div>
    )
}
