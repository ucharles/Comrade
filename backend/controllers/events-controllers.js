const moment = require("moment-timezone");

const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const Event = require("../models/event-model");
const Fixedevent = require("../models/fixedevent-model");

const getEvents = async (req, res, next) => {
  let events;
  try {
    events = await Event.find().exec();
  } catch (err) {
    const error = new HttpError("Could not found events", 500);
    return next(error);
  }

  res.json({
    events: events.map((event) => event.toObject({ getters: true })),
  });
};

const getEventsByDate = async (req, res, next) => {
  const inputDate = req.params.date;
  // input: 달력 정보, 날짜, 유저의 위치 정보

  // check:
  // 유효한 날짜 형식인지?
  // 요청하는 달력이 이 유저가 속한 달력인지?
  // 관리자인지?: 관리자면 일정 확정 권한을 줘야 함 <- 프론트가 할일?

  // 필요한 정보:
  // 입력받은 timezone 기준으로 일정을 계산
  // 입력받은 날짜를 기준으로 starTime 혹은 endTime가 그 날짜 안에 있는 경우
  // 입력: 2021-01-01 -> start가 2021-12-31이어도 end가 2021-01-01에 있으면 추출 대상
  // 달력: 속한 유저들
  // 이벤트: 속한 유저들의 일정들

  // 출력할 정보
  // timezone 기준으로 추출한 달력에 속한 유저들의 일정
  // 일정들의 교집합(계산)
  //

  let events;
  try {
    events = await Event.find().exec();
  } catch (err) {
    const error = new HttpError("Could not found events", 500);
    return next(error);
  }

  res.json({
    events: events.map((event) => event.toObject({ getters: true })),
  });
};

const createEvents = async (req, res, next) => {
  const regexDate = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  const { date, startTime, endTime, timezone, timezoneOffset } = req.body;

  let addDay = 0;
  const startDate = moment.tz("2022-01-01" + " " + startTime, timezone);
  const endDate = moment.tz("2022-01-01" + " " + endTime, timezone);

  if (!startDate.isValid() || !endDate.isValid()) {
    const error = new HttpError("Invalid Time Value", 500);
    return next(error);
  }
  startDate > endDate ? (addDay = 1) : null;

  let insertEventsArray = [];

  const timezoneTo5Digit = (timezone) => {
    let timezoneReturn;
    if (typeof timezone === "number" && timezone >= -11 && timezone <= 14) {
      if (timezone > 0) {
        timezone.toString().length === 1
          ? (timezoneReturn = "+0" + timezone.toString() + "00")
          : (timezoneReturn = "+" + timezone.toString() + "00");
      } else {
        timezone.toString().length === 2
          ? (timezoneReturn = "-0" + timezone.toString().charAt(1) + "00")
          : (timezoneReturn = timezone.toString() + "00");
      }
    } else {
      const error = new HttpError("Invalid timezone value", 500);
      return next(error);
    }

    return timezoneReturn;
  };

  date.forEach((value, index, array) => {
    if (!regexDate.test(value)) {
      const error = new HttpError("Invalid Date value", 500);
      return next(error);
    }
    insertEventsArray.push({
      title:
        addDay === 1
          ? startTime + "~(next day)" + endTime
          : startTime + "~" + endTime,

      startTime: moment.tz(value + " " + startTime, timezone),
      endTime: moment.tz(value + " " + endTime, timezone).add(addDay, "day"),
    });
  });

  try {
    await Event.insertMany(insertEventsArray);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating Events failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ events: insertEventsArray });

  // data validation

  // date: 배열, 순회하면서 확인
  // startTime: 시간, 확인
  // endTime: 시간, 확인
  // timezone: -11 ~ 14 사이의 숫자
  // timezoneOffset: 문자열, 참고용으로 받음
};

exports.getEvents = getEvents;
exports.createEvents = createEvents;
exports.getEventsByDate = getEventsByDate;
