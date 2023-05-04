import { find } from "../data/stationData.js";

async function exists(serialNumber) {
    const station = await find(serialNumber);
    return station ? true : false;
}

export { exists };
