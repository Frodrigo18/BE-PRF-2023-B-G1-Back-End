class UserUnexpectedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserUnexpectedError";
  }
}

export { UserUnexpectedError };
