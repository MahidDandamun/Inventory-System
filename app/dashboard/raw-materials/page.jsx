 import Pagination from '@/app/ui/dashboard/pagination/pagination';
 
import product1 from '../../../images/products/candle-1.jpg';
import product2 from '../../../images/products/candle-2.jpg';
import product3 from '../../../images/products/candle-3.jpg';
import product4 from '../../../images/products/candle-4.jpg';
 
import Image from 'next/image';

function RawMaterialsPage() {
  const tableHeaders = ["Image", "Name", "Price", "Quantity", "Warehouse","Supplier", "Action"]
  
  const rawMaterials = [
    {   
        image:product1,
        name: "Autumn Glow",
        price: "P 100",
        quantity: "95",
        supplier:"candle supplier1",
        warehouse: "Santa Rosa",
    },

    {
        image:product2,
        name: "Passion Flicker",
        price: "P 130",
        quantity: "45",
        supplier:"candle supplier2",
        warehouse: "Santa Ana",
    },

    {   
        image:product3,
        name: "Heritage Flame",
        price: "P 150",
        quantity: "75",
        supplier:"candle supplier3",
        warehouse: "Santa Mesa",
    },

    {
      image:product4,
      name: "Nightowl Flame",
      price: "P 100",
      quantity: "85",
      supplier:"candle supplier4",
      warehouse: "Santa Ana",
    }
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
            <button className='w-24 h-8 bg-green-500 rounded-md text-sm text-white hover:bg-green-600'>Add New</button>
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
                        <Image src={material.image} className='w-12 h-12' width="0" height="0" alt="product image"></Image>
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