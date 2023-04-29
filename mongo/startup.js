import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB = process.env.MONGO_DB;

const REQUEST_COLLECTION = 'requests';
const STATION_COLLECTION = 'stations';

const MONGODB_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@localhost:${MONGO_PORT}/${MONGO_DB}`
//Script to initialice DB with collections

const closeDatabase = () => {
    mongoose.connection.close()
      .then(() => {
        console.log('Database connection closed.');
      })
      .catch((err) => {
        console.error('Error closing database connection:', err);
      });
  };

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const requestsExists = collections.some((col) => col.name === REQUEST_COLLECTION);
    const stationsExists = collections.some((col) => col.name === STATION_COLLECTION);

    if (!requestsExists) {
      await db.createCollection(REQUEST_COLLECTION);
      console.log(`Collection "${REQUEST_COLLECTION}" created.`);
    }

    if (!stationsExists) {
      await db.createCollection(STATION_COLLECTION);
      console.log(`Collection "${STATION_COLLECTION}" created.`);
    }

    if (!requestsExists || !stationsExists) {
      console.log('Collections created.');
    } else {
      console.log('Collections already exist.');
    }

    console.log('Database and collections setup complete.');
    closeDatabase();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
