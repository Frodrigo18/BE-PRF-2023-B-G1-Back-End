import dotenv from "dotenv";
import {createObjectId} from './utils/createObjectId.js';
import {getConnection} from './connection/conn.js';

dotenv.config();

const DB = process.env.MONGO_DATABASE;
const REQUESTS = "requests";

async function create(request) {
  const clientMongo = await getConnection();
  const result = await clientMongo
    .db(DB)
    .collection(REQUESTS)
    .insertOne(request);
  return result;
}

async function findById(id){
  const objectId = createObjectId(id);
  const clientMongo = await getConnection();
  const result = await clientMongo
    .db(DB)
    .collection(REQUESTS)
    .findOne({_id: objectId})
return result;
}

async function findBySerialNumber(serialNumber){
  const clientMongo = await getConnection();
  const result = await clientMongo
    .db(DB)
    .collection(REQUESTS)
    .findOne({serial_number: serialNumber})
return result;
}

export { create, findById, findBySerialNumber};
