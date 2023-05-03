class UserNotFoundError extends Error {
  constructor(userId) {
    super(`User Id ${userId} not found`);
    this.name = "UserNotFoundError";
  }
}

export { UserNotFoundError };
