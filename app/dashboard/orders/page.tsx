"use client";
import Pagination from "../../../components/ui/dashboard/pagination/pagination";
import product1 from '../../../images/products/candle-1.jpg';
import product2 from '../../../images/products/candle-2.jpg';
import product3 from '../../../images/products/candle-3.jpg';
import product4 from '../../../images/products/candle-4.jpg';
import DataTable from "../../../components/ui/dashboard/table/table";
 
import Link from 'next/link';
import { SearchInputField } from "../../../components/ui/dashboard/inputFields/inputField";
import { AddButton } from "../../../components/ui/dashboard/buttons/button";
function OrdersPage() {
  const tableHeaders = ["ProductImage", "DateOfSalesOrder", "Customer", "Product", "Quantity", "TotalCost", "Discounts","DeliveryStatus", "AdditionalCharges"]
  
  const orders = [
    {   
      Image:product1,
      DateOfSalesOrder: "January 1, 2023",
      Customer:"Mike Ross",
      Product: "Passion Flicker",
      Quantity: "2",
      TotalCost: "P200",
      Discounts: "0%",
      DeliveryStatus:"Packing",
      AdditionalCharges:"0"
    },
    {   
      Image:product3,
      DateOfSalesOrder: "March 2, 2023",
      Customer:"James Smith",
      Product: "Nightowl Flame",
      Quantity: "15",
      TotalCost: "P6500",
      Discounts: "0%",
      DeliveryStatus:"Packing",
      AdditionalCharges:"0"
    },
    {   
      Image:product2,
      DateOfSalesOrder: "September 18, 2023",
      Customer:"Aaron Davis",
      Product: "Heritage Flame",
      Quantity: "12",
      TotalCost: "P1560",
      Discounts: "0%",
      DeliveryStatus:"Packing",
      AdditionalCharges:"0"
    },
    {   
      Image:product1,
      DateOfSalesOrder: "August 16, 2023",
      Customer:"Luke Cage",
      Product: "Passion Flicker",
      Quantity: "8",
      TotalCost: "P800",
      Discounts: "0%",
      DeliveryStatus:"Packing",
      AdditionalCharges:"0"
    }
  ]
  
  return (
    <>
      <div className="  bg-white dark:bg-gray-900">
        <div className="rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">
          <div className="relative mt-5 sm-mt-0 overflow-x-auto shadow-md sm:rounded-lg p-5">
          <h1 className="text-xl sm:py-5 md:text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Orders</h1>
            <div className="relative flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
              <label htmlFor="search-users" className="sr-only">Search</label>
              <SearchInputField name={"search_orders"} placeholder="Search Orders" />
              <Link href='/dashboard/orders/add'>
                <AddButton/>
              </Link>
            </div>
            <DataTable path={"orders"} headers={tableHeaders}  datas={orders} hasImage={true}/>
          <Pagination/>  
          </div>
        </div>
      </div>
    </>
  )
}
export default OrdersPage;
