class UserUnexpectedError extends Error {
  constructor(userId) {
    super(`An unexpected error occurred while finding User Id ${userId}.`);
    this.name = "UserUnexpectedError";
  }
}

export { UserUnexpectedError };
