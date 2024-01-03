 
import mongoose from "mongoose";

 

const productSchema = new mongoose.Schema({
  Image: {
    type: String
  },
  Sku: {
    type: Number,
    unique: true,
    require: true
  },
  Name: {
    type: String,
    min: 5,
    max: 30,
    Unique: true,
    require: true
  },
  Price: {
    type: Number,
    require: true
  },
  Quantity: {
    type: Number,
    require: true,
  },
  Warehouse: {
    type: String,
    required:true 
  }
}, { timestamps: true });

const rawMaterialSchema = new mongoose.Schema({
  Image: {
    type: String,
  },
  Name: {
    type: String,
    min: 3,
    max: 30,
    unique: true,
  },
  Price: {
    type: Number,
    required: true
  },
  Quantity: {
    type: Number,
    required: true
  },
  Warehouse: {
    type: String,
    required:true 
  },
  Supplier: {
    type: String,
    required:true 
  }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  Image: {
    type:String
  },
  Name: {
    type: String,
    required: true,
    min: 3,
    max: 30
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    min: 8,
    max: 30
  },
  Username: {
    type: String,
    required: true,
    unique: true,
    min: 8,
    max: 30
  },
  Password: {
    type: String,
    required: true,
    min: 8,
    max: 30
  },
  UserLevel: {
    type: String,
    required: true,
  }
}, { timestamps: true });


const warehouseSchema = new mongoose.Schema({
  Location: {
    type: String,
    required:true
  },
  Status: {
    type: String,
    required: true
  }
}, { timestamps: true });

 
 
export  const Warehouse = mongoose.models.Warehouse || mongoose.model("Warehouse", warehouseSchema);
export  const User = mongoose.models.User || mongoose.model("User", userSchema);
export  const RawMaterial = mongoose.models.RawMaterial || mongoose.model("RawMaterial", rawMaterialSchema);
export  const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
 
 
 
  
