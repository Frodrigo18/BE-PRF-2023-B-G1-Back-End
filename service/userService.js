import dotenv from "dotenv";
import fetch from "node-fetch";
import { UserNotFoundError } from "./error/userNotFoundError.js";
import {UserUnexpectedError} from "./error/userUnexpectedError.js"

dotenv.config();

async function findUser(userid, userToken) {
  const url = `${process.env.USER_HOST}/users/${userid}`;
  const headers = {
    'Authorization': userToken,
    'Content-Type': 'application/json'
  };
  const userResponse = await fetch(url, {headers});
  const userJson = await userResponse.json();

  if (userResponse.status == 200) {
    return userJson;
  } else if (userResponse.status == 404) {
    console.log(`User Id ${userid} not found. \n Error: ${userJson}`);
    throw new UserNotFoundError(userid);
  } else {
    console.log(
      `An unexpected error occurred while finding User Id ${userid}. \n Error: ${userJson}`
    );
    throw new UserUnexpectedError(userid);
  }
}

export { findUser };
