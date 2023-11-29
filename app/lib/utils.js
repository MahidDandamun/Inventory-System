// import mongoose,{mongo} from "mongoose";

// export async function connectToDB(){

//   if (mongoose.connection.readyState === 1) {
//     return mongoose.connection.asPromise();
//   }

//   return await mongoose.connect(process.env.MONGODB_URL);

// }

import mongoose from "mongoose";

export const connectToDB = async () => {
  const connection = {};
  try {
    if (connection.isConnected) return;
    const db = await mongoose.connect(process.env.MONGODB_URL);
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    throw new Error(error);
  }
}
 