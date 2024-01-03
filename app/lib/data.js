import { Warehouse, User, RawMaterial, Product } from "./models";
import  {connectToDB}  from "./utils";
 
connectToDB();
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

export const fetchRmaterial = async (q) => {
  
  connectToDB();
  const regex = new RegExp(q,"i")
  try {
    const rawmaterials = await RawMaterial.find({Name:{$regex:regex}});
    return rawmaterials;

    } catch (err) {
      console.log(err)
      throw new Error("Failed fetching raw materials!")
    }
}

export const fetchProduct = async (q) => {
  
  connectToDB();
  const regex = new RegExp(q,"i")
  try {
    const products = await Product.find({Name:{$regex:regex}});
    return products;

    } catch (err) {
      console.log(err)
      throw new Error("Failed fetching raw products!")
    }
}