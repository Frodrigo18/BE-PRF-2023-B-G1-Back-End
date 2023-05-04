import dotenv from "dotenv";
import mongodb from "mongodb";

dotenv.config();

const mongoclient = mongodb.MongoClient;
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_PORT = process.env.MONGO_PORT;

const uri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo:${MONGO_PORT}/?authMechanism=DEFAULT`
const client = new mongoclient(uri);

let instance = null;

async function getConnection() {
  if (instance == null) {
    instance = await client.connect();
  }
  return instance;
}

export { getConnection };
