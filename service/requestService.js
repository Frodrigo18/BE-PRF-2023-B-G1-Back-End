import dotenv from "dotenv";
import fetch from "node-fetch";
import { create, findById, findAll, approve as approvedRequest, reject as rejectRequest} from "../data/requestData.js";
import { exists as existsStation, add as addStation } from "./stationService.js";
import { StationAlreadyExistsError } from "./error/stationAlreadyExistsError.js";
import { RequestStatus } from "../model/enum/requestStatus.js";
import { findBySerialNumber } from "../data/requestData.js";
import { RequestNotFoundError} from "./error/requestNotFoundError.js"
import { RequetInvalidStatusError } from "./error/requestInvalidStatusError.js";
import { AwsUnexpectedError } from "./error/awsUnexpectedError.js";
import { AwsRequestError } from "./error/awsRequestError.js";

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
      status: RequestStatus.PENDING,
      created_by: parseInt(userid),
      created_at: new Date(),
      approved_by: null,
      approved_at: null
    }
    const newRequest = await create(fullRequest);
    return await findById(newRequest.insertedId)
  } 
  else {
    console.log(
      `Station serial number ${request.serial_number} already exists.`
    );
    throw new StationAlreadyExistsError(request.serial_number);
  }
}

async function _exist(serialNumber){
  const request = await findBySerialNumber(serialNumber);
  return (request != null && request.status != RequestStatus.REJECTED)
}

async function get(filterRequests) {
  const request = await findAll(filterRequests);
  return request;  
}

async function accept(requestId, userId, userAdminId){
  const request = await _find(requestId, userId);
  await _createAwsIoT(request);
  await _updateStatus(approvedRequest, userId, requestId, userAdminId, RequestStatus.APPROVED);
  await addStation(request, userId);
  return request;
}

async function reject(requestId, userId){
  return await _updateStatus(rejectRequest, userId, requestId, RequestStatus.REJECTED);
}

async function _updateStatus(actionCallback, userId, requestId, ...params){
  const request = await _find(requestId, userId);

  if (request.status == RequestStatus.PENDING){
    await actionCallback(requestId, ...params);
    return await findById(requestId);
  }
  else {
    console.log(`Invalid status ${request.status} for Request ID ${requestId} for current operation`);
    throw new RequetInvalidStatusError(requestId, request.status)
  }
}

async function _find(requestId, userId){
  const request = await findById(requestId);

  if (request && request.created_by == userId){
    return request;
  }
  else{
    console.log(`Request ${requestId} not found for User Id ${userId}`);
    throw new RequestNotFoundError(requestId, userId)
  }
}

async function _createAwsIoT(request){
  await _createAwsEntity(request);
  await _createAwsThing(request);
}

async function _createAwsEntity(request){
  const url = `${process.env.AWS_STF_HOST}/ngsi-ld/v1/entities`;
  const body = {
    id: `urn:ngsi-ld:Device:${request.name}`,
    type: "Device",
    serialNumber: {
      type: "Property",
      value: request.serial_number
    }
  }
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  };

  return await _awsAddStationRequest(url, options, request._id);
}

async function _createAwsThing(request){
  const url = `${process.env.AWS_STF_HOST}/iot/things`;
  const body = {
    id: `urn:ngsi-ld:Device:${request.name}`,
    type: "Device",
    thingGroups: {
        type: "Property",
        value: [
            "LoRaWAN"
        ]
    },
    location: {
        type: "GeoProperty",
        value: {
            type: "Point",
            coordinates: [
                request.longitud,
                request.latitude
            ]
        }
    }
  }
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  };

  return await _awsAddStationRequest(url, options, request._id);
}

async function _awsAddStationRequest(url, options, requestId){
  try {
    const awsResponse = await fetch(url, options);
    const awsJson = await awsResponse.json();
    
    switch (awsResponse.status) {
      case 200:
        return awsJson;
      default:
        console.log(`An unexpected error occured while adding station for Request Id ${requestId} to AWS. \n Error: ${userJson}`);
        throw new AwsUnexpectedError(requestId);
    }
  } 
  catch (error) {
    if (error instanceof AwsUnexpectedError) {
      throw error;
    } else {
      console.log(`An error occured whie requesting User Id ${requestId}. \n Error: ${error}`);
      throw new AwsRequestError(requestId);
    }
  }
}

export { add , get, accept, reject};
