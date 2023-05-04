import dotenv from "dotenv";
import { create, findById } from "../data/requestData.js";
import { exists as existsStation} from "./stationService.js";
import {StationAlreadyExistsError} from "./error/stationAlreadyExistsError.js"
import { RequestStationStatus } from "../model/enum/requestStationStatus.js";
import { findBySerialNumber } from "../data/requestData.js";

dotenv.config();

async function add(request, userid) {
  if (!(await existsStation(request.serial_number)) && !(await _exist(request.serial_number))) {
    const fullRequest = {
      serial_number: request.serial_number,
      name: request.name,
      longitud: request.longitud,
      latitude: request.latitude,
      brand: request.brand,
      model: request.model,
      status: RequestStationStatus.PENDING,
      created_by: userid,
      created_at: new Date(),
      approved_by: null,
      approved_at: null
    }
    const newRequest = await create(fullRequest);
    return await findById(newRequest.insertedId)
  } else {
    console.log(
      `Station serial number ${request.serial_number} already exists.`
    );
    throw new StationAlreadyExistsError(request.serial_number);
  }
}

async function _exist(serialNumber){
  const request = await findBySerialNumber(serialNumber);
  return (request != null && request.status != RequestStationStatus.REJECTED)
}

export { add };
