import {
  findBySerialNumber,
  create,
  findById,
  findAll,
} from "../data/stationData.js";
import { StationStatus } from "../model/enum/stationStatus.js";

async function exists(serialNumber) {
  const station = await findBySerialNumber(serialNumber);
  return station != null && station.status != StationStatus.INACTIVE;
}

async function add(request, userId) {
  const fullStation = {
    serial_number: request.serial_number,
    name: request.name,
    longitud: request.longitud,
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

async function get(filterRequests) {
  const request = await findAll(filterRequests);
  return request;
}

export { exists, add, get };
