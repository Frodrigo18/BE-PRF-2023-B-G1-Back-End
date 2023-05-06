class AwsUnexpectedError extends Error {
    constructor(requestId) {
      super(`An unexpected error occured while adding station for Request Id ${requestId} to AWS`);
      this.name = "AwsUnexpectedError";
    }
  }
  
  export { AwsUnexpectedError };