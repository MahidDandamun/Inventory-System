import { db } from '../lib/db';

export async function getWarehouses() {
  try {
    const warehouses = await db.warehouse.findMany();
    return warehouses;
  } catch {
    return null;
  }
}
