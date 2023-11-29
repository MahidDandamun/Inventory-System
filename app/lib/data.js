import { Warehouse, User } from "./models";
import  {connectToDB}  from "./utils";
 

export const fetchWarehouse = async (q) => {
  const regex = new RegExp(q,"i")
  try {
    const warehouses = await Warehouse.find({Location:{$regex:regex}});
    return warehouses;
  } catch (err) {
    console.log(err)
    throw new Error("Failed fetching warehouses!")
  }
}
export const fetchUser = async (q) => {
  const regex = new RegExp(q,"i")
  try {
 
    const users = await User.find({Name:{$regex:regex}});
    return users;

    } catch (err) {
      console.log(err)
      throw new Error("Failed fetching users!")
    }
}