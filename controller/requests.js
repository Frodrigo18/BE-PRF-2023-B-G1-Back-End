import requests from "../data/requests";

async function postRequest(body) {
  return requests.postRequest(body);
}

export { postRequest };
