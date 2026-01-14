import dotenv from "dotenv";
import  { MongoClient, Db } from "mongodb"; // позволяет подключиться к БД

dotenv.config();

let uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

const client = new MongoClient(uri);

let db: Db;

export function connectToDb(cb: (err?: Error) => void) {
  client.connect()
    .then(() => {
      db = client.db();
      console.log("Connect to MongoDB")
      cb();
    })
    .catch((err: Error) => {
      console.error("MongoDB connection failed:", err.message);
      cb(err);
    })
}

export function getDb(): Db {
  if (!db) throw new Error("Database not connected yet");
  return db;
}