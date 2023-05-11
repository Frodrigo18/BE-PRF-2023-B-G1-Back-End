class StationNotFoundError extends Error {
    constructor(stationId) {
      super(`Station Id ${stationId} not found`);
      this.name = "StationNotFoundError";
    }
  }
  
  export { StationNotFoundError };