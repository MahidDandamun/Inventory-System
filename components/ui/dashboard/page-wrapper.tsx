'use client'
import classNames from 'classnames';
import { useSideBarToggle } from '../../../hooks/use-sidebar-toggle';

interface Props { 
  children: React.ReactNode;

}

export default function PageWrapper({ children }: Props) {
  const { toggleCollapse } = useSideBarToggle();
  const bodyStyle = classNames("bg-background h-full flex-grow pt-20 px-4  transition-all duration-300 ease-in-out",
      {
        ["sm:pl-[16.5rem]"]: !toggleCollapse,
        ["sm:pl-[5.4rem]"]: toggleCollapse,
      });
  return (
  
      <div className={bodyStyle}>
        {children}
      </div>
    
  )
}