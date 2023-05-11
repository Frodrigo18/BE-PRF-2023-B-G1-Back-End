class UserNotAuthorizedError extends Error {
    constructor(userId) {
      super(`User Id ${userId} is not authorized`);
      this.name = "UserNotAuthorizedError";
    }
  }
  
  export { UserNotAuthorizedError };