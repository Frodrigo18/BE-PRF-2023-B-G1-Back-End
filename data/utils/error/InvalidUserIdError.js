class InvalidUserIdError extends Error{
    constructor(message) {
        super(message);
        this.name = "InvalidCredential";
      }
}
export {InvalidUserIdError}