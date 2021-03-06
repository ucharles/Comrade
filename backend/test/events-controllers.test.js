const createServer = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("../models/event-model");
const Calendar = require("../models/calendar-model");
const User = require("../models/user-model");

afterAll(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
  await mongoose.connection.close();
});

beforeAll(async () => {
  await mongoose.connect(
    process.env.DB_URI_TEST,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    {}
  );

  const userId = new mongoose.Types.ObjectId("5cabe64dcf0d4447fa60f5e9");
  const userId2 = new mongoose.Types.ObjectId("5cabe64dcf0d4447fa60f5e8");
  const userId3 = new mongoose.Types.ObjectId("5cabe64dcf0d4447fa60f5e7");
  const userId4 = new mongoose.Types.ObjectId("5cabe64dcf0d4447fa60f5e6");
  const calendarId = new mongoose.Types.ObjectId("5cabe64dcf0d4447fa60f5e2");
  const calendarId2 = new mongoose.Types.ObjectId("5cabe64dcf0d4447fa60f5e3");
  const password = await bcrypt.hash("123123", 12);

  await User.insertMany([
    {
      _id: userId,
      username: "user1",
      email: "hhh1@hhh.com",
      password,
      image: "helpme1",
      calendars: [calendarId, calendarId2],
    },
    {
      _id: userId2,
      username: "user2",
      email: "hhh2@hhh.com",
      password,
      image: "helpme2",
      calendars: [calendarId],
    },
    {
      _id: userId3,
      username: "user3",
      email: "hhh3@hhh.com",
      password,
      image: "helpme3",
      calendars: [calendarId],
    },
    {
      _id: userId4,
      username: "user4",
      email: "hhh4@hhh.com",
      password,
      image: "helpme4",
      calendars: [calendarId],
    },
  ])
    .then(function () {
      console.log("User Data inserted"); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await Calendar.insertMany([
    {
      _id: calendarId,
      name: "calendar 1",
      members: [
        { _id: userId, nickname: "he1", role: "nin", administrator: false },
        { _id: userId2, nickname: "he2", role: "whm", administrator: false },
        { _id: userId3, nickname: "he3", role: "mch", administrator: true },
        { _id: userId4, nickname: "he4", role: "war", administrator: false },
      ],
      owner: userId3,
    },
    {
      _id: calendarId2,
      name: "calendar 2",
      members: [
        { _id: userId, nickname: "he1", role: "nin", administrator: true },
      ],
      owner: userId,
    },
  ])
    .then(function () {
      console.log("Calendar Data inserted"); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  await Event.insertMany([
    {
      title: "123",
      startTime: "2022-01-22T11:00:00.000+00:00",
      endTime: "2022-01-22T15:00:00.000+00:00",
      creator: userId,
      calendar: calendarId,
    },
    {
      title: "123",
      startTime: "2022-01-23T11:00:00.000+00:00",
      endTime: "2022-01-23T15:00:00.000+00:00",
      creator: userId,
      calendar: calendarId,
    },
    {
      title: "123",
      startTime: "2022-01-24T11:00:00.000+00:00",
      endTime: "2022-01-24T15:00:00.000+00:00",
      creator: userId,
      calendar: calendarId,
    },
    {
      title: "123",
      startTime: "2022-01-25T11:00:00.000+00:00",
      endTime: "2022-01-25T15:00:00.000+00:00",
      creator: userId,
      calendar: calendarId,
    },
    {
      title: "123",
      startTime: "2022-01-22T11:00:00.000+00:00",
      endTime: "2022-01-22T15:00:00.000+00:00",
      creator: userId2,
      calendar: calendarId,
    },
    {
      title: "123",
      startTime: "2022-01-23T11:00:00.000+00:00",
      endTime: "2022-01-23T15:00:00.000+00:00",
      creator: userId2,
      calendar: calendarId,
    },
    {
      title: "123",
      startTime: "2022-01-25T11:00:00.000+00:00",
      endTime: "2022-01-25T15:00:00.000+00:00",
      creator: userId2,
      calendar: calendarId,
    },
  ])
    .then(function () {
      console.log("Event Data inserted"); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
});

//afterEach((done) => {});

const app = createServer();

describe("GET /api/events/calendar/:calendarId/one-user-month/:date/:timezone", () => {
  test("schedule test", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh1@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];
    cookie.push(
      `tz=${encodeURIComponent("Asia/Seoul")}; Path=/; Expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 14
      )}`
    );
    console.log(cookie);

    const url = `/api/events/calendar/5cabe64dcf0d4447fa60f5e2/one-user-month/2022-01-22~2022-02-01/`;
    await request(app)
      .get(url)
      .set({ cookie: cookie })
      .then(async (res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.events).toStrictEqual("");
      });
  });
});

describe("GET /api/events/calendar/:calendarId/int-day/:date", () => {
  test("schedule test", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh1@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];
    cookie.push(
      `tz=${encodeURIComponent("Asia/Seoul")}; Path=/; Expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 14
      )}`
    );

    const url = `/api/events/calendar/5cabe64dcf0d4447fa60f5e2/int-day/2022-01-22`;

    await request(app)
      .get(url)
      .set({ cookie: cookie })
      .then(async (res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.intersection).toStrictEqual("");
        expect(res.body.intersection).toStrictEqual([
          {
            depth: 3,
            endTime: "2022-01-22T12:45:00.000Z",
            members: {
              intersection: [
                {
                  id: "5cabe64dcf0d4447fa60f5e9",
                  administrator: false,
                  image: "helpme1",
                  nickname: "he1",
                },
                {
                  id: "5cabe64dcf0d4447fa60f5e8",
                  administrator: false,
                  image: "helpme2",
                  nickname: "he2",
                },
                {
                  id: "5cabe64dcf0d4447fa60f5e7",
                  administrator: true,
                  image: "helpme3",
                  nickname: "he3",
                },
              ],
              noEvent: [
                {
                  id: "5cabe64dcf0d4447fa60f5e6",
                  administrator: false,
                  image: "helpme4",
                  nickname: "he4",
                },
              ],
              noIntersection: [],
            },
            startTime: "2022-01-22T12:00:00.000Z",
            id: "*",
          },
          {
            depth: 7,
            endTime: "2022-01-22T12:45:00.000Z",
            members: {
              intersection: [
                {
                  id: "5cabe64dcf0d4447fa60f5e9",
                  administrator: false,
                  image: "helpme1",
                  nickname: "he1",
                },
                {
                  id: "5cabe64dcf0d4447fa60f5e8",
                  administrator: false,
                  image: "helpme2",
                  nickname: "he2",
                },
              ],
              noEvent: [
                {
                  id: "5cabe64dcf0d4447fa60f5e6",
                  administrator: false,
                  image: "helpme4",
                  nickname: "he4",
                },
              ],
              noIntersection: [
                {
                  id: "5cabe64dcf0d4447fa60f5e7",
                  administrator: true,
                  image: "helpme3",
                  nickname: "he3",
                },
              ],
            },
            startTime: "2022-01-22T11:00:00.000Z",
          },
          {
            depth: 15,
            endTime: "2022-01-22T15:45:00.000Z",
            members: {
              intersection: [
                {
                  id: "5cabe64dcf0d4447fa60f5e8",
                  administrator: false,
                  image: "helpme2",
                  nickname: "he2",
                },
                {
                  id: "5cabe64dcf0d4447fa60f5e7",
                  administrator: true,
                  image: "helpme3",
                  nickname: "he3",
                },
              ],
              noEvent: [
                {
                  id: "5cabe64dcf0d4447fa60f5e6",
                  administrator: false,
                  image: "helpme4",
                  nickname: "he4",
                },
              ],
              noIntersection: [
                {
                  id: "5cabe64dcf0d4447fa60f5e9",
                  administrator: false,
                  image: "helpme1",
                  nickname: "he1",
                },
              ],
            },
            startTime: "2022-01-22T12:00:00.000Z",
          },
        ]);
      });
  });
});

describe("GET /api/events/calendar/:calendarId/int-month/:date/:timezone", () => {
  test("schedule test", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh1@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];
    cookie.push(
      `tz=${encodeURIComponent("Asia/Seoul")}; Path=/; Expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 14
      )}`
    );

    const url = `/api/events/calendar/5cabe64dcf0d4447fa60f5e2/int-month/2022-01-01/`;

    await request(app)
      .get(url)
      .set({ cookie: cookie })
      .then(async (res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.events).toStrictEqual([
          {
            depth: 3,
            endTime: "2022-01-22T12:45:00.000Z",
            members: {
              intersection: [
                {
                  id: "5cabe64dcf0d4447fa60f5e9",
                  administrator: false,
                  image: "helpme1",
                  nickname: "he1",
                },
                {
                  id: "5cabe64dcf0d4447fa60f5e8",
                  administrator: false,
                  image: "helpme2",
                  nickname: "he2",
                },
                {
                  id: "5cabe64dcf0d4447fa60f5e7",
                  administrator: true,
                  image: "helpme3",
                  nickname: "he3",
                },
              ],
              noEvent: [
                {
                  id: "5cabe64dcf0d4447fa60f5e6",
                  administrator: false,
                  image: "helpme4",
                  nickname: "he4",
                },
              ],
              noIntersection: [],
            },
            startTime: "2022-01-22T12:00:00.000Z",
          },
          {
            depth: 3,
            endTime: "2022-01-23T12:45:00.000Z",
            members: {
              intersection: [
                {
                  id: "5cabe64dcf0d4447fa60f5e9",
                  administrator: false,
                  image: "helpme1",
                  nickname: "he1",
                },
                {
                  id: "5cabe64dcf0d4447fa60f5e8",
                  administrator: false,
                  image: "helpme2",
                  nickname: "he2",
                },
                {
                  id: "5cabe64dcf0d4447fa60f5e7",
                  administrator: true,
                  image: "helpme3",
                  nickname: "he3",
                },
              ],
              noEvent: [
                {
                  id: "5cabe64dcf0d4447fa60f5e6",
                  administrator: false,
                  image: "helpme4",
                  nickname: "he4",
                },
              ],
              noIntersection: [],
            },
            startTime: "2022-01-23T12:00:00.000Z",
          },
        ]);
      });
  });
});
