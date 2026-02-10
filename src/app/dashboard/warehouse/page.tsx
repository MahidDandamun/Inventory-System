// import React, { useEffect, useState } from 'react';

// import DataTable from '../../../components/ui/dashboard/table/table';
// import Pagination from '../../../components/ui/dashboard/pagination/pagination';
// import { RecentSales } from '../../../components/ui/recent-sales';

import Link from 'next/link';

import { AddButton } from '../../../components/ui/dashboard/buttons/button';
import { getWarehouses } from '../../../data/warehouse';
import { DataTableFull } from '../../../components/ui/custom/data-table-full';
import { columns } from '../../../components/ui/custom/columns';
import { ColumnDef } from '@tanstack/react-table';
import { taskSchema } from '../../../schemas';
import { z } from 'zod';
import path from 'path';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../../components/ui/card';

// type Warehouses = {
//   id: string;
//   location: string;
//   status: 'ACTIVE' | 'INACTIVE';
// };

// const columns: ColumnDef<Warehouses>[] = [
//   {
//     accessorKey: 'location',
//     header: 'Location',
//   },
//   {
//     accessorKey: 'status',
//     header: 'Status',
//   },
// ];
 
const WarehousePage = async () => {
  const wareHouses = await getWarehouses();
  console.log(wareHouses);

  return (
    <>
      <div className="pt-6 pl-2">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Warehouses</h2>
              <p className="text-muted-foreground">
                Here's the list of warehouses
              </p>
            </div>
            <Link href="/dashboard/warehouse/add">
              <AddButton />
            </Link>
          </div>
          <DataTableFull data={wareHouses} columns={columns} />
        </div>
 
      </div>
    </>
  );
};

export default WarehousePage;
