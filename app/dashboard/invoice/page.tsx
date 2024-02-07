"use client";
import Pagination from "../../../components/ui/dashboard/pagination/pagination";
import { SearchInputField } from "../../../components/ui/dashboard/inputFields/inputField";
import DataTable from "../../../components/ui/dashboard/table/table";
import React from "react";
 
function InvoicePage() {
  const tableHeaders = ["Name", "Address", "Item", "Qty", "PricePerItem", "GrandTotal", "PaymentMethod", "PaymentStatus"]
  
  const Invoices = [
    {   
      Name:"Mike Ross",
      Address: "Western Bicutan Taguig City",
      Item: "Passion Flicker",
      Qty: "2",
      PricePerItem: "95",
      GrandTotal: "P200",
      PaymentMethod: "Gcash",
      PaymentStatus:"Paid",
    },
    {   
      Name:"James Smith",
      Address: "Cembo Makati City",
      Item: "Nightowl Flame",
      Qty: "15",
      PricePerItem: "95",
      GrandTotal: "	P6500",
      PaymentMethod: "COD",
      PaymentStatus:"Pending",
    },
    {   
      Name:"Aaron Davis",
      Address: "Manadaluyong City",
      Item: "Heritage Flame",
      Qty: "12",
      PricePerItem: "95",
      GrandTotal: "	P1560",
      PaymentMethod: "COD",
      PaymentStatus:"Cancelled",
    },
    {   
      Name:"Luke Cage",
      Address: "Pure goold pasig city",
      Item: "Passion Flicker",
      Qty: "8",
      PricePerItem: "95",
      GrandTotal: "P800",
      PaymentMethod: "COD",
      PaymentStatus:"Paid",
    },

  ]
  
  return (
    <>
      <div className=" bg-white dark:bg-gray-900">
        <div className="rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">
          <div className="relative mt-5 sm-mt-0 overflow-x-auto shadow-md sm:rounded-lg p-5">
          <h1 className="text-xl sm:py-5 md:text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Invoice</h1>
            <div className="relative flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
              <label htmlFor="search-users" className="sr-only">Search</label>
              <SearchInputField name={"search_invoice"} placeholder="Search invoice" />
            </div>
            <DataTable path={"invoice"} headers={tableHeaders}  datas={Invoices} hasImage={false}/>
          <Pagination/>  
          </div>
        </div>
      </div>
    </>
  )
}
export default InvoicePage;