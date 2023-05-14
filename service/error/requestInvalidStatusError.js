class RequestInvalidStatusError extends Error {
    constructor(requestId, status) {
      super(`Invalid status ${status} for Request ID ${requestId} for current operation`);
      this.name = "RequetInvalidStatusError";
    }
  }
  
  export { RequestInvalidStatusError};