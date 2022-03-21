const createServer = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { cookieSplit } = require("../util/cookie-spliter");
const bcrypt = require("bcryptjs");

const Event = require("../models/event-model");
const Calendar = require("../models/calendar-model");
const User = require("../models/user-model");

// exception은 어떻게 발생시키는거지..??
//beforeEach((done) => {});
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

//afterEach((done) => {});

// afterAll(async () => {
//   await new Promise((resolve) =>
//     setTimeout(() => {
//       resolve();
//     }, 500)
//   );
// });

const app = createServer();

describe("POST /api/users/signup", () => {
  const url = "/api/users/signup";

  test("express-validator, username is not empty", async () => {
    const userData = {
      username: "",
      email: "test@test.com",
      password: "123456",
      confirmPassword: "123456",
    };

    await request(app)
      .post(url)
      .send(userData)
      .then(async (res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body.message).toBe(
          "Invalid input passed, please check your data."
        );
      });
  });
  test("express-validator, email is email", async () => {
    const userData = {
      username: "helloWorld",
      email: "test@testcom",
      password: "123456",
      confirmPassword: "123456",
    };

    await request(app)
      .post(url)
      .send(userData)
      .then(async (res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body.message).toBe(
          "Invalid input passed, please check your data."
        );
      });
  });
  test("express-validator, password length is more than 6 characters", async () => {
    const userData = {
      username: "helloWorld",
      email: "test@test.com",
      password: "12345",
      confirmPassword: "123456",
    };

    await request(app)
      .post(url)
      .send(userData)
      .then(async (res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body.message).toBe(
          "Invalid input passed, please check your data."
        );
      });
  });
  test("express-validator, passwordConfirm length is more than 6 characters", async () => {
    const userData = {
      username: "helloWorld",
      email: "test@test.com",
      password: "123456",
      confirmPassword: "12345",
    };

    await request(app)
      .post(url)
      .send(userData)
      .then(async (res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body.message).toBe(
          "Invalid input passed, please check your data."
        );
      });
  });

  test("Existing User (email)", async () => {
    await User.create({
      username: "hello",
      email: "test@test.com",
      password: "123456",
      confirmPassword: "123456",
    });

    const userData = {
      username: "helloWorld",
      email: "test@test.com",
      password: "1234567",
      confirmPassword: "1234567",
    };

    await request(app)
      .post(url)
      .send(userData)
      .then(async (res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body.message).toBe(
          "User exists already, please login instead."
        );
      });
  });

  test("Confirm Password", async () => {
    const userData = {
      username: "helloWorld",
      email: "test1@test.com",
      password: "123456",
      confirmPassword: "1234567",
    };

    await request(app)
      .post(url)
      .send(userData)
      .then(async (res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body.message).toBe(
          "Password unmatch. Please confirm password."
        );
      });
  });
  test("Response is JWT Token in Cookie, ALL CLEAR", async () => {
    const userData = {
      username: "helloWorld",
      email: "test1@test.com",
      password: "123456",
      confirmPassword: "123456",
    };

    await request(app)
      .post(url)
      .send(userData)
      .then(async (res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toEqual("Registration Complete.");
      });
  });
});

describe("GET /api/users (getUserById)", () => {
  test("OK", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh1@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];

    const url = `/api/users`;
    await request(app)
      .get(url)
      .set({ cookie: cookie })
      .then(async (res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.user._id).toEqual("5cabe64dcf0d4447fa60f5e9");
      });
  });
});

describe("GET /api/users/token-check", () => {
  test("OK", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh1@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];

    const url = `/api/users/token-check`;
    await request(app)
      .get(url)
      .set({ cookie: cookie })
      .then(async (res) => {
        expect(res.statusCode).toBe(201);
      });
  });
});

describe("PATCH /api/users (editUser)", () => {
  test("OK", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh1@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];

    const editUserData = {
      username: "heeeeelword",
      password: "123456",
      confirmPassword: "123456",
    };

    const url = `/api/users`;
    await request(app)
      .patch(url)
      .set({ cookie: cookie })
      .send(editUserData)
      .then(async (res) => {
        expect(res.statusCode).toBe(201);
      });
  });
});

describe("DELETE /api/users (deleteUser)", () => {
  test("OK", async () => {
    const loginResponse = await request(app)
      .post(`/api/users/login`)
      .send({ email: "hhh4@hhh.com", password: "123123" });

    const cookie = loginResponse.headers["set-cookie"];

    const url = `/api/users`;
    await request(app)
      .delete(url)
      .set({ cookie: cookie })
      .then(async (res) => {
        expect(res.statusCode).toBe(200);
      });
  });
});

// describe("POST /api/users/login"),
//   () => {
//     const url = "/api/users/login";
//     test("User is existing", () => {});
//     test("Valid Password", () => {});
//     test("Response is JWT Token in Cookie, ALL CLEAR", () => {});
//   };
