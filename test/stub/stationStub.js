import { StationAlreadyExistsError } from "../../service/error/stationAlreadyExistsError.js"

const stationAlreadyExistsError = (serialNumber) => new StationAlreadyExistsError(serialNumber); 

export { stationAlreadyExistsError }