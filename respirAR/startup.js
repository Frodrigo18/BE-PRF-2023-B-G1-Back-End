import mongoose from "mongoose";

const MONGODB_URI = 'mongodb://mongo/respirAR';


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
    const requestsExists = collections.some((col) => col.name === 'requests');
    const stationsExists = collections.some((col) => col.name === 'stations');

    if (!requestsExists) {
      await db.createCollection('requests');
      console.log('Collection "requests" created.');
    }

    if (!stationsExists) {
      await db.createCollection('stations');
      console.log('Collection "stations" created.');
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
