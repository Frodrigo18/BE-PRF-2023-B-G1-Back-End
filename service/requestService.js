import { create, findById, findAll, approve as approveRequest, reject as rejectRequest, findBySerialNumber } from "../data/requestData.js";
import { exists as existsStation, add as addStation } from "./stationService.js";
import { StationAlreadyExistsError } from "./error/stationAlreadyExistsError.js";
import { RequestStatus } from "../model/enum/requestStatus.js";
import { RequestNotFoundError} from "./error/requestNotFoundError.js"
import { RequestInvalidStatusError } from "./error/requestInvalidStatusError.js";
import { sendRequestMail } from "./mailService.js";
import { createAwsIoT } from "./awsService.js";

async function add(user, request) {
  console.log(`INFO: Adding request by User Id ${user.id}`)
  if (!(await existsStation(request.serial_number)) && !(await exists(request.serial_number))) {
    const fullRequest = {
      serial_number: request.serial_number,
      name: request.name,
      longitude: request.longitude,
      latitude: request.latitude,
      brand: request.brand,
      model: request.model,
      status: RequestStatus.PENDING,
      created_by: parseInt(user.id),
      created_at: new Date(),
      approved_by: null,
      approved_at: null,
      user:  {
        id: user.id,
        user_name: user.user_name,
        mail: user.mail
      }
    }
    const newRequest = await create(fullRequest);
    return await findById(newRequest.insertedId)
  } 
  else {
    console.log(
      `ERROR: Station serial number ${request.serial_number} already exists.`
    );
    throw new StationAlreadyExistsError(request.serial_number);
  }
}

async function exists(serialNumber){
  const request = await findBySerialNumber(serialNumber);
  return (request != null && request.some(r => r.status == RequestStatus.PENDING))
}

async function get(filterRequests) {
  console.log(`INFO: Getting requests`)
  const request = await findAll(filterRequests);
  return request;  
}

async function approve(requestId, user, userAdminId){
  console.log(`INFO: Accepting request for User Id ${user.id}`)
  const request = await _find(requestId, user.id);
  await createAwsIoT(request);
  const updatedRequest = await _updateStatus(approveRequest, user.id, requestId, userAdminId, RequestStatus.APPROVED);
  await addStation(request, user);
  sendRequestMail(user.mail, user.user_name, RequestStatus.APPROVED, null, updatedRequest);
  return updatedRequest;
}

async function reject(requestId, reason, user){
  console.log(`INFO: Rejecting request for User Id ${user.id}`)
  const request = await _updateStatus(rejectRequest, user.id, requestId, RequestStatus.REJECTED);
  sendRequestMail(user.mail, user.user_name, RequestStatus.REJECTED, reason, request);
  return request;
}

async function _updateStatus(actionCallback, userId, requestId, ...params){
  console.log(`INFO: Updating state for Request Id ${requestId}`)
  const request = await _find(requestId, userId);

  if (request.status == RequestStatus.PENDING){
    await actionCallback(requestId, ...params);
    return await findById(requestId);
  }
  else {
    console.log(`ERROR: Invalid status ${request.status} for Request ID ${requestId} for current operation`);
    throw new RequestInvalidStatusError(requestId, request.status)
  }
}

async function _find(requestId, userId){
  const request = await findById(requestId);

  if (request && request.created_by == userId){
    return request;
  }
  else{
    console.log(`ERROR: Request ${requestId} not found for User Id ${userId}`);
    throw new RequestNotFoundError(requestId, userId)
  }
}

export { add , get, approve, reject, existsStation, exists };
