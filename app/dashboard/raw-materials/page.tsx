"use client";

import Pagination from "../../ui/dashboard/pagination/pagination";
 
import rawMaterial1 from '../../../images/raw-materials/rawMaterial-1.png';
import rawMaterial2 from '../../../images/raw-materials/rawMaterial-2.png';
import rawMaterial3 from '../../../images/raw-materials/rawMaterial-3.png';
 
import Link from 'next/link';
import Image from 'next/image';

function RawMaterialsPage() {
  const tableHeaders = ["Image", "Name", "Price", "Quantity", "Warehouse","Supplier", "Action"]
  
  const rawMaterials = [
    {   
        image:rawMaterial1,
        name: "Soy wax ",
        price: "P220 / 1kg",
        quantity: "200kg",
        supplier:"candle supplier1",
        warehouse: "Santa Rosa",
    },

    {
        image:rawMaterial2,
        name: "Candle wicks ",
        price: "P 80 / 1pack(10pcs of wick and 6 inches each wick)",
        quantity: "200pcs",
        supplier:"candle supplier2",
        warehouse: "Santa Ana",
    },

    {   
        image:rawMaterial3,
        name: "Vanilla extract ",
        price: "P 100 / bottle of 120ml ",
        quantity: "100pcs",
        supplier:"candle supplier3",
        warehouse: "Santa Mesa",
    },

  ]
  
  return (
    <>
      <div className="p-4 sm:ml-64">
        <div className="p-4 rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5">
          <h1 className="sm:text-lg py-5 md:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Raw Materials</h1>
            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
            <label htmlFor="table-search" className="sr-only">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" 
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="text" id="table-search-users" className="block p-2 ps-10 text-sm text-gray-900 border
              border-gray-300 rounded-lg  w-36 sm:w-80 bg-gray-50 focus:ring-blue-500 
                focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Search raw materials"/>
                
              </div>
              <Link href={"raw-materials/add"}>
                <button className='w-24 h-8 bg-green-500 rounded-md text-sm text-white hover:bg-green-600'>Add New</button>
              </Link>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400  ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>

                  {tableHeaders.map((header, index) => (
                      <th scope="col" className="px-6 py-3" key={index}>
                          {header}
                      </th>
                  ))}
                </tr>
            </thead>
            <tbody>
              {rawMaterials.map((material, index) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                    <th scope="row" className="flex items-center px-1 sm:px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                        <Image src={material.image} className='w-12 h-12 rounded-md' width="0" height="0" alt="product image"></Image>
                  </th>
                  
 
                    <td className="px-1 sm:px-6 py-4">
                        {material.name}
                    </td>
                    
                    <td className="px-1 sm:px-6 py-4">
                        {material.price}
                    </td>
                    
                    <td className="px-1 sm:px-6 py-4">
                        {material.quantity}
                    </td>
                    <td className="px-1 sm:px-6 py-4">
                        <div className="flex items-center">
                          {material.warehouse}                             
                        </div>
                    </td>
                    <td className="px-1 sm:px-6 py-4">
                      <div className="flex items-center">
                          {material.supplier}                             
                      </div>
                    </td>
                    <td className="px-1 sm:px-6 py-4">
                        <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3">Edit </button>
                        <button className="font-medium text-white bg-red-500 p-1 rounded-md w-16  dark:text-blue-500 hover:bg-red-600 mr-2">Delete </button>    
                    </td>
                  </tr>
              ))}
                </tbody>                         
              </table>
              <Pagination/>  
          </div>
        </div>
      </div>
    </>
  )
}
export default RawMaterialsPage;