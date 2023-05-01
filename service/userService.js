import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

async function findUser(userid) {
  const url = `${process.env.USER_HOST}/users/${userid}`;
  const userResponse = await fetch(url);
  const userJson = await userResponse.json();

  if (userResponse.status == 200) {
    return userJson;
  } else if (userResponse.status == 404) {
    console.log(`User Id ${userid} not found. \n Error: ${userJson}`);
    throw new UserNotFoundError(`User Id ${userid} not found`);
  } else if (userResponse.status == 500) {
    console.log(
      `An unexpected error occurred while finding User Id ${userid}. \n Error: ${userJson}`
    );
    throw new UserUnexpectedError(
      `An unexpected error occurred while finding User Id ${userid}.`
    );
  }
}

export { findUser };
