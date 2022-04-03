const jwt = require("jsonwebtoken");
const HttpError = require("../util/http-error");
const { diffDate } = require("../util/diff-date");
const Token = require("../models/token-model");

const { v4: uuid } = require("uuid");

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const JWT_EXPIRES_ACCESS_TOKEN = process.env.JWT_EXPIRES_ACCESS_TOKEN;
const JWT_EXPIRES_REFRESH_TOKEN = process.env.JWT_EXPIRES_REFRESH_TOKEN;

module.exports = async (req, res, next) => {
  try {
    const accessToken = req.cookies.at;
    const refreshToken = req.cookies.rt;

    // 리프레시 토큰이 없는 경우
    if (!refreshToken) {
      throw new Error("Authentication failed!");
    }
    const decodedRefreshToken = jwt.verify(refreshToken, JWT_PRIVATE_KEY);

    // 액세스 토큰이 있는 경우
    if (accessToken) {
      const decodedAccessToken = jwt.verify(accessToken, JWT_PRIVATE_KEY);
      req.userData = { userId: decodedAccessToken.userId };
    }
    // 액세스 토큰이 없는 경우
    else {
      let storedToken;
      try {
        storedToken = await Token.find({ uuid: decodedRefreshToken.uuid });
      } catch (err) {
        const error = new HttpError("DB error, please try again.", 500);
        return next(error);
      }

      if (storedToken.userId === undefined) {
        const error = new HttpError("Can't create Access Token.", 403);
        return next(error);
      }

      req.userData = { userId: storedToken.userId };

      // 액세스 토큰 재발급
      let newAccessToken;

      try {
        newAccessToken = jwt.sign(
          {
            userId: req.userData.userId,
          },
          JWT_PRIVATE_KEY,
          { expiresIn: JWT_EXPIRES_ACCESS_TOKEN }
        );
      } catch (err) {
        const error = new HttpError(
          "Logging in failed, please try again later.",
          500
        );
        return next(error);
      }
      res.cookie("at", newAccessToken, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60),
        httpOnly: true,
      });
    }

    // 리프레시 토큰의 만료기간이 7일 이하로 남은 경우, 재발행
    if (diffDate(decodedRefreshToken.exp, "day") <= 7) {
      let storedToken;
      try {
        storedToken = await Token.findOne({ uuid: decodedRefreshToken.uuid });
      } catch (err) {
        const error = new HttpError("DB error, please try again.", 500);
        return next(error);
      }

      if (storedToken.userId === undefined) {
        const error = new HttpError("Can't create Refresh Token.", 403);
        return next(error);
      }

      const id = uuid();

      storedToken.uuid = id;

      let newRefreshToken;
      try {
        newRefreshToken = jwt.sign(
          {
            uuid: id,
          },
          JWT_PRIVATE_KEY,
          { expiresIn: JWT_EXPIRES_REFRESH_TOKEN }
        );
        await storedToken.save();
        console.log("Refresh Token saved");
      } catch (err) {
        const error = new HttpError(
          "Logging in failed, please try again later.",
          500
        );
        return next(error);
      }

      res.cookie("rt", newRefreshToken, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        httpOnly: true,
      });
    }

    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};
