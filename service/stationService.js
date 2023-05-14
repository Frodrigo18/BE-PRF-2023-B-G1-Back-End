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
  console.log(`INFO: Adding station serial number ${request.serial_number}`)
  const station = await findBySerialNumber(request.serial_number);

  if (!station){
    const fullStation = {
      serial_number: request.serial_number,
      name: request.name,
      longitude: request.longitude,
      latitud: request.latitude,
      brand: request.brand,
      model: request.model,
      status: StationStatus.ACTIVE,
      created_by: parseInt(userId),
      created_at: new Date(),
    };
  
    const newStation = await create(fullStation);
    console.log(`INFO: Adding station serial number ${request.serial_number} finishes successfully`)
    return await findById(newStation.insertedId);
  }
  else if (station.status == StationStatus.ACTIVE){
    console.log(`ERROR: Station serial number ${request.serial_number} already exists`);
    throw StationAlreadyExistsError(request.serial_number)
  }
  else{
    station.status = StationStatus.ACTIVE
    await update(station._id, station);
    console.log(`INFO: Adding station serial number ${request.serial_number} finishes successfully`)
    return station;
  }
}

async function suspend(userId, stationId, rol){
  console.log(`INFO: Suspending station for User Id ${userId}`)
  const stationToSuspend = await _stationVerification(userId, stationId, rol);
  await suspendAwsThing(stationToSuspend);
  
  stationToSuspend.status = StationStatus.INACTIVE;

  console.log(`INFO: Updating station status for User Id ${userId}`)
  await update(stationId, stationToSuspend);
  console.log(`INFO: Updating station status for User Id ${userId} finished successfully`)

  return stationToSuspend;
}

async function get(filterStations) {
  console.log(`INFO: Getting stations`)
  const station = await findAll(filterStations);
  return station;
}

async function rename(userId, stationId, rol, newName){
  console.log(`INFO: Renaming station for User Id ${userId}`)
  const station = await _stationVerification(userId, stationId, rol);
  
  await alterAwsThing(station);
  station.name = newName;

  console.log(`INFO: Updating station name for User Id ${userId}`)
  await update(stationId, station);
  console.log(`INFO: Updating station name for User Id ${userId} finished successfully`)

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
