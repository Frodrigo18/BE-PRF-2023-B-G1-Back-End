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
  const filter = { _id: objectId };
  return await find(filter);
}

async function find(filter) {
  const connection = await getConnection();
  const station = await connection
    .db(DB)
    .collection(STATIONS)
    .findOne({ filter });
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

async function findAll(filterRequests) {
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
    const lt = new Date(gte.getTime() + 24 * 60 * 60 * 1000);

    filter.created_at = {
      $gte: gte,
      $lt: lt,
    };
  }

  const clientMongo = await getConnection();

  const skip = filterRequests.pageSize * filterRequests.page;
  let limit = filterRequests.pageSize;

  const result = await clientMongo
    .db(DB)
    .collection(STATIONS)
    .find(filter)
    .limit(limit)
    .skip(skip)
    .toArray();

  return result;
}

export { findBySerialNumber, create, findById, findAll };
