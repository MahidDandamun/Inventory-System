'use client';
 
import { RxHamburgerMenu } from "react-icons/rx";
import classNames from 'classnames';
import { UserButton } from '../../../auth/user-button';
import { useSideBarToggle } from '../../../../hooks/use-sidebar-toggle';
import  ThemeSwitcher from '../../theme-switcher';




function Navbar( ) {
  const buttonToggle = classNames("flex order-2 sm:order-1 items-center dark:bg-white dark:bg-violet-500 shadow-0 rounded-md transition ease-in duration-300 justify-center w-10 h-10  bg-violet-200  ")

  const buttonUser = classNames("flex items-center justify-between sm:order-2 order-1");
  
  const {toggleCollapse, invokeToggleCollapse} = useSideBarToggle();
    const navCn = classNames("flex items-center fixed transition-all duration-300 ease-in-out h-20 px-2 sm:px-12 top-0 z-40 w-full bg-white border-b border-gray-200 dark:bg-[#070D1C] dark:border-gray-700", {
    
    ["sm:pl-[16rem]"]:!toggleCollapse,
    ["sm:pl-[5rem]"]: toggleCollapse,
    
  })

  const sideBarToggle = () => {
    invokeToggleCollapse();
  }

  return (
    <>
      <nav className={navCn}>
          <div className="flex items-center h-full p4-11 bg-white dark:bg-[#070D1C] justify-between w-full lg:px-5 lg:pl-3 ">
      
            <button onClick={sideBarToggle} className={buttonToggle}>
              <RxHamburgerMenu size={24} className="dark:text-violet-600 text-violet-600"/>
            </button>
            
            <div className={buttonUser}>
              <div className="p-2">
                
                <ThemeSwitcher/>
              </div> 
              <div className="h-10 w-10 rounded-full bg-bg-sidebar-muted flex items-center justify-center text-center">
                 <UserButton />
              </div>

            </div>

            
          </div>
      </nav>
    </>
  );
}
export default Navbar;