"use client"
import { logout } from '../../../actions/logout';
import {useCurrentUser} from '../../../hooks/use-current-user';
 
 
import {useSession} from "next-auth/react";

const SettingsPage =  () => {
  const user = useCurrentUser();

  const onClick = () => {
    logout();
  }
  return (
    <> 
      <div className="md:p-4 sm:ml-64 bg-white dark:bg-gray-900">
        <div className="rounded-lg dark:border-gray-700 mt-14 overflow-y-auto"> 
          <h1 className="sm:ml-64 mt-20">Settings Page</h1>
         
          <button onClick={onClick} type="submit" className="w-sm bg-violet-500 rounded-md py-2 px-4 text-white hover:bg-violet-600 ease">
          Logout
          </button>
        </div>
      </div>
 
    </>
  )
}

export default SettingsPage;