class RequestNotFoundError extends Error {
    constructor(requestId) {
      super(`Request ${requestId} not found error`);
      this.name = "RequestNotFoundError";
    }
  }
  
  export { RequestNotFoundError };