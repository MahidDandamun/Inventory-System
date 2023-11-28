import{MdDashboard, MdShoppingBag,MdFactory, MdWarehouse, MdLogout, MdWork, MdAnalytics, MdOutlineSettings, MdHelpCenter} from 'react-icons/md';
import{LuPackage2 }from 'react-icons/lu';
import{FaFileInvoice,FaUsers }from 'react-icons/fa';
import Image from 'next/image';
import image from '../../../../images/Avatar.png';
import MenuLink from './menuLink';
function Sidebar() {
    
   const menuItems = [
      {
         title: "Pages",
         list: [
            {
               title: "Dashboard",
               path: "/dashboard",
               icon:<MdDashboard/>
            },
            {
               title: "Products",
               path: "/dashboard/products",
               icon:<MdShoppingBag/>
            },
            {
               title: "Orders",
               path: "/dashboard/orders",
               icon:<LuPackage2/>
            },
            {
               title: "Invoice",
               path: "/dashboard/invoice",
               icon:<FaFileInvoice/>
            },
            {
               title: "Raw Materials",
               path: "/dashboard/raw-materials",
               icon:<MdFactory/>
            },
            {
               title: "Manage Users",
               path: "/dashboard/manage-users",
               icon:<FaUsers/>
            },
            {
               title: "Warehouse",
               path: "/dashboard/warehouse",
               icon:<MdWarehouse/>
            },

         ]
      },
      // {
      //    title: "Analytics",
      //    list: [
      //       {
      //          title: "Revenue",
      //          path: "dashboard/revenue",
      //          icon:<MdWork/>
      //       },
      //       {
      //          title: "Reports",
      //          path: "dashboard/reports",
      //          icon:<MdAnalytics/>
      //       }
      //    ]

      // },
      {
         title: "User",
         list: [
            {
               title: "Settings",
               path: "settings",
               icon:<MdOutlineSettings/>
            },
            // {
            //    title: "Help",
            //    path: "dashboard/help",
            //    icon:<MdHelpCenter/>
            // },
         ]
      }
   ]
   return (
      <>
         <div id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
            <div className='px-3'>
               <div className="  py-6 flex">
                  <Image src={image} className="mr-3"width="45" height="45" alt="User"></Image>
                  <div className='flex flex-col ml-3 text-gray-900 rounded-lg dark:text-white justify-center '>
                     <span>Unknown User</span>
                     <span className='text-xs'>Administrator</span>                 
                  </div>
               </div>
            </div>
            <div className="h-full px-3 py-4 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
               <ul className="space-y-2">
                  {menuItems.map((item, index) => (
                     <li className="relative" key={index}>
                        <span className="pb-5 text-sm text-gray-400 dark:text-white-700 ">{item.title} </span>
                        <ul className='relative'>                        
                           {item.list.map((subItem, index) => (
                               <li><MenuLink item={subItem} key={index} /></li>                               
                           ))}
                        </ul>
                     </li> 
                  ))}
                  <a className='relative cursor-pointer flex items-center mb-2 p-2 mouse-pointer
                   text-gray-500 rounded-lg dark:text-white hover:dark:text-violet-400 hover:bg-gray-100
                      dark:hover:bg-gray-700 group '>
                     <MdLogout className='mr-3'/> Logout
                  </a>
               </ul>             
            </div>
         </div>
          
      </>
   )
}
      export default Sidebar;
