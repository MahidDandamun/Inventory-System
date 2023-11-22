"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MenuLink = ({ item }) => {
  const pathname = usePathname();
  return (
    <>
      <Link href={item.path} className={`flex items-center mb-1 p-2 text-gray-900 rounded-lg
       dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group
        ${pathname === item.path ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}
       `}>        
        {item.icon}
        <span className="ms-3">{item.title}</span>
      </Link>
    </>
  )
}

export default MenuLink;