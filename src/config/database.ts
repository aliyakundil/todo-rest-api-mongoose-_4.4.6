import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

let uri = process.env.MONGODB_URI!;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

export async function connectToDb() {
  await mongoose.connect(uri)
}