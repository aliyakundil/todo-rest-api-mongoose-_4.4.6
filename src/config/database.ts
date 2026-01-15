import dotenv from "dotenv";
import  { MongoClient, Db } from "mongodb"; // позволяет подключиться к БД

dotenv.config();

let uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

// пул соединения
const client = new MongoClient(uri, {
  maxPoolSize: 10, // максимум 10 соединений в пул
  minPoolSize: 2,  // минимум 2 соединения
  serverSelectionTimeoutMS: 5000, // таймаут ожидания сервера
});

let db: Db;
let isConnected = false;  // статус подключения

export async function connectToDb(retries = 5, delay = 2000) : Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await client.connect();
      db = client.db();
      isConnected = true;
      console.log("Connected to MongoDB");
      return
    } catch(err: any) {
      console.error(`MongoDB connection failed (attempt ${i + 1}):`, (err as Error).message);
        isConnected = false;

      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`)
        await new Promise(res => setTimeout(res, delay))
      } else {
      throw err;
      }
    }
  }
}

export function getDb(): Db {
  if (!db) throw new Error("Database not connected yet");
  return db;
}


export function getDbStatus() {
  return {
    status: isConnected ? "OK" : "ERROR",
    db: isConnected ? "connected" : "disconnected",
  }
}