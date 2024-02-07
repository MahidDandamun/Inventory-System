'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import classNames from 'classnames';
interface MenuItem {
  path: string;
  icon: React.ReactNode;
  title: string;
 
}

interface Props {
  item: MenuItem;
  toggled: boolean;
}
const MenuLink = ({ item, toggled }: Props) => {
  const pathname = usePathname();

  const className = classNames(`flex items-center mb-2 p-2 text-gray-500 rounded-lg
  dark:text-white hover:bg-gray-100 hover:text-violet-500 dark:hover:text-violet-400 dark:hover:bg-gray-700 group 
  transitition-all duration-300 ease-in-out
   ${toggled ? 'justify-center' : ' '}
   ${
     pathname === item.path
       ? 'bg-gray-100 dark:bg-gray-700 text-violet-500  dark:text-violet-400'
       : 'bg-white dark:bg-gray-800'
   }`)
  return (
    <>
      <Link
        href={item.path}
        className={className}
      >
        {item.icon}
        {!toggled&&<span className="ms-3 font-semibold">{item.title}</span>}
      </Link>
    </>
  );
};

export default MenuLink;
