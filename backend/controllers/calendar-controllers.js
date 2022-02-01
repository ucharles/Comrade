const HttpError = require("../models/http-error");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const User = require("../models/user-model");
const Calendar = require("../models/calendar-model");
const Event = require("../models/event-model");

const getCalendarsByUserId = async (req, res, next) => {
  let userWithCalendars;
  try {
    user = await User.findById(req.userData.userId)
      .populate("calendars")
      .exec();
  } catch (err) {
    const error = new HttpError("Getting data failed, please try again", 500);
    return next(error);
  }
  // if(!place || place.length === 0)
  if (!userWithCalendars || userWithCalendars.calendars.length === 0) {
    return next(
      new HttpError("Could not find calendars for the privided id", 404)
    ); // will be trigger: error handling middleware
  }
  res.json({
    calendars: userWithCalendars.calendars.map((calendar) =>
      calendar.toObject({ getters: true })
    ),
  });
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
    const error = new HttpError("Something failed, please try again", 500);
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
      "Create calendar failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ calendar: createdCalendar });
};
const updateCalendarById = async (req, res, next) => {
  // 달력 정보 업데이트... 유저 제명 기능도 넣어야 하나?
  // 유저 제명 기능은 따로 두는게 나을지도..??
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, description } = req.body;
  const calendarId = req.params.cid;

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Something failed, please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for this calendar.", 404);
    return next(error);
  }

  const isCalendarMemberInUser = user.calendars.filter((v) => {
    v.id.toString() === calendarId;
  });

  if (isCalendarMemberInUser.length === 0) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  let calendar;
  try {
    calendar = await Calendar.findById(calendarId);
  } catch (err) {
    const error = new HttpError("Something failed, please try again", 500);
    return next(error);
  }

  if (!calendar) {
    const error = new HttpError("Could not find calendar for this id.", 404);
    return next(error);
  }

  const isCalendarmemberInCalendar = calendar.members.filter((v) => {
    v.userId.toString() === req.userData.userId;
  });

  if (isCalendarmemberInCalendar.administrator === false) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  calendar.name = name;
  calendar.description = description;

  try {
    calendar.image = req.file.path;
  } catch (error) {
    null;
  }

  try {
    await calendar.save();
  } catch (err) {
    const error = new HttpError(
      "something went wrong, could not update a calendar.",
      500
    );
    return next(error);
  }

  res.status(200).json({ calendar: calendar.toObject({ getters: true }) });
};
const deleteCalendar = async (req, res, next) => {
  // 달력 삭제. 관련된 이벤트도 삭제, 유저 정보에 포함된 것도 삭제.
  const calendarId = req.params.cid;

  let calendar;
  let events;
  let users;
  try {
    // populate: 컬렉션 간 연결(ref)이 있는 경우에만 사용 가능?
    // User와 Event에 연결된 상태.
    calendar = await Calendar.findById(calendarId).populate("creator").exec();
  } catch (err) {
    const error = new HttpError("Can not found calendar by id.", 500);
    return next(error);
  }

  try {
    events = await Event.find({ calendar: calendar }).exec();
    users = await User.find({ calendars: calendar }).exec(); // 배열...
  } catch (err) {
    const error = new HttpError("Can not found calendar by id.", 500);
    return next(error);
  }

  if (!calendar) {
    const error = new HttpError("Could not find calendar for this id.", 404);
    return next(error);
  }

  if (calendar.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this calendar.",
      401
    );
    return next(error);
  }
  const imagePath = calendar.image;

  try {
    const sess = await mongoose.startSession();
    await sess.withTransaction(async () => {
      await calendar.remove({ session: sess });
      // place -> place의 creator -> creator에 연결된 user의 places -> 제거
      calendar.creator.calendars.pull(calendar);
      await place.creator.save({ session: sess });
      calendar.calendars.calendars.pull(calendar);
      await place.creator.save({ session: sess });
    });
    sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "cant not found place by id, cant delete place.",
      500
    );
    return next(error);
  }

  // 이미지 삭제
  fs.unlink(imagePath, (err) => {
    err === null ? console.log("delete image: " + imagePath) : console.log(err);
  });
  res.status(200).json({ message: "Deleted Calendar." });
};
const addMemberToCalendar = async (req, res, next) => {
  // 달력에 멤버 추가. 닉네임, 역할을 입력 받음
};

exports.getCalendarsByUserId = getCalendarsByUserId;
exports.createCalendar = createCalendar;
exports.updateCalendarById = updateCalendarById;
exports.deleteCalendar = deleteCalendar;
exports.addMemberToCalendar = addMemberToCalendar;
