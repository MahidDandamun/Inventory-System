 
import Pagination from "../../../components/ui/dashboard/pagination/pagination";
import DataTable from "../../../components/ui/dashboard/table/table";
import { SearchInputField } from "../../../components/ui/dashboard/inputFields/inputField";
import product1 from '../../../images/products/candle-1.jpg';
import product2 from '../../../images/products/candle-2.jpg';
import product3 from '../../../images/products/candle-3.jpg';
import product4 from '../../../images/products/candle-4.jpg';
 
 
import Link from "next/link";
import { AddButton } from "../../../components/ui/dashboard/buttons/button";

 
const ProductsPage =  () => {



  const tableHeaders = ["Sku", "Name", "Price", "Quantity", "Warehouse"]
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
      <div className="  bg-white dark:bg-gray-900">
        <div className="rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">
          <div className="relative mt-5 sm-mt-0 overflow-x-auto shadow-md sm:rounded-lg p-5">
          <h1 className="text-xl sm:py-5 md:text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Products</h1>
            <div className="relative flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
              <label htmlFor="search-users" className="sr-only">Search</label>
              <SearchInputField name={"search_products"} placeholder="Search Products" />
              <Link href='/dashboard/products/add'>
                <AddButton/>
              </Link>
            </div>
            <DataTable path={"products"} headers={tableHeaders} datas={products} hasImage={false}/>
          <Pagination/>  
          </div>
        </div>
      </div>
    </>
  )
}
export default ProductsPage;