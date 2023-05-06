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

async function findAll(filterRequests){

    const filter = {};

    if (filterRequests.name) {
      filter.name = filterRequests.name;
    } 
    if (filterRequests.serialNumber) {
      filter.serial_number = filterRequests.serialNumber;
    }
    if (filterRequests.status) {
      filter.status = filterRequests.status;
    }
    if (filterRequests.date) {
      const gte = new Date(filterRequests.date);
      const lt = new Date(gte.getTime() + 24 * 60 * 60 * 1000) ;

      filter.created_at = { 
        $gte: gte,
        $lt: lt
      }
    }

    console.log("data filter ", filter);

    const clientMongo = await getConnection();
    const count = await clientMongo
      .db(DB)
      .collection(REQUESTS)
      .countDocuments();
  
    const skip = filterRequests.pageSize * filterRequests.page;
    let limit = filterRequests.pageSize;

    if ( count - skip < 0) {
      limit = count - filterRequests.pageSize * (filterRequests.page -1);
    } 
      
    const result = await clientMongo
      .db(DB)
      .collection(REQUESTS)
      .find(filter)
      .limit(limit)
      .skip(skip)
      .toArray();
  
    return result;
  
}

export { create, findById, findBySerialNumber, findAll};
