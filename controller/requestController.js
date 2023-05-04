import { findUser } from "../service/userService.js";
import { add as addRequest } from "../service/requestService.js";

async function add(body, userid, userToken) {
  await findUser(userid, userToken);
  
  const request = await addRequest(body, userid);
  return request;
}

export { add };
