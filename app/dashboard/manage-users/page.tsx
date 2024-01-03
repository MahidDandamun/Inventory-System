 
import Pagination from "../../ui/dashboard/pagination/pagination";
import { SearchInputField } from "../../ui/dashboard/inputFields/inputField";
import { AddButton } from "../../ui/dashboard/buttons/button";
// import image from '../../../images/Avatar.png';
import Link from 'next/link';
import DataTable from "../../ui/dashboard/table/table";
import { fetchUser } from "../../lib/data";

const ManageUsers= async ({searchParams})=> {
  const q= searchParams?.q || "";
  const users = await fetchUser(q);


  const tableHeaders = ["Name", "Email","Username","Password", "UserLevel"]
 
return (
  <>
    <div className="md:p-4 sm:ml-64 bg-white dark:bg-gray-900">
      <div className="rounded-lg dark:border-gray-700 mt-14 overflow-y-auto">
        <div className="relative mt-5 sm-mt-0 overflow-x-auto shadow-md sm:rounded-lg p-5">
         <h1 className="text-xl sm:py-5 md:text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Manage Users</h1>
          <div className="relative flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
            <label htmlFor="search-users" className="sr-only">Search</label>
            <SearchInputField name={"search_users"} placeholder="Search Users" />
            <Link href='/dashboard/manage-users/add'>
              <AddButton/>
            </Link>
          </div>
          <DataTable path={"manage-users"} headers={tableHeaders}  datas={users} hasImage={false}/>
         <Pagination/>  
        </div>
      </div>
    </div>
  </>
)
}

export default ManageUsers;

 