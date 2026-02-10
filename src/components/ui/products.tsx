"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./custom/data-table";


export const data: Products[] = [
  {
    sku: "1",
    name:"Bedtime candle",
    price:50,
    quantity: 550,    
    warehouse: "Dapitan",
  },
  {
    sku: "1",
    name:"Bedtime candle",
    price:50,
    quantity: 550,    
    warehouse: "Dapitan",
  },
  {
    sku: "1",
    name:"Bedtime candle",
    price:50,
    quantity: 550,    
    warehouse: "Dapitan",
  },
  {
    sku: "1",
    name:"Bedtime candle",
    price:50,
    quantity: 550,    
    warehouse: "Dapitan",
  },
  {
    sku: "1",
    name:"Bedtime candle",
    price:50,
    quantity: 550,    
    warehouse: "Dapitan",
  },
  {
    sku: "1",
    name:"Bedtime candle",
    price:50,
    quantity: 550,    
    warehouse: "Dapitan",
  },
  
]

export type Products = {
  sku: string
  name:string
  price: number
  quantity:number,
  warehouse:string

}

export const columns: ColumnDef<Products>[] = [
  {
    accessorKey:"sku",
    header:"Sku"
  },
  {
    accessorKey:"name",
    header:"Name"
  },
  {
    accessorKey:"price",
    header:"Price"
  },
  {
    accessorKey:"quantity",
    header:"Quantity"
  },
  {
    accessorKey:"warehouse",
    header:"Warehouse"
  },
]

export function Products( ) {
  return (
    <div className="w-full">
      <DataTable data={data} columns={columns} ></DataTable>
    </div>
  )
}