// Importing necessary components and images
import Pagination from "../../../components/ui/dashboard/pagination/pagination";
import DataTable from "../../../components/ui/dashboard/table/table";
// import rawMaterial1 from '../../../images/raw-materials/rawMaterial-1.png';
// import rawMaterial2 from '../../../images/raw-materials/rawMaterial-2.png';
// import rawMaterial3 from '../../../images/raw-materials/rawMaterial-3.png';
import Link from 'next/link';
import { SearchInputField } from "../../../components/ui/dashboard/inputFields/inputField";
import { AddButton } from "../../../components/ui/dashboard/buttons/button";


// Function component for Raw Materials page
const RawMaterialsPage=  ()=> {

  // Table headers for the data table
  const tableHeaders = ["Name", "Price", "Quantity", "Warehouse","Supplier"];
  
  const rmaterials = [
    {
      Name: "Wax",
      Price: "P 100",
      Quantity: "95",
      Warehouse: "Makati City",
      Supplier: "Supplier 1"
    },
    {
      Name: "Wick",
      Price: "P 130",
      Quantity: "45",
      Warehouse: "Taguig City",
      Supplier: "Supplier 2"
    },
    {
      Name: "Fragrance",
      Price: "P 150",
      Quantity: "75",
      Warehouse: "Manadaluyong City",
      Supplier: "Supplier 3"
    },
    {
      Name: "Dye",
      Price: "P 100",
      Quantity: "85",
      Warehouse: "Taguig City ",
      Supplier: "Supplier 4"
    }
  ]
  return (
    <>
      <div className="  bg-white dark:bg-gray-900">
        <div className="rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">
          <div className="relative mt-5 sm-mt-0 overflow-x-auto shadow-md sm:rounded-lg p-5">
            <h1 className="text-xl sm:py-5 md:text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Raw Materials</h1>
            <div className="relative flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
              <label htmlFor="search-users" className="sr-only">Search</label>
              <SearchInputField name={"search_raw"} placeholder="Search raw materials" />
              <Link href='/dashboard/raw-materials/add'>
                <AddButton/>
              </Link>
            </div>
            <DataTable path={"raw-materials"} headers={tableHeaders} datas={rmaterials} hasImage={false}/>
            <Pagination/>  
          </div>
        </div>
      </div>
    </>
  )
}

export default RawMaterialsPage;