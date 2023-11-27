"use client";
import Pagination from "../../ui/dashboard/pagination/pagination";
import DataTable from "../../ui/dashboard/table/table";
import { SearchInputField } from "../../ui/dashboard/inputFields/inputField";
import product1 from '../../../images/products/candle-1.jpg';
import product2 from '../../../images/products/candle-2.jpg';
import product3 from '../../../images/products/candle-3.jpg';
import product4 from '../../../images/products/candle-4.jpg';
 
 
import Link from "next/link";
 
function ProductsPage() {
 
  const tableHeaders = ["Image", "Sku", "Name", "Price", "Quantity", "Warehouse"]
  const products = [
    {   
      Image:product1,
      Sku: "123456789",
      Name: "Passion Flicker",
      Price: "P 100",
      Quantity: "95",
      Warehouse: "Makati City"
    },
    {
      Image:product2,
      Sku: "123243789", 
      Name: "Heritage Flame",
      Price: "P 130",
      Quantity: "45",
      Warehouse: "Taguig City"
    },
    {   
      Image:product3,
      Sku: "123456789",
      Name: "Nightowl Flame",
      Price: "P 150",
      Quantity: "75",
      Warehouse: "Manadaluyong City"
    },
    {
      Image:product4,
      Sku: "123456789",
      Name: "Autumn Glow",
      Price: "P 100",
      Quantity: "85",
      Warehouse: "Taguig City "
    }
  ]
 
  return (
    <>
      <div className="md:p-4 sm:ml-64 bg-white dark:bg-gray-900">
        <div className="rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">
          <div className="relative mt-5 sm-mt-0 overflow-x-auto shadow-md sm:rounded-lg p-5">
          <h1 className="text-xl sm:py-5 md:text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Products</h1>
            <div className="relative flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
              <label htmlFor="search-users" className="sr-only">Search</label>
              <SearchInputField name={"search_products"} placeholder="Search Products" />
              <Link href='/dashboard/products/add'>
                <button className='w-16 h-16 rounded-full sm:w-24 sm:h-8 fixed right-6 bottom-20 
                  sm:static
                bg-green-500 sm:rounded-md text-sm
                text-white hover:bg-green-600'>Add new
                </button>
              </Link>
            </div>
            <DataTable path={"products"} headers={tableHeaders} datas={products} hasImage={true}/>
          <Pagination/>  
          </div>
        </div>
      </div>
    </>
  )
}
export default ProductsPage;