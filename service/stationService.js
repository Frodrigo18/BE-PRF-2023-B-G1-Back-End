import { findBySerialNumber, create, findById,findAll, update } from "../data/stationData.js";
import { Rol } from "../model/enum/rol.js";
import {StationStatus} from "../model/enum/stationStatus.js"
import {StationNotFoundError} from "./error/stationNotFoundError.js"

async function exists(serialNumber) {
  const station = await findBySerialNumber(serialNumber);
  return station != null && station.status != StationStatus.INACTIVE;
}

async function add(request, userId) {
  const fullStation = {
    serial_number: request.serial_number,
    name: request.name,
    longitud: request.longitude,
    latitud: request.latitud,
    brand: request.brand,
    model: request.model,
    status: StationStatus.ACTIVE,
    created_by: parseInt(userId),
    created_at: new Date(),
  };

  const newStation = await create(fullStation);
  return await findById(newStation.insertedId);
}

async function suspend(userId, stationId, rol){
    const stationToSuspend = await findById(stationId);

    if (!stationToSuspend) {
        throw new StationNotFoundError(stationId);  
    }

    if (stationToSuspend.created_by !== userId && rol === Rol.USER) {
        throw new StationNotFoundError(stationId);
    }

    if (stationToSuspend.status !== StationStatus.ACTIVE) {
        throw new StationNotFoundError(stationId);
    }
    
    stationToSuspend.status = StationStatus.INACTIVE;
    await update(stationId, stationToSuspend);

    const suspendedStation = await findById(stationId);

    return suspendedStation;
}

async function get(filterRequests) {
    const request = await findAll(filterRequests);
    return request;
  }

export { exists, add, suspend, get };