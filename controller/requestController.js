import { findUser } from "../service/userService";
import { add } from "../service/requestService";

async function add(body, userid) {
  const user = await findUser(userid);
  const request = await add(body, userid);
  return request;
}

export { add };
