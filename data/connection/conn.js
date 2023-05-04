import dotenv from "dotenv";
import mongodb from "mongodb";
import {DatabaseConnectionError} from "../error/databaseConnectionError.js";

dotenv.config();

const mongoclient = mongodb.MongoClient;
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_PORT = process.env.MONGO_PORT;

const uri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo:${MONGO_PORT}/?authMechanism=DEFAULT`
const client = new mongoclient(uri);

let instance = null;

async function getConnection() {
  try{
    if (instance == null) {
      instance = await client.connect();
    }
  }catch (error){
    console.log(error.message);
    throw new DatabaseConnectionError("An error occurred while connecting to database")
  }

  return instance;
}

export { getConnection };
