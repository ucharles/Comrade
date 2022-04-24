const createServer = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("../models/event-model");
const Calendar = require("../models/calendar-model");
const User = require("../models/user-model");

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
    {
      title: "123",
      startTime: "2022-01-23T11:00:00.000+00:00",
      endTime: "2022-01-23T13:00:00.000+00:00",
      creator: userId,
      calendar: calendarId,
    },
    {
      title: "123",
      startTime: "2022-01-23T11:00:00.000+00:00",
      endTime: "2022-01-23T16:15:00.000+00:00",
      creator: userId2,
      calendar: calendarId,
    },
    {
      title: "123",
      startTime: "2022-01-23T12:00:00.000+00:00",
      endTime: "2022-01-23T16:00:00.000+00:00",
      creator: userId3,
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

afterAll(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
  await mongoose.connection.close();
});

const app = createServer();

describe("GET /api/calendar", () => {
  test("OK", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh1@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];

    const url = `/api/calendar`;
    await request(app)
      .get(url)
      .set({ cookie: cookie })
      .then(async (res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.calendars[0]._id).toEqual("5cabe64dcf0d4447fa60f5e2");
        expect(res.body.calendars[1]._id).toEqual("5cabe64dcf0d4447fa60f5e3");
      });
  });
});
describe("GET /api/calendar/admin", () => {
  test("OK", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh1@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];

    const url = `/api/calendar/admin`;
    await request(app)
      .get(url)
      .set({ cookie: cookie })
      .then(async (res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body.calendarsAdmin);
      });
  });
});

describe("GET /api/calendar/:calendarId", () => {
  test("OK", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh1@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];

    const url = `/api/calendar/5cabe64dcf0d4447fa60f5e2`;
    await request(app)
      .get(url)
      .set({ cookie: cookie })
      .then(async (res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.calendar._id).toEqual("5cabe64dcf0d4447fa60f5e2");
      });
  });
});

describe("POST /api/calendar", () => {
  test("OK", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh1@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];

    const calendarData = { name: "helloCalendar", description: "hi everyone" };

    const url = `/api/calendar`;
    await request(app)
      .post(url)
      .set({ cookie: cookie })
      .send(calendarData)
      .then(async (res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body.calendar.owner).toEqual("5cabe64dcf0d4447fa60f5e9");
        expect(res.body.calendar.members[0]._id).toEqual(
          "5cabe64dcf0d4447fa60f5e9"
        );
      });
  });
});

describe("PATCH /api/calendar", () => {
  test("OK", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh1@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];

    const calendarData = {
      name: "helloCalendar12",
      description: "hi everyone1111",
      calendarId: "5cabe64dcf0d4447fa60f5e3",
    };

    const url = `/api/calendar`;
    await request(app)
      .patch(url)
      .set({ cookie: cookie })
      .send(calendarData)
      .then(async (res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.calendar.name).toEqual("helloCalendar12");
        expect(res.body.calendar.description).toEqual("hi everyone1111");
      });
  });
});

describe("PATCH /api/calendar/member", () => {
  test("OK", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh2@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];

    const calendarData = {
      calendarId: "5cabe64dcf0d4447fa60f5e3",
    };

    const url = `/api/calendar/member`;
    await request(app)
      .patch(url)
      .set({ cookie: cookie })
      .send(calendarData)
      .then(async (res) => {
        expect(res.statusCode).toBe(200);
      });
  });
});

describe("PATCH /api/calendar/admin", () => {
  test("OK", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh3@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];

    const calendarAdminData = {
      userId: "5cabe64dcf0d4447fa60f5e9",
      calendarId: "5cabe64dcf0d4447fa60f5e2",
      administrator: true,
    };

    const url = `/api/calendar/admin`;
    await request(app)
      .patch(url)
      .set({ cookie: cookie })
      .send(calendarAdminData)
      .then(async (res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toEqual("Add admin success");
      });
  });
  //
  //test("", async () => {});
});

describe("PATCH /api/calendar/owner", () => {
  test("OK", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh3@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];

    const calendarOwnerData = {
      userId: "5cabe64dcf0d4447fa60f5e9",
      calendarId: "5cabe64dcf0d4447fa60f5e2",
      administrator: true,
    };

    const url = `/api/calendar/owner`;
    await request(app)
      .patch(url)
      .set({ cookie: cookie })
      .send(calendarOwnerData)
      .then(async (res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toEqual("Change owner success");
      });
  });
});

describe("DELETE /api/calendar/:calendarId", () => {
  test("/api/calendar/:calendarId", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh1@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];

    const url = `/api/calendar/5cabe64dcf0d4447fa60f5e3`;
    await request(app)
      .delete(url)
      .set({ cookie: cookie })
      .then(async (res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toEqual("Deleted Calendar.");
      });
  });
});

describe("DELETE /api/calendar/:calendarId/:userId", () => {
  test("/api/calendar/:calendarId/:userId", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh1@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];

    const url = `/api/calendar/5cabe64dcf0d4447fa60f5e2/5cabe64dcf0d4447fa60f5e6`;
    await request(app)
      .delete(url)
      .set({ cookie: cookie })
      .then(async (res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toEqual("Deleted user in calendar.");
      });
  });
});

describe("DELETE /api/calendar/:calendarId/itself", () => {
  test("/api/calendar/:calendarId/itself", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh1@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];

    const url = `/api/calendar/5cabe64dcf0d4447fa60f5e2/itself`;
    await request(app)
      .delete(url)
      .set({ cookie: cookie })
      .then(async (res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toEqual("Deleted user in calendar.");
      });
  });
});

// describe("PATCH calendar", () => {
//   test("", async () => {});
// });
