import conn from "./connection/conn";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

dotenv.config();

const DB = process.env.DB;
const REQUESTS = "requests";

async function create(request) {
  const clientMongo = await conn.getConnection();
  const result = await clientMongo
    .db(DB)
    .collection(REQUESTS)
    .insertOne(request);
  return result;
}

export { create };
