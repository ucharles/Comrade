const createServer = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { cookieSplit } = require("../util/cookie-spliter");

const Event = require("../models/event-model");

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const userId = new mongoose.Types.ObjectId();
  const userId2 = new mongoose.Types.ObjectId();
  const userId3 = new mongoose.Types.ObjectId();
  const calendarId = new mongoose.Types.ObjectId("5cabe64dcf0d4447fa60f5e2");

  await Event.insertMany([
    {
      title: "123",
      startTime: "2022-01-22T11:00:00.000+00:00",
      endTime: "2022-01-22T13:00:00.000+00:00",
      creator: userId,
      calendar: calendarId,
    },
    {
      title: "123",
      startTime: "2022-01-22T11:00:00.000+00:00",
      endTime: "2022-01-22T16:15:00.000+00:00",
      creator: userId2,
      calendar: calendarId,
    },
    {
      title: "123",
      startTime: "2022-01-22T12:00:00.000+00:00",
      endTime: "2022-01-22T16:00:00.000+00:00",
      creator: userId3,
      calendar: calendarId,
    },
  ])
    .then(function () {
      console.log("Data inserted"); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
});

//afterEach((done) => {});

afterAll(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
  await mongoose.connection.close();
});

const app = createServer();

describe("GET /api/events/calendar/:calendarId/:date/:timezone", () => {
  test("schedule test", async () => {
    const url =
      `/api/events/calendar/5cabe64dcf0d4447fa60f5e2/2022-01-22/` +
      encodeURIComponent("Asia/Seoul");

    // Event.find({}, function (err, docs) {
    //   if (err) throw err;
    //   console.log(JSON.stringify(docs));
    //   // or:
    //   console.log("%s", docs);
    // }).exec();

    await request(app)
      .get(url)
      .then(async (res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body.events).toBe(
          "Invalid input passed, please check your data."
        );
      });
  });
});
