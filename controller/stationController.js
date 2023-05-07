import { findUser } from "../service/userService.js";
import { get as getStations } from "../service/stationService.js";

async function get(filterRequests) {
  const stations = await getStations(filterRequests);
  return stations;
}

export { get };
