import dotenv from "dotenv";
import {getConnection} from './connection/conn.js'

dotenv.config();

const DB = process.env.DB;
const REQUESTS = "requests";

async function create(request) {
  const clientMongo = await getConnection();
  const result = await clientMongo
    .db(DB)
    .collection(REQUESTS)
    .insertOne(request);
  return result;
}

export { create };
