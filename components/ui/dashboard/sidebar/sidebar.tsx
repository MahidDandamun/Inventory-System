'use client';
// import { useTheme } from "next-themes"
// import 
import {
  MdDashboard,
  MdShoppingBag,
  MdFactory,
  MdWarehouse,
  MdLogout,
  MdWork,
  MdAnalytics,
  MdOutlineSettings,
  MdHelpCenter,
} from 'react-icons/md';
import { LuPackage2 } from 'react-icons/lu';
import { FaFileInvoice, FaUsers } from 'react-icons/fa';
import {useState, useEffect} from 'react'
 
import MenuLink from './menuLink';
// import { FaChevronLeft } from 'react-icons/fa';

// import { useSession } from 'next-auth/react';

import logo from '../../../../images/Theiapollo Logo.png';
import Image from 'next/image';
import classNames from 'classnames';

import { useSideBarToggle } from '../../../../hooks/use-sidebar-toggle';
// import { ThemeProvider } from '../theme-provider';

const Sidebar = () => {
  const [mounted, setMounted] = useState(false);
  const {toggleCollapse} = useSideBarToggle();


  const asideStyle = classNames("sidebar fixed top-0 left-0 z-50 w-[16rem] h-full pt-16 bg-white dark:bg-[#070D1C] border-r overflow-y-auto  border-gray-200 sm:translate-x-0 dark:border-gray-700 dark:text-white transition-all duration-300 ease-in-out",
    {
      ["sm:w-[5rem]"]: toggleCollapse,
      ["w-[16rem]"]: !toggleCollapse,

    });
  const imageSize = classNames("object-fit",{
    ["h-[8rem] w-[13rem]"]:!toggleCollapse

  })
  useEffect(() => setMounted(true), []);
  const menuItems = [
    {
      title: 'Pages',
      list: [
        {
          title: 'Dashboard',
          path: '/dashboard',
          icon: <MdDashboard />,
        },
        {
          title: 'Products',
          path: '/dashboard/products',
          icon: <MdShoppingBag />,
        },
        {
          title: 'Orders',
          path: '/dashboard/orders',
          icon: <LuPackage2 />,
        },
        {
          title: 'Invoice',
          path: '/dashboard/invoice',
          icon: <FaFileInvoice />,
        },
        {
          title: 'Raw Materials',
          path: '/dashboard/raw-materials',
          icon: <MdFactory />,
        },
        {
          title: 'Manage Users',
          path: '/dashboard/manage-users',
          icon: <FaUsers />,
        },
        {
          title: 'Warehouse',
          path: '/dashboard/warehouse',
          icon: <MdWarehouse />,
        },
      ],
    },
    // {
    //    title: "Analytics",
    //    list: [
    //       {
    //          title: "Revenue",
    //          path: "/dashboard/revenue",
    //          icon:<MdWork/>
    //       },
    //       {
    //          title: "Reports",
    //          path: "/dashboard/reports",
    //          icon:<MdAnalytics/>
    //       }
    //    ]

    // },
    {
      title: 'User',
      list: [
        {
          title: 'Settings',
          path: '/dashboard/settings',
          icon: <MdOutlineSettings />,
        },
        // {
        //    title: "Help",
        //    path: "/dashboard/help",
        //    icon:<MdHelpCenter/>
        // },
      ],
    },
  ];
  // const { setTheme, theme } = useTheme()

  // const isActive = (themeName: string) => {
  //     return (theme === themeName && <CheckIcon
  //         className='ml-2 h-4 w-4'
  //     />)
  // }
  return (
    <>
      <div className={asideStyle} aria-label="Sidebar">
        <div className="sidebar-top object-cover relative  w-full h-2/12 pt-4 px-3 flex justify-center">
          
            <Image
              loading='lazy'
              src={logo}
              className={imageSize}
              alt="Theiapollo Logo"
            >
            </Image>
          
        </div>
        <div className="h-8/12 px-3 py-4 pb-4 overflow-y-auto bg-white dark:bg-[#070D1C]">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li className="relative" key={index}>
{           !toggleCollapse && <span className="pb-5 text-sm text-gray-400 dark:text-white-700 ">
                  {item.title} 
                </span>}
                <ul className="relative">
                  {item.list.map((subItem, index) => (
                    <li key={index}>
                      <MenuLink toggled={toggleCollapse} item={subItem} />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
