import mongoose from "mongoose";

 

// const productsSchema = new mongoose.Schema({
//   image: {
//     type: String
//   },
//   sku: {
//     type: Number,
//     unique: true,
//     require: true
//   },
//   name: {
//     type: String,
//     min: 5,
//     max: 30,
//     Unique: true,
//     require: true
//   },
//   price: {
//     type: Number,
//     require: true
//   },
//   quantity: {
//     type: Number,
//     require: true,
//   },
//   warehouse: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Warehouse' // Reference to the warehouseSchema
//   }
// }, { timestamps: true });

// const rawMaterialSchema = new mongoose.Schema({
//   image: {
//     type: String,
//   },
//   name: {
//     type: String,
//     min: 3,
//     max: 30,
//     unique: true,
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true
//   },
//   warehouse: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Warehouse' // Reference to the warehouseSchema
//   }
// }, { timestamps: true });

const userSchema = new mongoose.Schema({
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
 
 
 
  
