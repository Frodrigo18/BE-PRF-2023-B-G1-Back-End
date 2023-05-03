import dotenv from "dotenv";
import mongodb from "mongodb";

dotenv.config();

const mongoclient = mongodb.MongoClient;
const uri = process.env.MONGODB;
const client = new mongoclient(uri);

let instance = null;

async function getConnection() {
  if (instance == null) {
    instance = await client.connect();
  }
  return instance;
}

export { getConnection };
