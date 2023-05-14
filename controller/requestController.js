import { findUser } from "../service/userService.js";
import { add as addRequest, accept as acceptRequest, reject as rejectRequest } from "../service/requestService.js";
import { get as getRequests } from "../service/requestService.js";

async function add(body, userid, userToken) {
  await findUser(userid, userToken);

  const request = await addRequest(body, userid);
  return request;
}

async function get(filterRequests) {
  const requests = await getRequests(filterRequests);
  return requests;
}

async function accept(userId, adminUserId, requestId, userToken) {
  const user = await findUser(userId, userToken);
  const request = await acceptRequest(requestId, user, adminUserId);
  return request;
}

async function reject(userId, requestId, body, userToken){
  const user = await findUser(userId, userToken);
  const request = await rejectRequest(requestId, body.reason, user);
  return request;
}

export { add, get, accept, reject };
