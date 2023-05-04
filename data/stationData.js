import dotenv from "dotenv";
import {getConnection} from './connection/conn.js'

dotenv.config();

const DB = process.env.MONGO_DATABASE;
const STATIONS = "stations";

async function find(serialNumber){
    const connection = await getConnection();
    const station = await connection
                        .db(DB)
                        .collection(STATIONS)
                        .findOne({serial_number: serialNumber})
    return station;
}

export {find}