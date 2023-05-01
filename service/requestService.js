import dotenv from "dotenv";
import { create } from "../data/requestData";
import { exists } from "./stationService";

dotenv.config();

function add(request, userid) {
  if (exists(request.serialNumber)) {
    create(request);
  } else {
    console.log(
      `Station serial number ${request.serialNumber} already exists. \n Error: ${userJson}`
    );
    throw new AlreadyExistsStation(
      `Station serial number ${request.serialNumber} already exists`
    );
  }
}

export { add };
