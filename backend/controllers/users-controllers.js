const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user-model");

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const JWT_EXPIRES = process.env.JWT_EXPIRES;

const getUsers = async (req, res, next) => {
  let users;
  try {
    // 결과 중 password를 제외함
    users = await User.find({}, "-password");
  } catch (err) {
    const error = HttpError(
      "something error getting users! please check.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
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

  // JWT 토큰 생성
  let token;

  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      JWT_PRIVATE_KEY,
      { expiresIn: JWT_EXPIRES }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    username: existingUser.username,
    token: token,
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("invalid input passed, plz check your data", 422)
    );
  }

  const { username, email, password, region } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("signup error, please try again.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  // password 암호화
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

  const createdUser = new User({
    username,
    email,
    image: req.file.path,
    password: hashedPassword,
    region,
    calendars: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up falied, please try again.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      JWT_PRIVATE_KEY,
      { expiresIn: JWT_EXPIRES }
    );
  } catch (err) {
    const error = new HttpError("Signing up falied, please try again.", 500);
    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    username: createdUser.username,
    region: createdUser.region,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
