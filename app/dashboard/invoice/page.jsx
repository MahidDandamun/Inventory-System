import Pagination from '@/app/ui/dashboard/pagination/pagination';
 
import product1 from '../../../images/products/candle-1.jpg';
import product2 from '../../../images/products/candle-2.jpg';
import product3 from '../../../images/products/candle-3.jpg';
import product4 from '../../../images/products/candle-4.jpg';
 
import Image from 'next/image';
import Link from 'next/link';
 
function InvoicePage() {
  const tableHeaders = ["Name", "Address", "Item", "Qty", "PricePerItem", "GrandTotal", "PaymentMethod", "PaymentStatus", "Action"]
  
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
      <div className="p-4 sm:ml-64">
        <div className="p-4 rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5">
          <h1 className="sm:text-lg py-5 md:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Invoice</h1>
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
                placeholder="Search invoice"/>
                
            </div>
             <button className='w-24 h-8 bg-green-500 rounded-md text-sm text-white hover:bg-green-600' disabled>Add New </button>
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
              {Invoices.map((invoice, index) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>           
                    <td className='px-1 sm:px-6 py-4'>
                         {invoice.Name}
                    </td>
                    <td className="px-1 sm:px-6 py-4">
                        {invoice.Address}
                    </td>
                    
                    <td className="px-1 sm:px-6 py-4">
                        {invoice.Item}
                    </td>
                    
                    <td className="px-1 sm:px-6 py-4">
                        {invoice.Qty}
                    </td>
                    <td className="px-1 sm:px-6 py-4">
                        {invoice.PricePerItem}
                    </td>
                    <td className="px-1 sm:px-6 py-4">
                        {invoice.GrandTotal}
                    </td>
                    <td className="px-1 sm:px-6 py-4">
                        {invoice.PaymentMethod}
                    </td>
                    <td className="px-1 sm:px-6 py-4">
                        {invoice.PaymentStatus}
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
export default InvoicePage;