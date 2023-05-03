import dotenv from "dotenv";
import { create } from "../data/requestData";
import { exists } from "./stationService";
import {StationAlreadyExistsError} from "../error/stationAlreadyExistsError"
import { RequestStationStatus } from "../model/enum/requestStationStatus";

dotenv.config();

function add(request, userid) {
  if (!exists(request.serialNumber)) {
    const fullRequest = {
      serial_number: request.serialNumber,
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
    create(fullRequest);
  } else {
    console.log(
      `Station serial number ${request.serialNumber} already exists.`
    );
    throw new StationAlreadyExistsError(request.serialNumber);
  }
}

export { add };
