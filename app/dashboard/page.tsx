import React from 'react'
import {PiPackage} from 'react-icons/pi';
import {RiShip2Fill} from 'react-icons/ri';
import { TbTruckDelivery, TbCashBanknoteOff } from 'react-icons/tb';
import {GiCash} from 'react-icons/gi';
function DashboardPage() {
  const cardItems = [
    {
      title: "To be packed",
      icon: <PiPackage className="h-16 w-16 sm:h-12 sm:w-12 md:h-14 md:w-14 mr-5" />,
      items:"4"
    },
    {
      title: "To be shipped",
      icon: <RiShip2Fill className="h-16 w-16 sm:h-12 sm:w-12 md:h-14 md:w-14 mr-5" />,
      items:"4"
    },
    {
      title: "To be delivered",
      icon:<TbTruckDelivery className="h-16 w-16 sm:h-12 sm:w-12 md:h-14 md:w-14 mr-5"/>,
      items: "4"
    }
  ]

  const tableContents = [
    {
      tableHeader: "Name",
      name: "	Mike Ross",
      status: "Paid",
      date:"Jan/01/2023",
      amount:"P340"
    },
    {
      tableHeader: "Status",
      name: "James Smith",
      status: "Pending",
      date:"Mar/02/2023",
      amount:"P500"
    },
    {
      tableHeader: "Date",
      name: "Luke Cage",
      status: "Paid",
      date:"Sept/18/2023",
      amount:"P3045"
    },
    {
      tableHeader: "Amount",
      name: "Aaron Davis",
      status: "Cancelled",
      date:"Aug/16/2023",
      amount:"P1504"
    },
  ]
   
  const cardItems2 = [
    {
      title: "Paid Orders",
      icon: <GiCash className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 mr-5" />,
      items: "6"
    },
    {
      title: "Unpaid Orders",
      icon: <TbCashBanknoteOff className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 mr-5" />,
      items:"7"
    }
  ]
  return (
    <>
      <div className="mt-5 p-4 sm:ml-64 sm:mt-0 bg-white dark:bg-gray-900">
        <div className="sm:p-4 rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">         
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5 ">
                {cardItems.map((item, index) => (
                      <div className="min-w-full sm:max-w-full p-6 flex justify-center text-gray-500 dark:text-white bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 group" key={index}>
                          {item.icon}
                          <div className='flex flex-col'>
                            <h5 className="text-md sm:text-lg md:text-xl font-normal tracking-tight text-gray-600 dark:text-white">{item.title}</h5>
                            <p className="mb-3 text-sm font-normal text-gray-500 dark:text-white">
                              <span className='text-gray-500 text-lg font-bold dark:text-violet-400'>
                                {item.items}
                              </span> items
                           </p>
                          </div>
                      </div>
                    ))}
              </div>

            <div>
              <div className="relative p-4 sm:p-6 overflow-x-auto text-gray-600 dark:text-white bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-5">
                  <h1 className='font-normal text-md sm:text-xl md:text-2xl mb-5'>Latest Transactions</h1>
                  <table className="w-full text-sm text-left rtl:text-right ">
                      <thead className="text-xs text-gray-600 uppercase dark:text-gray-200">
                          <tr>
                            {tableContents.map((item, index) => (
                              <th scope="col" className="px-1 sm:px-6 py-3" key={index}>
                                {item.tableHeader}
                              </th>
                            ))}
                          </tr>
                      </thead>
                      <tbody>
                      {tableContents.map((item, index) => (
                        <tr className="bg-white dark:bg-gray-800" key={index}>
                          <th scope="row" className="px-1 sm:px-6 py-4 font-medium text-gray-600 whitespace-nowrap dark:text-white">
                            {item.name}
                          </th>
                          <td className="px-1 sm:px-6 py-4" > 
                            <p className={` text-white flex justify-center w-20 ${item.status === "Paid" ? "bg-green-500" : item.status === "Pending" ? "bg-yellow-400" : "bg-red-500"} rounded-md p-2`}>
                            {item.status}
                            </p>
                          </td>
                          <td className="px-1 sm: sm:px-6 py-4">
                            {item.date}
                          </td>
                          <td className="px-1 sm:px-6 py-4">
                            {item.amount}
                          </td>
                        </tr>
                      ))}
                      </tbody>
                  </table>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {cardItems2.map((item, index) => (
                <div className="min-w-full sm:max-w-full p-6 flex justify-center text-gray-600 dark:text-white
                     bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800      
                     dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        {item.icon}
                        <div className='flex flex-col'>
                          <h5 className="text-md sm:text-lg md:text-xl font-normal tracking-tight text-gray-600 dark:text-white">{item.title}</h5>
                          <p className="mb-3 text-sm font-normal text-gray-500 dark:text-white">
                            <span className='text-gray-500 text-lg font-bold dark:text-violet-400'>
                              {item.items}
                            </span> orders
                          </p>
                        </div>
                    </div>
                  ))}
            </div>
        </div>
      </div> 
    </>
  )
}
export default DashboardPage;