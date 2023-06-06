class StationAlreadyExistsError extends Error {
    constructor(stationSerialNumber) {
      super(`Station serial number ${stationSerialNumber} already exists`);
      this.name = "StationAlreadyExistsError";
    }
  }
  
  export { StationAlreadyExistsError };