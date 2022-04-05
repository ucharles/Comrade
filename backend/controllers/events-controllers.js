const moment = require("moment-timezone");
const { v4: uuid } = require("uuid");

const HttpError = require("../util/http-error");
const { validationResult } = require("express-validator");

const Event = require("../models/event-model");
const Calendar = require("../models/calendar-model");
const { maxEndTime } = require("../util/max-end-time");

const generateIntersectionEventsByDay = (
  events,
  calendarMembers,
  timezone,
  divMinute
) => {
  // 일별 교집합 작성 함수 시작
  // 인수: timezone, divMinute, events, calendarMembers

  const initTime = moment.tz(events[0].startTime, timezone);
  const lastTime = moment.tz(maxEndTime(events), timezone);
  const lastDiffInitDiv = lastTime.diff(initTime, "minutes") / divMinute;
  let eventMembers = [];
  let allSchedule = [];

  // 교집합 작성 전처리: 멤버 * 15분 단위로 매트릭스 작성
  for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
    eventMembers[eventIndex] = events[eventIndex].creator;
    let start = moment.tz(events[eventIndex].startTime, timezone);
    let end = moment.tz(events[eventIndex].endTime, timezone);
    let endDiffStartDiv = end.diff(start, "minutes") / divMinute;
    let startDiffInitDiv = start.diff(initTime, "minutes") / divMinute;
    let schedule = [];
    // 열 채우기
    for (
      let scheduleIndex = 0;
      scheduleIndex < lastDiffInitDiv;
      scheduleIndex++
    ) {
      if (
        (scheduleIndex === 0 && startDiffInitDiv === 0) ||
        scheduleIndex === startDiffInitDiv
      ) {
        schedule[scheduleIndex] = "S";
      } else if (scheduleIndex === endDiffStartDiv + startDiffInitDiv - 1) {
        schedule[scheduleIndex] = "E";
      } else if (
        scheduleIndex > startDiffInitDiv &&
        scheduleIndex < endDiffStartDiv + startDiffInitDiv - 1
      ) {
        schedule[scheduleIndex] = "1";
      } else {
        schedule[scheduleIndex] = "0";
      }
    }
    allSchedule.push(schedule);
  }

  // 교집합 판단
  let intersectionStart = [];
  let intersectionMembers = [];
  let intersectionJson = [];
  let intersectionCount = 0;

  // 전처리 매트릭스를 열방향(단위시간)으로 순회하며 교집합 판단 시작
  // 단위시간 * 멤버 로 구성된 매트릭스.
  for (let timeDivIndex = 0; timeDivIndex < lastDiffInitDiv; timeDivIndex++) {
    let endFlag = 0;
    for (
      let memberIndex = 0;
      memberIndex < eventMembers.length;
      memberIndex++
    ) {
      // 이벤트의 시작(S)인 경우
      if (allSchedule[memberIndex][timeDivIndex] === "S") {
        // 시작 시간을 기록
        intersectionMembers.push(eventMembers[memberIndex]);
        intersectionStart.push(timeDivIndex);
        intersectionCount = intersectionCount + 1;
      }
      // 이벤트의 끝(E)이고, 교집합 가능한 멤버가 2명 이상인 경우
      // endFlag 는 같은 단위시간 대에 이벤트 종료가 2건 이상 있을 경우를 상정.
      // 교집합이 여러번 계산되지 않도록 함.
      else if (
        endFlag === 0 &&
        allSchedule[memberIndex][timeDivIndex] === "E" &&
        intersectionCount >= 2
      ) {
        // E를 만난 경우, 현재의 인덱스를 저장
        endFlag = 1;
        let endMembers = [];
        let minDiv = lastDiffInitDiv;

        // 이벤트가 종료된 멤버를 따로 추려냄
        for (
          let findEndTimeMemberIndex = memberIndex;
          findEndTimeMemberIndex < eventMembers.length;
          findEndTimeMemberIndex++
        ) {
          if (allSchedule[findEndTimeMemberIndex][timeDivIndex] === "E") {
            // endMember 에서 index 요소만 사용되고 있다.
            endMembers.push({
              index: findEndTimeMemberIndex,
              memberId: eventMembers[findEndTimeMemberIndex],
              startTimeDiv: intersectionStart[findEndTimeMemberIndex],
            });
            timeDivIndex - intersectionStart[findEndTimeMemberIndex] < minDiv
              ? (minDiv = intersectionStart[findEndTimeMemberIndex])
              : null;
          }
        }

        // 교집합 작성 시작
        let currentDiv = timeDivIndex;
        for (
          let i = intersectionMembers.length - 1;
          intersectionStart[i] >= minDiv;
          i--
        ) {
          let interMembersArray = [];
          let registeredMembersArray = [];
          let calendarAllMembers = [];
          if (intersectionStart[i] < currentDiv) {
            // 출력용 JSON 작성
            let interMembers = intersectionMembers
              .slice(0, i + 1)
              .filter((data) => {
                return data !== "";
              });
            let registeredMembers = eventMembers.filter(
              (item) => !interMembers.includes(item)
            );
            for (
              let index = 0;
              index < calendarMembers.members.length;
              index++
            ) {
              // 교집합이 있는 경우. id는 객체(object)이므로 string 으로 변환 후 비교
              let insertObject = {
                id: calendarMembers.members[index]._id._id,
                image: calendarMembers.members[index]._id.image,
                nickname: calendarMembers.members[index].nickname,
                administrator: calendarMembers.members[index].administrator,
              };
              if (
                typeof interMembers.find(
                  (v) =>
                    v.toString() ===
                    calendarMembers.members[index]._id._id.toString()
                ) !== "undefined"
              ) {
                interMembersArray.push(insertObject);
              }
              // 이벤트는 등록했지만 교집합이 없는 경우
              else if (
                typeof registeredMembers.find(
                  (v) =>
                    v.toString() ===
                    calendarMembers.members[index]._id._id.toString()
                ) !== "undefined"
              ) {
                registeredMembersArray.push(insertObject);
              }
              // 이벤트를 등록하지 않은 경우
              else {
                calendarAllMembers.push(insertObject);
              }
            }
            // 교집합 정보 작성
            intersectionJson.push({
              id: uuid(),
              start: moment
                .tz(events[0].startTime, timezone)
                .add(intersectionStart[i] * divMinute, "minutes"),
              end: moment
                .tz(events[0].startTime, timezone)
                .add(timeDivIndex * divMinute, "minutes"),
              members: {
                intersection: interMembersArray,
                noIntersection: registeredMembersArray,
                noEvent: calendarAllMembers,
              },
              depth: timeDivIndex - intersectionStart[i],
            });
            currentDiv = intersectionStart[i];
          }
        }

        // 교집합 작성 완료된 멤버는 교집합 pool 에서 제외
        for (let i = 0; i < endMembers.length; i++) {
          intersectionMembers[endMembers[i].index] = "";
          intersectionStart[endMembers[i].index] = "";
          intersectionCount = intersectionCount - 1;
        }
      }
      // 세로로 순회 중, S 다음에 0이 나온 경우 (순회 끝)
      else if (
        memberIndex > 0 &&
        allSchedule[memberIndex][timeDivIndex] === "0"
      ) {
        if (allSchedule[memberIndex - 1][timeDivIndex] === "S") {
          break;
        }
      }
    }
  }
  return intersectionJson.sort(function (a, b) {
    const membersA = a.members.intersection.length;
    const membersB = b.members.intersection.length;
    return membersB - membersA || b.depth - a.depth;
  });
};

// 테스트용
const getEvents = async (req, res, next) => {
  let events;
  try {
    events = await Event.find().exec();
  } catch (err) {
    const error = new HttpError("Could not found events", 500);
    return next(error);
  }

  res.status(200).json({
    events,
  });
};

const getEventsByMonth = async (req, res, next) => {
  const userId = req.userData.userId;
  const inputCalendar = req.params.calendarId;
  const inputDate = req.params.date;
  const timezone = decodeURIComponent(req.params.timezone);

  // 입력된 날짜와 타임존이 유효한지 확인
  if (!moment.tz(inputDate, timezone).isValid()) {
    const error = new HttpError("Please check Date or Timezone.", 402);
    return next(error);
  }

  inputDate = inputDate.substr(0, 7) + "-01";

  let events;
  try {
    events = await Event.find({
      creator: userId,
      calendar: inputCalendar,
      startTime: {
        $gte: new Date(
          moment.tz(inputDate + " 00:00", timezone).utc()
        ).toISOString(),
        $lt: new Date(
          moment
            .tz(inputDate + " 00:00", timezone)
            .endOf("month")
            .add({ hours: 23, minutes: 59 })
            .utc()
        ).toISOString(),
      },
    })
      .sort({ startTime: 1, endTime: 1 })
      .select({ title: 0, calendar: 0 })
      .exec();
  } catch (err) {
    const error = new HttpError("Could not found events", 500);
    return next(error);
  }

  // 제목 생성 필요?
  // 1. HH:MM~HH:MM
  // 2. HH:MM~ (OOm)
  // 3. HH:MM~HH:MM (OOm)
  for (element of events) {
    let start = moment.tz(element.startTime, timezone).format("HH:mm");
    let end = moment.tz(element.endTime, timezone).format("HH:mm");
    let diff =
      (new Date(end).getTime() - new Date(start).getTime()) / 1000 / 60;

    element.title = `${start}~${end} (${diff}m)`;
  }

  res.status(200).json({
    events,
  });
};

const getIntersectionEventsByDay = async (req, res, next) => {
  const inputCalendar = req.params.calendarId;
  const inputDate = req.params.date;
  const timezone = decodeURIComponent(req.params.timezone);

  // 입력된 날짜와 타임존이 유효한지 확인
  if (!moment.tz(inputDate, timezone).isValid()) {
    const error = new HttpError("Please check Date or Timezone.", 402);
    return next(error);
  }

  // 15분을 단위시간의 기준으로 정함. 모든 로직은 15분 단위로 행해짐.
  const divMinute = 15;

  // 입력받은 timezone 을 이용하여 inputDate 를 변환
  // 특정 지역 날짜 + 특정 지역 timezone = UTC
  const utcInputDate = moment.tz(inputDate + " 00:00", timezone).utc();
  // YYYY-MM-DDT00:00:00+09:00
  // {startTime :{"$gte":ISODate('2022-01-22T00:00:00Z')}}

  // MongoDB stores dates as 64-bit integers,
  // which means that Mongoose does not store timezone information by default.
  // When you call Date#toString(), the JavaScript runtime will use your OS' timezone.

  let events;
  let calendarMembers;

  try {
    events = await Event.find({
      calendar: inputCalendar,
      startTime: {
        $gte: new Date(
          moment.tz(inputDate + " 00:00", timezone).utc()
        ).toISOString(),
        $lt: new Date(
          moment
            .tz(inputDate + " 00:00", timezone)
            .add({ hours: 23, minutes: 59 })
            .utc()
        ).toISOString(),
      },
    })
      .sort({ startTime: 1, endTime: 1 })
      .select({ _id: 1, startTime: 1, endTime: 1, creator: 1 })
      .exec();

    calendarMembers = await Calendar.findById(inputCalendar)
      .populate({
        path: "members",
        populate: { path: "_id", select: "_id username image" },
      })
      .select({
        members: 1,
      })
      .exec();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Querying events error, please try again.",
      500
    );
    return next(error);
  }
  // console.log(events);
  // console.log(calendarMembers.members);

  if (events.length === 0) {
    const error = new HttpError("Does not exist event Data.", 404);
    return next(error);
  }

  const intersectionJson = generateIntersectionEventsByDay(
    events,
    calendarMembers,
    timezone,
    divMinute
  );
  console.log(intersectionJson);

  res
    .status(201)
    .json({ events: events, intersection: intersectionJson.slice(0, 6) });

  // events 변수 자체가 커서인듯...
  // https://stackoverflow.com/questions/37024829/cursor-map-toarray-vs-cursor-toarray-thenarray-array-map

  // .../api/calendar/:calendarId/date/:day
  // .../api/calendar/:calendarId/month/:yearmonth
  // .../api/calendar/:calendarId/fixed-event/timezone/:timezone
  // input 정보로 Timezone 도 필요함
  // 쿼리를 쓰는 것이 좋은가? 필터를 사용해야 하는 것 같기도 하고..?
  // API URL 이 너무 길면 이해하기 힘든 것 아닌가...

  // event model query
  // event.calendar = inputCalendar
  // startDate or endDate 의 년월일 = inputDate
  // mongoose date 객체 검색법을 찾아봐야겠다.
  // 검색 결과 패턴은 3가지.
  // 시작과 끝이 모두 당일 / 시작은 당일, 끝은 다음날
  // MongoDB의 이해도가 낮은 것 같다. 아직 RDB 의 SQL 처럼 사고하는 것 같다.
  // 캘린더의 멤버 수가 아니라 그 날짜에 등록한 멤버를 구해야 할듯...

  // 1. 특정 캘린더, 특정 날짜의 이벤트를 모두 불러옴
  // 2. 특정 날짜에 이벤트를 등록한 사람 수
  // 3. 겹치는 사람 수 = 특정 날짜에 이벤트를 등록한 사람 수

  // 한명일 경우? 교집합 없음
  // 두명 이상부터 -> 교집합 계산 시작
  // 입력자 수 = 교집합 카운트 *BEST*
  // 과반수 이상인 교집합을 구해서 ... 차순위로 보여주는 게 좋지 않을까?

  // 결과를 순회하면서 배열을 3개 만듦.
  // startTime, endTime, user
  // startTime 의 갯수와 endTime 의 갯수는 반드시 같음. user 는 중복이 있을 수 있음.
  // user 배열에서 입력자 수를 획득.
  // startTime 과 endTime 은 세트로 계산해야함. 단순하게 값을 각각 따로 나열하여 비교하는 걸로는 교집합을 구할 수 없음...(어찌보면 당연한)
  // startTime 의 오름차 순으로 객체를 정렬한 뒤, 15분 단위로 판단이 들어가야 하나? 이게 맞을 지도..
  // 프론트에서 값 입력도 15분 단위로 받자.
  // 루프는 좀 돌겠지만 이게 단순할지도...

  // 교집합을 찾는 방법
  // 교집합 객체: id, startTime, endTime
  // 1. 15분 단위로 판단을 하여 교집합 카운터를 증가, 감소 시킴
  // JS 배열 쓰는 법을 알아야 할듯... 객체를 빼내는 건 가능한가? key 항목만 있으면 가능한가?
  // splice 함수를 사용하여 간단하게 가능! 그럼 이게 나을려나...
  //
  // 2. 2차원 배열을 만든다. 사람수 x 최소 시작 시간~최대 종료 시간 (15분 단위)
  // 최소 시작 시간은 정렬하면 나오지만... 최대 종료 시간은 어떻게 구하지(종료시간 기준 정렬?)
  // 시작시간은 S, 시작과 종료 사이는 1, 종료는 E, 빈 시간은 0
  // S가 들어오면 시작시간 갱신, 카운터 증가, 멤버 추가
  // E가 들어오면 종료시간 갱신, 교집합 갱신(카운터, 멤버, 시작&종료), 멤버 제외, 카운터 감소.
};

const getIntersectionEventsByMonth = async (req, res, next) => {
  // input Data: 년월일(), Timezone, 캘린더 정보
  const inputCalendar = req.params.calendarId;
  let inputMonth = req.params.date;
  const timezone = decodeURIComponent(req.params.timezone);

  inputMonth = inputMonth.substr(0, 7) + "-01";

  // 년월, Timezone 정보가 올바른지 확인
  if (!moment.tz(inputMonth, timezone).isValid()) {
    const error = new HttpError("Please check Date or Timezone.", 402);
    return next(error);
  }

  const divMinute = 15;

  let events;
  let calendarMembers;

  //
  // DB Query
  // 이벤트 호출 쿼리, 년월 기준 한달 분(Timezone 적용)
  // 캘린더 호출 쿼리
  try {
    events = await Event.find({
      calendar: inputCalendar,
      startTime: {
        $gte: new Date(
          moment.tz(inputMonth + " 00:00", timezone).utc()
        ).toISOString(),
        $lt: new Date(
          moment
            .tz(inputMonth + " 00:00", timezone)
            .endOf("month")
            .utc()
        ).toISOString(),
      },
    })
      .sort({ startTime: 1, endTime: 1 })
      .select({ title: 0, calendar: 0 })
      .exec();

    calendarMembers = await Calendar.findById(inputCalendar)
      .populate({
        path: "members",
        populate: { path: "_id", select: "_id username image" },
      })
      .select({
        members: 1,
      })
      .exec();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Querying events error, please try again.",
      500
    );
    return next(error);
  }
  // console.log(events);
  // console.log(calendarMembers.members);

  if (events.length === 0) {
    const error = new HttpError("Does not exist event Data.", 404);
    return next(error);
  }

  let eventDividerByDate = moment.tz(events[0].startTime, timezone);
  let dayArray = [];
  let monthArray = [];

  // 한달치 이벤트를 일별로 분리
  for (let i = 0; i < events.length; i++) {
    if (
      moment.tz(events[i].startTime, timezone).format("YYYYMMDD").toString() !==
      eventDividerByDate.format("YYYYMMDD").toString()
    ) {
      eventDividerByDate = moment.tz(events[i].startTime, timezone);

      if (dayArray.length > 0) {
        monthArray.push(dayArray);
        dayArray = [];
      }
    }
    if (i === events.length - 1) {
      monthArray.push(dayArray);
    }
    dayArray.push(events[i]);
  }

  // 반복문
  let intersectionByMonthJson = [];
  for (let i = 0; i < monthArray.length; i++) {
    // 일별로 분리한 한달치 이벤트를 하루마다 교집합 작성 (일별 교집합 API 에서 작성한 로직을 함수로 분리)
    let intersectionByDayJson = generateIntersectionEventsByDay(
      monthArray[i],
      calendarMembers,
      timezone,
      divMinute
    );
    // 작성된 교집합 중에 가장 큰 depth 와 가장 많은 교집합 멤버수를 가진 교집합 출력, 전역변수에 보관
    let largestIntersection = [];
    let maxMemberCount = 0;
    let maxDepth = 0;
    // 최댓값 확인(멤버수, 시간 길이)
    for (let k = 0; k < intersectionByDayJson.length; k++) {
      if (
        intersectionByDayJson[k].members.intersection.length > maxMemberCount &&
        intersectionByDayJson[k].depth > maxDepth
      ) {
        maxMemberCount = intersectionByDayJson[k].members.intersection.length;
        maxDepth = intersectionByDayJson[k].depth;
      }
    }
    // 최댓값에 해당하는 이벤트 정보 추출
    for (let k = 0; k < intersectionByDayJson.length; k++) {
      if (
        intersectionByDayJson[k].members.intersection.length ===
          maxMemberCount &&
        intersectionByDayJson[k].depth === maxDepth
      ) {
        largestIntersection.push(intersectionByDayJson[k]);
      }
    }
    largestIntersection.length === 1
      ? intersectionByMonthJson.push(largestIntersection[0])
      : intersectionByMonthJson.push(largestIntersection);
  }
  console.log(intersectionByMonthJson);

  // 이벤트 전역변수 출력
  res.status(201).json({ events: intersectionByMonthJson });
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

  const { date, startTime, endTime, timezone, calendarId, timezoneOffset } =
    req.body;

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

  date.sort((a, b) => {
    const dateA = moment.tz(a, timezone);
    const dateB = moment.tz(b, timezone);
    return dateA - dateB;
  });

  // 입력된 날짜 범위 안에 있는 모든 이벤트 추출
  let events;
  try {
    events = await Event.find({
      creator: req.userData.userId,
      calendar: calendarId,
      startTime: {
        $gte: new Date(moment.tz(date[0], timezone).utc()).toISOString(),
        $lt: new Date(
          moment
            .tz(date[date.length - 1], timezone)
            .add(1, "days")
            .utc()
        ).toISOString(),
      },
    })
      .sort({ startTime: 1, endTime: 1 })
      .exec();
  } catch (err) {
    const error = new HttpError("Could not found events", 500);
    return next(error);
  }

  let conflictTime = [];

  date.forEach((value, index, array) => {
    if (!regexDate.test(value)) {
      const error = new HttpError("Invalid Date value", 500);
      return next(error);
    }
    let startTime = moment.tz(value + " " + startTime, timezone);
    let endTime = moment.tz(value + " " + endTime, timezone).add(addDay, "day");

    // 같은 달력에 이벤트가 중복 등록된 경우, 제외 처리
    // 중복 등록을 찾기 위한 반복문 횟수가 너무 많다. 리팩토링 필요.
    let count = 0;
    for (value of events) {
      let eventStartTime = moment.tz(value.startTime, timezone);
      let eventEndTime = moment.tz(value.endTime, timezone);
      if (startTime >= eventStartTime && eventEndTime > startTime) {
        conflictTime.push({
          startTime: eventStartTime,
          endTime: eventEndTime,
        });
        count++;
      }
    }
    // title 은 삭제 예정
    if (count === 0) {
      insertEventsArray.push({
        title:
          addDay === 1
            ? startTime + "~(next day)" + endTime
            : startTime + "~" + endTime,
        startTime,
        endTime,
      });
    }
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

  res.status(201).json({ events: insertEventsArray, conflict: conflictTime });

  // data validation

  // date: 배열, 순회하면서 확인
  // startTime: 시간, 확인
  // endTime: 시간, 확인
  // timezone: -11 ~ 14 사이의 숫자
  // timezoneOffset: 문자열, 참고용으로 받음
};

const deleteEvents = async (req, res, next) => {
  // POST 요청
  const eventsId = req.body.eventsId; // array

  try {
    await Event.deleteMany({
      _id: { $in: eventsId },
      creator: req.userData.userId,
    }).exec();
  } catch (err) {
    const error = new HttpError("Could not delete the event.", 500);
    return next(error);
  }
  res.status(200).json({ message: "Deleted events." });
};

exports.getEvents = getEvents;
exports.getEventsByMonth = getEventsByMonth;
exports.createEvents = createEvents;
exports.deleteEvents = deleteEvents;
exports.getIntersectionEventsByDay = getIntersectionEventsByDay;
exports.getIntersectionEventsByMonth = getIntersectionEventsByMonth;
