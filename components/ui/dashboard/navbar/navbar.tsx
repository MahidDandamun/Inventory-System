'use client';
 
import { RxHamburgerMenu } from "react-icons/rx";
import classNames from 'classnames';
import { UserButton } from '../../../auth/user-button';
import { useSideBarToggle } from '../../../../hooks/use-sidebar-toggle';
 




function Navbar( ) {
  const buttonToggle = classNames("flex order-2 sm:order-1 items-center bg-gray-200/90 shadow-0 rounded-md transition ease-in duration-300 justify-center w-10 h-10 hover:bg-gray-100/85")

  const buttonUser = classNames("flex order-1 sm:order-2");
  
  const {toggleCollapse, invokeToggleCollapse} = useSideBarToggle();
    const navCn = classNames("fixed flex  justify-between transition-all duration-300 ease-in-out top-0 z-40 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700", {
    
    ["sm:pl-[16rem]"]:!toggleCollapse,
    ["sm:pl-[5rem]"]: toggleCollapse,
    
  })

  const sideBarToggle = () => {
    invokeToggleCollapse();
  }

  return (
    <>
      <nav className={navCn}>
          <div className="flex px-3 py-3 pr-4 w-full lg:px-5 lg:pl-3 drop-shadow-md shadow-smflex items-center justify-between">
      
            <button onClick={sideBarToggle} className={buttonToggle}>
              <RxHamburgerMenu size={24} className="text-violet-600 dark:text-white"/>
            </button>
            
            <div className={buttonUser}>
              <UserButton/>
            </div>
            
          </div>
      </nav>
    </>
  );
}
export default Navbar;