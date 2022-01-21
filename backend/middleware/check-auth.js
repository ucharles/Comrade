const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};
