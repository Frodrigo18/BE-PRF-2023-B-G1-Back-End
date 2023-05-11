class StationAlreadySuspendedError extends Error {
    constructor(stationId) {
      super(`Station with ID ${stationId} is already suspended`);
      this.name = "StationAlreadySuspendedError";
    }
  }
  
  export { StationAlreadySuspendedError };