const HttpError = require("../util/http-error");
const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const User = require("../models/user-model");
const Calendar = require("../models/calendar-model");
const Event = require("../models/event-model");

const getCalendarsByUserId = async (req, res, next) => {
  let userWithCalendars;
  try {
    userWithCalendars = await User.findById(req.userData.userId)
      .populate({ path: "calendars", select: "name image members owner" })
      .exec();
  } catch (err) {
    const error = new HttpError("Getting data failed, please try again", 500);
    return next(error);
  }

  if (!userWithCalendars || userWithCalendars.calendars.length === 0) {
    return next(
      new HttpError("Could not find calendars for the privided id", 404)
    ); // will be trigger: error handling middleware
  }

  for (let calendar of userWithCalendars.calendars) {
    if (calendar.owner.toString() !== req.userData.userId) {
      calendar.owner = null;
    }
    calendar.members = calendar.members.find(
      (v) => v._id.toString() === req.userData.userId
    );
  }

  res.status(200).json({
    calendars: userWithCalendars.calendars.map((calendar) =>
      calendar.toObject({ getters: true })
    ),
  });
};

const getCalendarByCalendarId = async (req, res, next) => {
  const calendarId = req.params.calendarId;

  let calendar;
  try {
    calendar = await Calendar.findById(calendarId);
  } catch (err) {
    const error = new HttpError("Something failed, please try again", 500);
    return next(error);
  }

  // 캘린더에 속하지 않은 경우 접근 거부
  if (
    calendar.members.find((v) => {
      return v._id.toString() === req.userData.userId;
    }) === "undefined"
  ) {
    const error = new HttpError("Not authorized to access calendar.", 403);
    return next(error);
  }

  res.status(200).json({
    calendar: calendar.toObject({ getters: true }),
  });
};

const createCalendar = async (req, res, next) => {
  // 달력 생성
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
  if (!user) {
    const error = new HttpError("invalid access.", 422);
    return next(error);
  }

  const createdCalendar = new Calendar({
    name,
    description,
    image,
    members: [
      {
        _id: req.userData.userId,
        nickname: user.username,
        role: "Admin",
        administrator: "true",
      },
    ],
    owner: req.userData.userId,
    fixedEvents: [],
  });

  const member = {};

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
  const { name, description, calendarId } = req.body;

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Something failed, please try again.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for this calendar.", 404);
    return next(error);
  }

  // 유저가 그 캘린더에 속해 있는지 확인
  let isCalendarMemberInUser = user.calendars.find((v) => {
    return v.toString() === calendarId;
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
    const error = new HttpError("Something failed, please try again.", 500);
    return next(error);
  }

  if (!calendar) {
    const error = new HttpError("Could not find calendar for this id.", 404);
    return next(error);
  }

  const isCalendarMemberInCalendar = calendar.members.filter((v) => {
    v._id.toString() === req.userData.userId;
  });

  if (isCalendarMemberInCalendar.administrator === false) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  name !== "" ? (calendar.name = name) : null;
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
  const calendarId = req.params.calendarId;

  let calendar;
  try {
    // populate: 컬렉션 간 연결(ref)이 있는 경우에만 사용 가능?
    // User와 Event에 연결된 상태.
    calendar = await Calendar.findById(calendarId)
      .populate({ path: "members", populate: { path: "_id" } })
      .exec();
  } catch (err) {
    const error = new HttpError("Can not found calendar by id.", 500);
    return next(error);
  }

  // 캘린더가 존재하지 않는 경우
  if (!calendar) {
    const error = new HttpError("Could not find calendar for this id.", 404);
    return next(error);
  }

  // 캘린더의 소유주만 캘린더 삭제 가능
  if (calendar.owner.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this calendar.",
      403
    );
    return next(error);
  }

  let events;
  try {
    events = await Event.find({ calendar: calendarId }).exec();
  } catch (err) {
    const error = new HttpError("Can not found calendar by id.", 500);
    return next(error);
  }

  const imagePath = calendar.image;

  try {
    const sess = await mongoose.startSession();
    await sess.withTransaction(async () => {
      for (member of calendar.members) {
        events.length !== 0 ? await events.deleteMany({ session: sess }) : null;
        member._id.calendars.pull(calendar);

        await member._id.save({ session: sess });
      }

      await calendar.delete({ session: sess });
      // calendar -> owner -> (user) calendars 제거
    });
    sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "Can not found calendar by id, can not delete calendar.",
      500
    );
    return next(error);
  }

  // 이미지 삭제
  // fs.unlink(imagePath, (err) => {
  //   err === null ? console.log("delete image: " + imagePath) : console.log(err);
  // });
  res.status(200).json({ message: "Deleted Calendar." });
};

const addMemberToCalendar = async (req, res, next) => {
  // 달력에 멤버 추가. 닉네임, 역할을 입력 받음
  // 인수: 쿠키에 들은 유저 정보
  // body: calendarId(필수), nickname(선택), role(선택)
  const { calendarId, nickname, role } = req.body;

  let calendar;
  try {
    calendar = await Calendar.findById(calendarId);
  } catch (err) {
    const error = new HttpError("Something failed, please try again", 500);
    return next(error);
  }

  // 캘린더에 해당 유저가 이미 존재하는 경우, 더이상 진행하지 않음
  if (
    calendar.members.find((v) => {
      return v._id.toString() === req.userData.userId;
    }) !== "undefined"
  ) {
    const error = new HttpError(
      "This user is already invited this calendar.",
      204
    );
    return next(error);
  }
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Something failed, please try again", 500);
    return next(error);
  }

  const newMember = {
    _id: req.userData.userId,
    nickname: nickname === "" ? user.username : nickname,
    role,
    administrator: false,
  };

  try {
    const sess = await mongoose.startSession();
    await sess.withTransaction(async () => {
      calendar.members.push(newMember);
      await calendar.save({ session: sess });
      user.calendars.push(calendar);
      await user.save({ session: sess });
    });
    sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "Can not found calendar by id, can not add member.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "invite success" });
};

const setMemberToAdministratorOrNot = async (req, res, next) => {
  // 캘린더 관리자가 멤버를 관리자로 승격 혹은 강등
  // 인수: 쿠키에 들은 유저 정보
  // body: 관리자로 임명할 user id, 관리자를 임명할 캘린더
  // 관리자로 임명할 유저를 두명 이상 입력 받을 건지??
  const { userId, calendarId, administrator } = req.body;
  // administrator 는 1 or 0, true or false
  if (
    [1, 0, true, false].find((v) => {
      return v === administrator;
    }) === "undefined"
  ) {
    const error = new HttpError("Invalid input, please try again. ", 404);
    return next(error);
  }
  const adminUserId = req.userData.userId;

  let calendar;
  try {
    calendar = await Calendar.findById(calendarId);
  } catch (err) {
    const error = new HttpError("Something failed, please try again", 500);
    return next(error);
  }

  // 쿠키 유저가 캘린더 관리자인지 확인
  const isAdminUserId = calendar.members.find((v) => {
    return v._id.toString() === adminUserId;
  });

  if (isAdminUserId.administrator === false) {
    const error = new HttpError("You are not allowed to this process.", 403);
    return next(error);
  }

  // 입력된 유저가 캘린더에 속해있는지 확인
  if (
    calendar.members.find((v) => {
      return v._id.toString() === userId;
    }) === "undefined"
  ) {
    const error = new HttpError("Don't exist user in calendar.", 404);
    return next(error);
  }

  // 관리자 임명, 입력되어 있는 값과 입력된 값이 다를 경우에만 업데이트
  for (member of calendar.members) {
    if (member._id.toString() === userId) {
      // 입력되어 있는 값 === 입력된 값이 같은 경우 next
      // ex) 현재도 관리자인데 또다시 관리자로 임명할 경우
      if (member.administrator === !!administrator) {
        const error = new HttpError("Already setted.", 404);
        return next(error);
      }
      member.administrator = administrator;
    }
  }

  try {
    await calendar.save();
  } catch (err) {
    const error = new HttpError(
      "Can not found calendar by id, can not add member.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Add admin success" });
};

const setMemberToOwner = async (req, res, next) => {
  // 캘린더 관리자가 멤버를 관리자로 승격
  // 인수: 쿠키에 들은 유저 정보
  // body: 관리자로 임명할 user id, 관리자를 임명할 캘린더
  const { userId, calendarId } = req.body;
  const ownerUserId = req.userData.userId;

  let calendar;
  try {
    calendar = await Calendar.findById(calendarId);
  } catch (err) {
    const error = new HttpError("Something failed, please try again", 500);
    return next(error);
  }

  // 쿠키 유저가 캘린더 주인인지 확인
  if (calendar.owner.toString() !== ownerUserId) {
    const error = new HttpError("You are not allowed to this process.", 403);
    return next(error);
  }

  // 입력된 유저가 캘린더에 속해있는지 확인
  if (
    calendar.members.find((v) => {
      return v._id.toString() === userId;
    }) === "undefined"
  ) {
    const error = new HttpError("Don't exist user in calendar.", 404);
    return next(error);
  }

  // 주인 임명
  calendar.owner = userId;

  // 관리자 임명
  for (member of calendar.members) {
    member._id.toString() === userId ? (member.administrator = true) : null;
  }

  try {
    await calendar.save();
  } catch (err) {
    const error = new HttpError(
      "Can not found calendar by id, can not add member.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Change owner success" });
};

// DELETE 구현을 POST 요청로 할 것이냐, DELETE 요청을 사용하되 axios를 사용하여 body를 사용할 것이냐.
const deleteUserFromCalendar = async (req, res, next) => {
  // 캘린더 관리자가 캘린더에 속한 멤버를 삭제
  // 인수: 쿠키에 들은 유저 정보
  // 캘린더에서 삭제하고, 유저에서도 삭제하고
  // DELETE /api/calendar/:calendarId/:userId
  const adminUserId = req.userData.userId;
  const calendarId = req.params.calendarId;
  const deleteUserId = req.params.userId;

  let calendar;
  try {
    calendar = await Calendar.findById(calendarId);
  } catch (err) {
    const error = new HttpError("Something failed, please try again", 500);
    return next(error);
  }

  // 쿠키 유저가 캘린더 관리자인지 확인
  if (
    calendar.members.find((v) => {
      return v._id.toString() === adminUserId;
    }).administrator === false
  ) {
    const error = new HttpError("You are not allowed to this process.", 403);
    return next(error);
  }

  // 입력된 유저가 캘린더에 속해있는지 확인
  if (
    calendar.members.find((v) => {
      return v._id.toString() === deleteUserId;
    }) === "undefined"
  ) {
    const error = new HttpError("Don't exist user in calendar.", 404);
    return next(error);
  }

  // 삭제할 유저의 이벤트 추출
  try {
    events = await Event.find({
      calendar: calendarId,
      creator: deleteUserId,
    }).exec();
  } catch (err) {
    const error = new HttpError("Can not found calendar by id.", 500);
    return next(error);
  }

  // 삭제할 유저의 calendar.members 의 인덱스를 추출
  const deleteUserIndex = calendar.members.findIndex((v) => {
    return v._id.toString() === deleteUserId;
  });

  try {
    const sess = await mongoose.startSession();
    await sess.withTransaction(async () => {
      events.length !== 0 ? await events.deleteMany({ session: sess }) : null;
      calendar.members.splice(deleteUserIndex, 1);
      // 캘린더에서 유저 정보 삭제
      await calendar.save({ session: sess });
    });
    sess.endSession();
  } catch (err) {
    const error = new HttpError(
      "Can not found calendar by id, can not delete calendar.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Deleted user in calendar." });
};

exports.getCalendarsByUserId = getCalendarsByUserId;
exports.getCalendarByCalendarId = getCalendarByCalendarId;
exports.createCalendar = createCalendar;
exports.updateCalendarById = updateCalendarById;
exports.deleteCalendar = deleteCalendar;
exports.addMemberToCalendar = addMemberToCalendar;
exports.setMemberToAdministratorOrNot = setMemberToAdministratorOrNot;
exports.setMemberToOwner = setMemberToOwner;
exports.deleteUserFromCalendar = deleteUserFromCalendar;
