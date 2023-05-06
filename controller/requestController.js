import { findUser } from "../service/userService.js";
import { add as addRequest, accept as acceptRequest, reject as rejectRequest} from "../service/requestService.js";
import { get as getRequests } from "../service/requestService.js";


async function add(body, userid, userToken) {
  await findUser(userid, userToken);
  
  const request = await addRequest(body, userid);
  return request;
}

async function get(pageSize, page) {
  const request = await getRequests(pageSize, page);
  return request;
}

async function accept(userId, requestId, userToken){
  await findUser(userId, userToken);

  const request = await acceptRequest(requestId, userId);
  return request;

}

async function reject(userId, requestId, userToken){
  await findUser(userId, userToken);

  const request = await rejectRequest(requestId);
  return request;
}

export { add, get, accept, reject };
