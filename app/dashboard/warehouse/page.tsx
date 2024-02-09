// import React, { useEffect, useState } from 'react';

import DataTable from '../../../components/ui/dashboard/table/table';
import Pagination from '../../../components/ui/dashboard/pagination/pagination';
import Link from 'next/link';
import { SearchInputField } from '../../../components/ui/dashboard/inputFields/inputField';
import { AddButton } from '../../../components/ui/dashboard/buttons/button';

const WarehousePage = () => {
  const tableHeaders = ['Location', 'Status'];
  const warehouses = [
    {
      Location: 'Makati City',
      Status: 'Active',
    },
    {
      Location: 'Taguig City',
      Status: 'Active',
    },
    {
      Location: 'Manadaluyong City',
      Status: 'Active',
    },
    {
      Location: 'Quezon City',
      Status: 'Active',
    },
  ];
  return (
    <>
      <div className="pt-6 pl-2">
        <h1 className="text-xl sm:py-5 md:text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
          Warehouse
        </h1>
        <div className="relative flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
          <label htmlFor="search-users" className="sr-only">
            Search
          </label>
          <SearchInputField
            name={'search_warehouse'}
            placeholder="Search Warehouse"
          />
          <Link href="/dashboard/warehouse/add">
            <AddButton />
          </Link>
        </div>
        <DataTable
          path={'warehouse'}
          headers={tableHeaders}
          datas={warehouses}
          hasImage={false}
        />
        <Pagination />
      </div>
    </>
  );
};

export default WarehousePage;
