const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const timezoneEnum = require("../util/timezone");

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

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid input passed, please check your data.", 422)
    );
  }

  const { username, email, password, confirmPassword, region } = req.body;

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

  if (!timezoneEnum[region]) {
    const error = new HttpError("Invalid timezone.", 422);
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
      {
        userId: createdUser.id,
        email: createdUser.email,
        region: region,
      },
      JWT_PRIVATE_KEY,
      { expiresIn: JWT_EXPIRES }
    );
  } catch (err) {
    const error = new HttpError("Signing up falied, please try again.", 500);
    return next(error);
  }

  // res.status(201).json({
  //   userId: createdUser.id,
  //   email: createdUser.email,
  //   username: createdUser.username,
  //   region: region,
  //   token: token,
  // });

  res
    .status(201)
    .cookie("token", token, { httpOnly: true })
    .send("Cookie Shipped");
};

const login = async (req, res, next) => {
  const { email, password, region } = req.body;

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

  if (!timezoneEnum[region]) {
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
      { userId: existingUser.id, email: existingUser.email, region: region },
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

  // res.json({
  //   userId: existingUser.id,
  //   email: existingUser.email,
  //   username: existingUser.username,
  //   token: token,
  // });
  res
    .status(201)
    .cookie("token", token, { httpOnly: true })
    .send("Cookie Shipped");
};

const getUser = async (req, res, next) => {
  // 회원정보 수정 전 정보 표시
  let user;

  const token = req.cookies.token;
  const payload = jwt.verify(token, JWT_PRIVATE_KEY);
  const { userId, email } = payload;

  try {
    // 결과 중 password를 제외함
    user = await User.findById({ userId }, "-password");
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

  if (user.email !== email) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  res.json({ user: user.map((user) => user.toObject({ getters: true })) });
};

const editUser = async (req, res, next) => {
  // 회원 정보 수정
};

const deleteUser = async (req, res, next) => {
  // 회원 정보 삭제
  // 달력 생성자인 경우엔 삭제 불가. 달력을 삭제해야 함.
  // 일정만 등록한 경우엔 삭제 가능. 일정이 전부 삭제되진 않음.
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

const logout = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

exports.getUsers = getUsers;
exports.getUser = getUser;
exports.editUser = editUser;
exports.deleteUser = deleteUser;
exports.login = login;
exports.logout = logout;
exports.signup = signup;
