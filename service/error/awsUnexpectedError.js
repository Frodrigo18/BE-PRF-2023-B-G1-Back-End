class AwsUnexpectedError extends Error {
    constructor() {
      super(`An unexpected error occured while making request to AWS`);
      this.name = "AwsUnexpectedError";
    }
  }
  
  export { AwsUnexpectedError };