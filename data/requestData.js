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

    const clientMongo = await getConnection();

    const skip = filterRequests.pageSize * filterRequests.page;
    let limit = filterRequests.pageSize;
      
    const result = await clientMongo
      .db(DB)
      .collection(REQUESTS)
      .find(filter)
      .limit(limit)
      .skip(skip)
      .toArray();
  
    return result;
}

async function approve(id, userId, state){
  const update = {
    $set: 
    { 
      "status": state,
      "approved_by": parseInt(userId),
      "approved_at": new Date()
    }
  }

  return await _updateStatus(id, update);
}

async function reject(id, state){
  const update = {
    $set: 
    { 
      "status": state
    }
  }
  return await _updateStatus(id, update);
}

async function _updateStatus(id, update){
  const objectId = createObjectId(id);
  const clientMongo = await getConnection();
  const result = await clientMongo
    .db(DB)
    .collection(REQUESTS)
    .updateOne({_id: objectId}, update)
  return result;
}

export { create, findById, findBySerialNumber, findAll, approve, reject};
