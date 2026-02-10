import Pagination from '../../../components/ui/dashboard/pagination/pagination';
import { SearchInputField } from '../../../components/ui/dashboard/inputFields/inputField';
import { AddButton } from '../../../components/ui/dashboard/buttons/button';
import Link from 'next/link';
import DataTable from '../../../components/ui/dashboard/table/table';

const ManageUsers = () => {
  const tableHeaders = ['Name', 'Email', 'Username', 'Password', 'UserLevel'];
  const users = [
    {
      Name: 'John Doe',
      Email: 'johndoe@example.com',
      Username: 'johndoe',
      Password: '********',
      UserLevel: 'Admin',
    },
    {
      Name: 'Jane Smith',
      Email: 'janesmith@example.com',
      Username: 'janesmith',
      Password: '********',
      UserLevel: 'User',
    },
    // Add more user objects as needed
  ];

  return (
    <>
      <div className="pt-6 pl-2">
        <h1 className="text-xl sm:py-5 md:text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
          Manage Users
        </h1>
        <div className="relative flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
          <label htmlFor="search-users" className="sr-only">
            Search
          </label>
          <SearchInputField name={'search_users'} placeholder="Search Users" />
          <Link href="/dashboard/manage-users/add">
            <AddButton />
          </Link>
        </div>
        <DataTable
          path={'manage-users'}
          headers={tableHeaders}
          datas={users}
          hasImage={false}
        />
        <Pagination />
      </div>
    </>
  );
};

export default ManageUsers;
