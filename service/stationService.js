import { find } from "../data/stationData";

async function exists(serialNumber) {
    const station = await find(serialNumber);
    return station ? true : false;
}

export { exists };
