import {
  findBySerialNumber,
  create,
  findById,
  findAll,
  update,
} from "../data/stationData.js";
import { Rol } from "../model/enum/rol.js";
import { StationStatus } from "../model/enum/stationStatus.js"
import { StationNotFoundError } from "./error/stationNotFoundError.js"
import { suspendAwsThing, alterAwsThing } from "./awsService.js";
import { StationAlreadyExistsError } from "./error/stationAlreadyExistsError.js";


async function exists(serialNumber) {
  const station = await findBySerialNumber(serialNumber);
  return station != null && station.status != StationStatus.INACTIVE;
}

async function add(request, userId) {
  const station = await findBySerialNumber(request.serial_number);

  if (!station){
    const fullStation = {
      serial_number: request.serial_number,
      name: request.name,
      longitud: request.longitud,
      latitud: request.latitude,
      brand: request.brand,
      model: request.model,
      status: StationStatus.ACTIVE,
      created_by: parseInt(userId),
      created_at: new Date(),
    };
  
    const newStation = await create(fullStation);
    return await findById(newStation.insertedId);
  }
  else if (station.status == StationStatus.ACTIVE){
    console.log(`ERROR: Station serial number ${request.serial_number} already exists`);
    throw StationAlreadyExistsError(request.serial_number)
  }
  else{
    station.status = StationStatus.ACTIVE
    await update(station._id, station);
    return station;
  }
}

async function suspend(userId, stationId, rol){
  const stationToSuspend = await _stationVerification(userId, stationId, rol);
  await suspendAwsThing(stationToSuspend);
  
  stationToSuspend.status = StationStatus.INACTIVE;
  await update(stationId, stationToSuspend);

  return stationToSuspend;
}

async function get(filterStations) {
  const station = await findAll(filterStations);
  return station;
}

async function rename(userId, stationId, rol, newName){
  const station = await _stationVerification(userId, stationId, rol);
  
  await alterAwsThing(station);
  station.name = newName;
  await update(stationId, station);

  return station;
}

async function _stationVerification(userId, stationId, rol){
  const station = await findById(stationId);

  if (!station) {
    console.log(`ERROR: Station Id ${stationId} not found`);
    throw new StationNotFoundError(stationId);  
  }

  if (station.created_by !== userId && rol === Rol.USER) {
    console.log(`ERROR: Station Id ${stationId} does not belong to User Id ${userId}`);
    throw new StationNotFoundError(stationId);
  }

  if (station.status !== StationStatus.ACTIVE) {
    console.log(`ERROR: Station Id ${stationId} is not in state ${StationStatus.ACTIVE}`);
    throw new StationNotFoundError(stationId);
  }

  return station
}

export { exists, add, suspend, get, rename };
