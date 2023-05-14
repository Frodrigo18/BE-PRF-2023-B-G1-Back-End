import { findUser } from "../service/userService.js";
import {
  add as addRequest,
  accept as acceptRequest,
  reject as rejectRequest,
} from "../service/requestService.js";
import { get as getRequests } from "../service/requestService.js";

async function add(body, userid, userToken) {
  console.log(`INFO: Starting add request by User Id ${userid}`)
  await findUser(userid, userToken);

  const request = await addRequest(body, userid);
  console.log(`INFO: Add request by User Id ${userid} finished successfully`)
  return request;
}

async function get(filterRequests) {
  console.log(`INFO: Starting get requests`)
  const requests = await getRequests(filterRequests);
  console.log(`INFO: Get requests finished sucessfully`)
  return requests;
}

async function accept(userId, adminUserId, requestId, userToken) {
  console.log(`INFO: Starting accept request for User Id ${userId}`)
  const user = await findUser(userId, userToken);
  const request = await acceptRequest(requestId, user, adminUserId);
  console.log(`INFO: Accept request for User Id ${userId} finished sucessfully`)
  return request;
}

async function reject(userId, requestId, body, userToken){
  console.log(`INFO: Starting reject request for User Id ${userId}`)
  const user = await findUser(userId, userToken);
  const request = await rejectRequest(requestId, body.reason, user);
  return request;
}

export { add, get, accept, reject };
