"use client";
// import image from '../../../../images/Avatar.png';
import logo from '../../../../images/theiapollo-logo.jpg' 
import Image from 'next/image';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { IoIosSunny } from 'react-icons/io';
import {RiMoonClearFill} from 'react-icons/ri';
import useDarkMode from '../useDarkMode/useDarkmode';
// import { data-drawer - target} from '../../../../styles/tailwindcss/tailwind.css';
function ThemeIcon() {
   const [darkTheme, setDarkTheme] = useDarkMode();
   const handleMode = () => setDarkTheme(!darkTheme);
   return (
      <button className="justify-center rounded-full text-gray-500"onClick={handleMode}>
            {darkTheme ? (
            <IoIosSunny size='30' className='top-navigation-icon hover:text-yellow-300 ease-linear duration-300  ' />
            ) : (
            <RiMoonClearFill size='30' className='top-navigation-icon hover:text-purple-500 ease-linear duration-300  ' />
            )}
         </button>
      );
      
}
function Navbar() {
  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-transform">
            <div className="px-3 py-3 lg:px-5 lg:pl-3 drop-shadow-md shadow-sm">
               <div className="flex items-center justify-between">
                  <div className="flex items-center justify-start rtl:justify-end ">
                    <button data-drawer-target="logo-sidebar"
                       data-drawer-toggle="logo-sidebar"
                       aria-controls="logo-sidebar" type="button"
                       className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden
                        hover:bg-gray-100 focus:outline-none focus:ring-2
                        focus:ring-gray-200 dark:text-gray-400
                        dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                        <span className="sr-only">Open sidebar</span>
                        <HiOutlineMenuAlt2 size='24' className='top-navigation-icon hover:text-purple-500 ease-linear duration-300' /> 
                  </button>
                  <a className="flex ms-2 md:me-24">
                     <Image src={logo} className="hidden me-8 rounded-full w-12 h-12 sm:inline-flex bg-red-400"   alt="Theiapollo Logo"></Image> 
                     <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Theiapollo</span>
                  </a>
                 </div>
                 <div>
                     <ThemeIcon />
                 </div>
 
               </div>
            </div>
      </nav>
    </>
  )
}
export default  Navbar;