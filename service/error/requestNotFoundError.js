class RequestNotFoundError extends Error {
    constructor(requestId, userId) {
      super(`Request ${requestId} not found for User Id ${userId}`);
      this.name = "RequestNotFoundError";
    }
  }
  
  export { RequestNotFoundError };