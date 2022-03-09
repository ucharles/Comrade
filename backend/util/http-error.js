class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Add a 'message' prop
    this.code = errorCode;
  }
}

module.exports = HttpError;
