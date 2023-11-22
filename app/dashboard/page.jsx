import React from 'react'
import {PiPackage} from 'react-icons/pi';
import {RiShip2Fill} from 'react-icons/ri';
import { TbTruckDelivery, TbCashBanknoteOff } from 'react-icons/tb';
import {GiCash} from 'react-icons/gi';
function DashboardPage() {
  const cardItems = [
    {
      title: "To be packed",
      icon: <PiPackage className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 mr-5" />,
      items:"4"
    },
    {
      title: "To be shipped",
      icon: <RiShip2Fill className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 mr-5" />,
      items:"4"
    },
    {
      title: "To be delivered",
      icon:<TbTruckDelivery className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 mr-5"/>,
      items: "4"
    }
  ]

  const tableContents = [
    {
      tableHeader: "Name",
      name: "Joseph stan",
      status: "Paid",
      date:"11/12/2023",
      amount:"P340"
    },
    {
      tableHeader: "Status",
      name: "Carl jones",
      status: "Pending",
      date:"11/05/2023",
      amount:"P500"
    },
    {
      tableHeader: "Date",
      name: "McLean daniels",
      status: "Paid",
      date:"11/15/2023",
      amount:"P3045"
    },
    {
      tableHeader: "Amount",
      name: "Clark angelo",
      status: "Cancelled",
      date:"11/01/2023",
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
      <div className="p-4 sm:ml-64">
        <div className="p-4 rounded-lg   dark:border-gray-700 mt-14 overflow-y-auto">         
          <div className="grid sm:grid-cols-3 gap-4 mb-5 ">
                {cardItems.map((item, index) => (
                      <div className="min-w-full sm:max-w-full p-6 flex justify-center text-gray-900 dark:text-white bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 group">
                          {item.icon}
                          <div className='flex flex-col'>
                            <h5 className="text-md sm:text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{item.title}</h5>
                            <p className="mb-3 text-sm font-normal text-gray-500 dark:text-white">
                              <span className='text-gray-500 dark:text-green-600'>
                                {item.items}
                              </span> items
                          </p>
                          </div>
                      </div>
                    ))}
              </div>

            <div>
              <div className="relative p-4 sm:p-6 overflow-x-auto dark:text-white bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-5">
                  <h1 className='font-normal text-md sm:text-xl md:text-2xl mb-5'>Latest Transactions</h1>
                  <table className="w-full text-sm text-left rtl:text-right ">
                      <thead className="text-xs text-gray-900 uppercase dark:text-gray-400">
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
                          <th scope="row" className="px-1 sm:px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
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
                    <div className="min-w-full sm:max-w-full p-6 flex text-gray-900 dark:text-white bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800      
                     dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        {item.icon}
                        <div className='flex flex-col'>
                          <h5 className="text-md sm:text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{item.title}</h5>
                          <p className="mb-3 text-sm font-normal text-gray-500 dark:text-white">
                            <span className='text-gray-500 dark:text-green-600'>
                              {item.items}
                            </span> items
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