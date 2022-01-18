const createServer = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");

// exception은 어떻게 발생시키는거지..??
beforeEach((done) => {
  mongoose.connect(
    process.env.DB_URI_TEST,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500));
});

const app = createServer();

describe("POST /api/users/signup", () => {
  test("express-validator", async () => {
    const userData = {
      username: "",
      email: "test@test.com",
      password: "1234",
      confirmPassword: "1234",
      region: "asia/seoul",
    };

    await request(app)
      .post("/api/users/signup")
      .send(userData)
      .then(async (res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body.message).toBe(
          "Invalid input passed, please check your data."
        );
      });
  });
  it("express-validator, email is not email", () => {});
  it("express-validator, password length is more than 6 characters", () => {});
  it("express-validator, region is not empty", () => {});
  it("Existing User", () => {});
  it("Confirm Password", () => {});
  it("Enum Timezone", () => {});
  it("Response is JWT Token in Cookie", () => {});
});
