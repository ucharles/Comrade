const createServer = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { cookieSplit } = require("../util/cookie-spliter");

const User = require("../models/user-model");

// exception은 어떻게 발생시키는거지..??
//beforeEach((done) => {});

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
      region: "asia/seoul",
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
      region: "asia/seoul",
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
      region: "asia/seoul",
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
      region: "asia/seoul",
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

  test("express-validator, region is not empty", async () => {
    const userData = {
      username: "helloWorld",
      email: "test@test.com",
      password: "123456",
      confirmPassword: "123456",
      region: "",
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
      region: "asia/seoul",
    });

    const userData = {
      username: "helloWorld",
      email: "test@test.com",
      password: "1234567",
      confirmPassword: "1234567",
      region: "asia/japan",
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
      region: "asia/seoul",
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
  test("Enum Timezone", async () => {
    const userData = {
      username: "helloWorld",
      email: "test1@test.com",
      password: "123456",
      confirmPassword: "123456",
      region: "a",
    };

    await request(app)
      .post(url)
      .send(userData)
      .then(async (res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body.message).toBe("Invalid timezone.");
      });
  });
  test("Response is JWT Token in Cookie, ALL CLEAR", async () => {
    const userData = {
      username: "helloWorld",
      email: "test1@test.com",
      password: "123456",
      confirmPassword: "123456",
      region: "Asia/Seoul",
    };

    await request(app)
      .post(url)
      .send(userData)
      .then(async (res) => {
        expect(res.statusCode).toBe(201);
        const cookies = res.headers["set-cookie"];
        const token = cookieSplit(cookies, "token");
        const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        expect({
          email: decodedToken.email,
          region: decodedToken.region,
        }).toEqual({ email: userData.email, region: userData.region });
      });
  });
});

describe("POST /api/users/login"),
  () => {
    const url = "/api/users/login";
    test("User is existing", () => {});
    test("Valid Password", () => {});
    test("Response is JWT Token in Cookie, ALL CLEAR", () => {});
  };
