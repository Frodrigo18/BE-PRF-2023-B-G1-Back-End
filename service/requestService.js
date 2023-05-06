import dotenv from "dotenv";
import { create, findById, findAll, approve as approvedRequest, reject as rejectRequest} from "../data/requestData.js";
import { exists as existsStation, add as addStation } from "./stationService.js";
import { StationAlreadyExistsError } from "./error/stationAlreadyExistsError.js";
import { RequestStationStatus } from "../model/enum/requestStationStatus.js";
import { findBySerialNumber } from "../data/requestData.js";
import { RequestNotFoundError} from "./error/requestNotFoundError.js"
import { RequetInvalidStatusError } from "./error/requestInvalidStatusError.js";

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

async function get(pageSize, page) {
  const request = await findAll(pageSize, page);
  return request;  
}

async function accept(requestId, userId){
  //TODO add in AWS
  const request = await _updateStatus(approvedRequest, requestId, userId, RequestStationStatus.APPROVED);
  await addStation(request, userId);
  return request;
}

async function reject(requestId){
  return await _updateStatus(rejectRequest, requestId, RequestStationStatus.REJECTED);
}

async function _updateStatus(actionCallback, requestId, ...params){
  const request = await findById(requestId);

  if (request && request.status == RequestStationStatus.PENDING){
    await actionCallback(requestId, ...params);
    return await findById(requestId);
  }
  else if (request){
    console.log(`Invalid status ${request.status} for Request ID ${requestId} for current operation`);
    throw new RequetInvalidStatusError(requestId, request.status)
  }
  else{
    console.log(`Request ${requestId} not found error`);
    throw new RequestNotFoundError(requestId)
  }
}

export { add , get, accept, reject};
