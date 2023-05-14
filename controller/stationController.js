import { suspend as suspendStation, rename as renameStation } from "../service/stationService.js";
import { get as getStations } from "../service/stationService.js";
import { findUser } from "../service/userService.js";

async function suspend(userId, stationId, rol, userToken){
  await findUser(userId, userToken);
  const station = await suspendStation(userId, stationId, rol);
  return station;
}

async function get(filterStations) {
  const stations = await getStations(filterStations);
  return stations;
}

async function rename(userId, stationsId, userToken, rol, body){
  await findUser(userId, userToken);
  const station = await renameStation(userId, stationsId, rol, body.name);
  return station;
}

export {suspend, get, rename}
