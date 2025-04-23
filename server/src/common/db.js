import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

if(!process.env.MONGO_DB_URI){
  throw new Error("MONGO_URI not found in .env");
}

const connectDB = async() => {
  try {
    
    const conn = await mongoose.connect(process.env.MONGO_DB_URI, {});
    console.log(`MongoDB connected on ${conn.connection.host}`)

  } catch (error) {
    console.log('MongoDB connection error',error);
    process.exit(1)
  }
}

export default connectDB
