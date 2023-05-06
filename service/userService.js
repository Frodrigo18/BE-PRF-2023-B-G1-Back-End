import dotenv from "dotenv";
import fetch from "node-fetch";
import { UserNotFoundError } from "./error/userNotFoundError.js";
import { UserUnexpectedError } from "./error/userUnexpectedError.js"
import { UserRequestError } from "./error/userRequestError.js"

dotenv.config();

async function findUser(userid, userToken) {
  const url = `${process.env.USER_HOST}/users/${userid}`;
  const headers = {
    'Authorization': userToken,
    'Content-Type': 'application/json'
  };

  try {
    const userResponse = await fetch(url, {headers});
    const userJson = await userResponse.json();
    
    switch (userResponse.status) {
      case 200:
        return userJson;
      case 404:
        console.log(`User Id ${userid} not found. \n Error: ${userJson}`);
        throw new UserNotFoundError(userid);
      default:
        console.log(`An unexpected error occurred while finding User Id ${userid}. \n Error: ${userJson}`);
        throw new UserUnexpectedError(userid);
    }
  } 
  catch (error) {
    if (error instanceof UserNotFoundError || error instanceof UserUnexpectedError) {
      throw error;
    } else {
      console.log(`An error occured whie requesting User Id ${userid}. \n Error: ${error}`);
      throw new UserRequestError(userid);
    }
  }
}

export { findUser };
