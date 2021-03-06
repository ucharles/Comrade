const HttpError = require("../util/http-error");
const { diffDate } = require("../util/diff-date");
const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/user-model");
const Event = require("../models/event-model");
const Token = require("../models/token-model");

const { v4: uuid } = require("uuid");

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const JWT_EXPIRES_ACCESS_TOKEN = process.env.JWT_EXPIRES_ACCESS_TOKEN;
const JWT_EXPIRES_REFRESH_TOKEN = process.env.JWT_EXPIRES_REFRESH_TOKEN;

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid input passed, please check your data.", 422)
    );
  }

  const { username, email, password, confirmPassword } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup error, please try again.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  if (password !== confirmPassword) {
    const error = new HttpError(
      "Password unmatch. Please confirm password.",
      422
    );
    return next(error);
  }

  // password μνΈν
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, Please try again.",
      500
    );
    return next(error);
  }

  let image;
  try {
    image = req.file.path;
  } catch (error) {
    image = null;
  }

  const createdUser = new User({
    username,
    email,
    image: image,
    password: hashedPassword,
    calendars: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up falied, please try again.", 500);
    return next(error);
  }

  res.status(201).send();
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email.toLowerCase() });
  } catch (err) {
    const error = new HttpError("Signup error, please try again.", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("Colud not login, please check", 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  // JWT ν ν° μμ±
  let accessToken;
  let refreshToken;

  const id = uuid();

  const createdRefreshToken = new Token({
    uuid: id,
    userId: existingUser._id.toString(),
  });

  try {
    accessToken = jwt.sign(
      {
        userId: existingUser.id,
      },
      JWT_PRIVATE_KEY,
      { expiresIn: JWT_EXPIRES_ACCESS_TOKEN }
    );
    refreshToken = jwt.sign(
      {
        uuid: id,
      },
      JWT_PRIVATE_KEY,
      { expiresIn: JWT_EXPIRES_REFRESH_TOKEN }
    );

    await createdRefreshToken.save();
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .cookie("at", accessToken, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60),
      httpOnly: true,
    })
    .cookie("rt", refreshToken, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      httpOnly: true,
    })
    .cookie("loggedIn", 1, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    })
    .send();
};

const getUserById = async (req, res, next) => {
  // νμμ λ³΄ μμ  μ  μ λ³΄ νμ
  let user;

  try {
    // κ²°κ³Ό μ€ passwordλ₯Ό μ μΈν¨
    user = await User.findById(req.userData.userId, "-password");
  } catch (err) {
    const error = HttpError(
      "something error getting users! please check.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  res.status(200).json({ user });
  // .json({ user: user.map((user) => user.toObject({ getters: true })) });
};

const getTokenAndCheck = async (req, res, next) => {
  try {
    const accessToken = req.cookies.at;
    const refreshToken = req.cookies.rt;

    // λ¦¬νλ μ ν ν°μ΄ μλ κ²½μ°
    if (!refreshToken) {
      throw new Error("Authentication failed!");
    }
    const decodedRefreshToken = jwt.verify(refreshToken, JWT_PRIVATE_KEY);

    if (!accessToken) {
      let storedToken;
      try {
        storedToken = await Token.findOne({ uuid: decodedRefreshToken.uuid });
      } catch (err) {
        const error = new HttpError("DB error, please try again.", 500);
        return next(error);
      }

      if (storedToken.userId === undefined) {
        const error = new HttpError("Can't create Access Token.", 403);
        return next(error);
      }

      req.userData = { userId: storedToken.userId };

      // μ‘μΈμ€ ν ν° μ¬λ°κΈ
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
      res
        .status(200)
        .cookie("at", newAccessToken, {
          path: "/",
          expires: new Date(Date.now() + 1000 * 60 * 60),
          httpOnly: true,
        })
        .send();
    } else if (accessToken) {
      jwt.verify(accessToken, JWT_PRIVATE_KEY);
      res.status(200).send();
    }
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};

const editUser = async (req, res, next) => {
  // νμ μ λ³΄ μμ 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { username, password } = req.body;

  let user;
  try {
    user = await User.findById(req.userData.userId).exec();
  } catch (err) {
    const error = new HttpError(
      "something went wrong, could not update a place.",
      500
    );
    return next(error);
  }
  if (user._id.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this user.", 401);
    return next(error);
  }

  // password μνΈν
  if (password) {
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new HttpError(
        "Could not create user, Please try again.",
        500
      );
      return next(error);
    }
    user.password = hashedPassword;
  }

  let image;
  try {
    image = req.file.path;
  } catch (error) {
    image = null;
  }

  user.username = username;
  user.image = image;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  res.status(201).send();
};

const deleteUser = async (req, res, next) => {
  // νμ μ λ³΄ μ­μ 
  const userId = req.userData.userId;
  // λ¬λ ₯ μμ±μμΈ κ²½μ°μ μ­μ  λΆκ°. λ¬λ ₯μ μ­μ ν΄μΌ ν¨.(λ€λ₯Έ μ¬λμκ² μλνκ±°λ?)

  let user;
  try {
    user = await User.findById(userId).populate("calendars").exec();
  } catch (err) {
    const error = new HttpError("Could not found user by id.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for this id.", 404);
    return next(error);
  }

  // μν μΊλ¦°λ μ€μ μμ±μκ° μμ μΈ μΊλ¦°λκ° μλ κ²½μ°
  if (
    !!user.calendars.find((v) => {
      return v.owner.toString() === userId;
    })
  ) {
    const error = new HttpError(
      "Delete or Change owner, by owned calendar first.",
      404
    );
    return next(error);
  }

  let deleteIndexArray = [];
  for (const calendar of user.calendars) {
    deleteIndexArray.push({
      calendarId: calendar._id,
      deleteIndex: calendar.members.findIndex((member) => {
        return member._id.toString() === userId;
      }),
    });
  }

  // νΈλμ­μ μ¬μ©. λ μμμ΄ λͺ¨λ μλ£λκ±°λ, λ μμμ΄ λͺ¨λ μνλμ§ μκ±°λ.
  try {
    const sess = await mongoose.startSession();
    await sess.withTransaction(async () => {
      for (let calendar of user.calendars) {
        let deleteInfo = deleteIndexArray.find((v) => {
          return v.calendarId.toString() === calendar._id.toString();
        });
        calendar.members.splice(deleteInfo.deleteIndex, 1);
        await calendar.save({ session: sess });
      }
      await user.delete({ session: sess });
      await Event.deleteMany({ creator: userId }).session(sess);
    });
    sess.endSession();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Can not delete user, Can not delete user's events.",
      500
    );
    return next(error);
  }

  // μ΄λ―Έμ§ μ­μ 
  // fs.unlink(user.image, (err) => {
  //   err === null
  //     ? console.log("delete image: " + user.image)
  //     : console.log(err);
  // });

  // μΌμ λ§ λ±λ‘ν κ²½μ°μ μ­μ  κ°λ₯. μΌμ μ΄ μ λΆ μ­μ λμ§ μμ.
  //res.clearCookie("XSRF-TOKEN");
  res.clearCookie("at");
  res.clearCookie("rt");
  res.status(200).send();
};

const logout = (req, res, next) => {
  //res.clearCookie("XSRF-TOKEN");
  res.clearCookie("loggedIn");
  res.clearCookie("at");
  res.clearCookie("rt");
  res.clearCookie("tz");
  res.status(200).send();
};

exports.getUserById = getUserById;
exports.getTokenAndCheck = getTokenAndCheck;
exports.editUser = editUser;
exports.deleteUser = deleteUser;
exports.login = login;
exports.logout = logout;
exports.signup = signup;
