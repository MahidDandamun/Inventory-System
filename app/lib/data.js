import { Warehouse, User } from "./models";
import  {connectToDB}  from "./utils";
 

export const fetchWarehouse = async () => {
  try {
    connectToDB();
 
    const warehouses = await Warehouse.find();
    return warehouses;
  } catch (err) {
    console.log(err)
    throw new Error("Failed fetching warehouses!")
  }
}
export const fetchUser = async () => {
  try {
    connectToDB();
    const users = await User.find();
    return users;

    } catch (err) {
      console.log(err)
      throw new Error("Failed fetching users!")
    }
}