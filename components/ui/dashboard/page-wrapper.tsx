'use client'
import classNames from 'classnames';
import { useSideBarToggle } from '../../../hooks/use-sidebar-toggle';

interface Props { 
  children: React.ReactNode;

}

export default function PageWrapper({ children }: Props) {
  const { toggleCollapse } = useSideBarToggle();
  const bodyStyle = classNames("bg-background flex-grow mt-16 px-4 transition-all duration-300 ease-in-out",
      {
        ["pl-[16.5rem]"]: !toggleCollapse,
        ["pl-[6.4rem]"]: toggleCollapse,
      });
  return (
    <div>
      <div className={bodyStyle}>
        {children}
      </div>
    </div>
  )
}