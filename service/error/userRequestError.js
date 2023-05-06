class UserRequestError extends Error {
    constructor(userId) {
      super(`An error occured whie requesting User Id ${userId}`);
      this.name = "UserRequestError";
    }
  }
  
  export { UserRequestError };
  