import dotenv from "dotenv";
import { createObjectId } from "./utils/createObjectId.js";
import { getConnection } from "./connection/conn.js";

dotenv.config();

const DB = process.env.MONGO_DATABASE;
const STATIONS = "stations";

async function findBySerialNumber(serialNumber) {
  const filter = { serial_number: serialNumber };
  return await find(filter);
}

async function findById(id) {
  const objectId = createObjectId(id);
  const clientMongo = await getConnection();
  const result = await clientMongo
    .db(DB)
    .collection(STATIONS)
    .findOne({ _id: objectId });
  return result;
}

async function find(filter) {
  const connection = await getConnection();
  const station = await connection
    .db(DB)
    .collection(STATIONS)
    .findOne(filter);
  return station;
}

async function create(station) {
  const clientMongo = await getConnection();
  const result = await clientMongo
    .db(DB)
    .collection(STATIONS)
    .insertOne(station);
  return result;
}

async function update(id, station) {
  const objectId = createObjectId(id);
  const filter = { _id: objectId };
  const updateDoc = { $set: station };
  const clientMongo = await getConnection();
  const result = await clientMongo
    .db(DB)
    .collection(STATIONS)
    .updateOne(filter, updateDoc);
  return result;
}

async function findAll(filterStation) {
  
  const filter = {};

  if (filterStation.name) {
    filter.name = filterStation.name;
  }
  if (filterStation.serialNumber) {
    filter.serial_number = filterStation.serialNumber;
  }
  if (filterStation.status) {
    filter.status = filterStation.status;
  }
  if (filterStation.date) {
    const gte = new Date(filterStation.date);
    const lt = new Date(gte.getTime() + 24 * 60 * 60 * 1000);

    filter.created_at = {
      $gte: gte,
      $lt: lt,
    };
  }
  if (filterStation.userId) {
    filter.created_by = parseInt(filterStation.userId);
  }

  const clientMongo = await getConnection();

  const skip = filterStation.pageSize * filterStation.page;
  let limit = filterStation.pageSize;

  const result = await clientMongo
    .db(DB)
    .collection(STATIONS)
    .find(filter)
    .limit(limit)
    .skip(skip)
    .toArray();

  return result;
}

export { findBySerialNumber, create, findById, findAll, update };
