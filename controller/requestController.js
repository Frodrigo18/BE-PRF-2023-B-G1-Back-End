import { findUser } from "../service/userService.js";
import { add } from "../service/requestService.js";

async function addRequest(body, userid) {
  await findUser(userid);
  
  const request = await add(body, userid);
  return request;
}

export { addRequest };
