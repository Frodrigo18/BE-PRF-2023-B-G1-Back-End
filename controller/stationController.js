import { suspend as suspendStation } from "../service/stationService.js";
import { get as getStations } from "../service/stationService.js";
import { findUser } from "../service/userService.js";

async function suspend(userId, stationId, rol, userToken) {
  await findUser(userId, userToken);
  const station = await suspendStation(userId, stationId, rol);
  return station;
}

async function get(filterStation) {
  const stations = await getStations(filterStation);
  return stations;
}

export { suspend, get };
