class AwsRequestError extends Error {
    constructor() {
      super(`Failed to make request to AWS`);
      this.name = "AwsRequestError";
    }
  }
  
  export { AwsRequestError };