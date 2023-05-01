import conn from "./conn";
import { ObjectId } from "mongodb";
const DB = process.env.DB;
const REQUESTS = "requests";

async function postRequest(request) {
  const clientMongo = await conn.getConnection();
  const result = await clientMongo
    .db(DB)
    .collection(REQUESTS)
    .insertOne(request);
  return result;
}

export { postRequest };
