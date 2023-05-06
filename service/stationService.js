import { find } from "../data/stationData.js";
import {StationStatus} from "../model/enun/stationStatus.js"

async function exists(serialNumber) {
    const station = await find(serialNumber);
    return (station != null && station.status != StationStatus.INACTIVE)
}

export { exists };
