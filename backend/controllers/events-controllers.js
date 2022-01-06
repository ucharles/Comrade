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
