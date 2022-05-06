const HttpError = require("../util/http-error");
const { v4: uuid } = require("uuid");

const Calendar = require("../models/calendar-model");
const Invite = require("../models/invite-model");

const { diffDate } = require("../util/diff-date");

const getCalendarByInviteId = async (req, res, next) => {
  const inviteId = req.params.InviteId;

  // inviteId 검색, calendarId 출력
  let inviteInfo;
  try {
    inviteInfo = await Invite.findOne(inviteId).exec();
  } catch (err) {
    const error = new HttpError("Getting data failed, please try again", 500);
    return next(error);
  }

  // 존재하지 않거나, 유효기간이 지난 경우 403
  if (!inviteInfo || diffDate(inviteInfo.expire, "hour") < 0) {
    const error = new HttpError("Getting data failed, please try again", 403);
    return next(error);
  }

  let calendar;
  try {
    calendar = await Calendar.findById(inviteInfo.calendarId).exec();
  } catch (err) {
    const error = new HttpError("Getting data failed, please try again", 500);
    return next(error);
  }

  if (!calendar) {
    const error = new HttpError("Getting data failed, please try again", 403);
    return next(error);
  }

  // 초대 링크에 참여하려는 유저가 이미 해당 달력에 가입된 경우
  if (calendar.members.find((v) => v._id.toString() === req.userData.userId)) {
    res.status(200).json({
      _id: calendar._id,
      message: "Already invited.",
    });
    return next();
  }

  res.status(200).json({
    _id: calendar._id,
    name: calendar.name,
    description: calendar.description,
    image: calendar.image,
    members: calendar.members.length,
  });
};

const createInvite = async (req, res, next) => {
  const { calendarId } = req.body;
  const userId = req.userData.userId;

  // calendarId 확인
  let calendar;
  try {
    calendar = await Calendar.findById(calendarId).exec();
  } catch (err) {
    const error = new HttpError("Getting data failed, please try again", 500);
    return next(error);
  }

  // input의 calendarId로 달력을 검색했지만, 달력이 존재하지 않는 경우
  if (!calendar) {
    const error = new HttpError("Getting data failed, please try again", 403);
    return next(error);
  }

  // 초대 링크를 생성하려는 유저가 달력에 가입되지 않은 경우
  if (calendar.members.find((v) => v._id.toString() === userId) === undefined) {
    const error = new HttpError("Getting data failed, please try again", 403);
    return next(error);
  }

  // calendarId로 Invite collection 검색
  let inviteInfo;
  try {
    inviteInfo = await Invite.findOne({ calendarId }).exec();
  } catch (err) {
    const error = new HttpError("Getting data failed, please try again", 500);
    return next(error);
  }

  let inviteId, expire;
  try {
    inviteId = uuid();
    expire = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);

    // Invite 검색 결과가 존재하지 않음
    if (!inviteInfo) {
      const createInviteInfo = new Invite({
        inviteId,
        calendarId,
        expire,
      });
      await createInviteInfo.save();
    }
    // Invite 검색 결과는 존재하나 expire 잔여 기간이 1일 미만
    else if (diffDate(inviteInfo.expire, "day") < 1) {
      inviteInfo.inviteId = inviteId;
      inviteInfo.expire = expire;
      await inviteInfo.save();
    }
    // Invite 검색 결과가 존재하고, expire 잔여 기간이 1일 이상
    else {
      inviteId = inviteInfo.inviteId;
      expire = inviteInfo.expire;
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError("DB error", 500);
    return next(error);
  }

  res.status(201).json({ inviteId, expire });
};

exports.getCalendarByInviteId = getCalendarByInviteId;
exports.createInvite = createInvite;
