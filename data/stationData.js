import dotenv from "dotenv";
import {createObjectId} from './utils/createObjectId.js';
import {getConnection} from './connection/conn.js'

dotenv.config();

const DB = process.env.MONGO_DATABASE;
const STATIONS = "stations";

async function findBySerialNumber(serialNumber){
    const filter = {serial_number: serialNumber}
    return await find(filter);
}

async function findById(id){
    const objectId = createObjectId(id);
    const filter = {_id: objectId}
    return await find(filter);
}

async function find(filter){
    const connection = await getConnection();
    const station = await connection
                        .db(DB)
                        .collection(STATIONS)
                        .findOne({filter})
    return station;
}

async function create(station){
    const clientMongo = await getConnection();
    const result = await clientMongo
      .db(DB)
      .collection(STATIONS)
      .insertOne(station);
    return result;
}

export {findBySerialNumber, create, findById}