class AwsRequestError extends Error {
    constructor(requestId) {
      super(`An error occured while requesting AWS to add station for Request Id ${requestId}`);
      this.name = "AwsRequestError";
    }
  }
  
  export { AwsRequestError };