import { suspend as suspendStation, rename as renameStation } from "../service/stationService.js";
import { get as getStations } from "../service/stationService.js";
import { findUser } from "../service/userService.js";

async function suspend(userId, stationId, rol, userToken) {
  console.log(`INFO: Starting suspending station for User Id ${userId}`)
  await findUser(userId, userToken);
  const station = await suspendStation(userId, stationId, rol);
  console.log(`INFO: Suspending station for User Id ${userId} finished successfully`)
  return station;
}

async function get(filterStations) {
  console.log(`INFO: Starting getting stations`)
  const stations = await getStations(filterStations);
  console.log(`INFO: Getting stations finished successfully`)
  return stations;
}

async function rename(userId, stationsId, userToken, rol, body){
  console.log(`INFO: Starting renaming station for User Id ${userId}`)
  await findUser(userId, userToken);
  const station = await renameStation(userId, stationsId, rol, body.name);
  console.log(`INFO: Renaming station for User Id ${userId} finished successfully`)
  return station;
}

export {suspend, get, rename}
