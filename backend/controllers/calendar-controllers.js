const HttpError = require("../models/http-error");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const User = require("../models/user-model");
const Calendar = require("../models/calendar-model");

const getCalendarsByUserId = async (req, res, next) => {
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Getting data failed, please try again", 500);
    return next(error);
  }
  // using map()
  try {
    calendars = await Calendar.findById(user.calendars);
  } catch (err) {
    const error = new HttpError("Getting data failed, please try again", 500);
    return next(error);
  }
};
const createCalendar = async (req, res, next) => {
  // 달력 생성
  console.log(req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  const { name, description } = req.body;

  let image;
  try {
    image = req.file.path;
  } catch (error) {
    image = null;
  }

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating calendar failed, please try again",
      500
    );
    return next(error);
  }

  const createdCalendar = new Calendar({
    name,
    description,
    image,
    member: {
      userId: req.userData.userId,
      nickname: user.username,
      role: "Administrator",
      administrator: "true",
    },
    creator: req.userData.userId,
  });

  try {
    const sess = await mongoose.startSession();
    await sess.withTransaction(async () => {
      await createdCalendar.save({ session: sess });
      user.calendars.push(createdCalendar);
      await user.save({ session: sess });
    });
    sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "Creating calendar failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ calendar: createdCalendar });
};
const updateCalendarById = async (req, res, next) => {
  // 달력 정보 업데이트... 유저 제명 기능도 넣어야 하나?
};
const deleteCalendar = async (req, res, next) => {
  // 달력 삭제. 관련된 이벤트도 삭제함.
};
const addMemberToCalendar = async (req, res, next) => {
  // 달력에 멤버 추가. 닉네임, 역할을 입력 받음
};

exports.getCalendarsByUserId = getCalendarsByUserId;
exports.createCalendar = createCalendar;
exports.updateCalendarById = updateCalendarById;
exports.deleteCalendar = deleteCalendar;
exports.addMemberToCalendar = addMemberToCalendar;
