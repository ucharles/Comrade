require("dotenv").config();

const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

const eventRoutes = require("./routes/events-routes");
const usersRoutes = require("./routes/users-routes");
const calendarRoutes = require("./routes/calendars-routes");
const inviteRoutes = require("./routes/invites-routes");

function createServer() {
  const app = express();

  app.use(bodyParser.json());
  app.use(cookieParser());
  // const csrfProtection = csrf({ cookie: true });

  app.use((req, res, next) => {
    // 접근 가능한 도메인 제한
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Request-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    next();
  });

  // 요청한 파일만 반환하는 고정 미들웨어.
  // path.join('uploads', 'images') => 서버 안의 uploads/images 에 요청을 보냄.
  app.use("/uploads/images", express.static(path.join("uploads", "images")));
  app.use("/api/users", usersRoutes);
  app.use("/api/events", eventRoutes);
  app.use("/api/calendar", calendarRoutes);
  app.use("/api/invite", inviteRoutes);

  // app.get("/", csrfProtection, (req, res) => {
  //   res.cookie("XSRF-TOKEN", req.csrfToken(), {
  //     expires: new Date(Date.now() + 3 * 3600000), // 3시간 동안 유효
  //   });
  //   res.json({});
  // });

  // 어느 경로에도 해당하지 않는 요청일 때.
  app.use((req, res, next) => {
    const error = new HttpError("could not find this route.", 404);
    throw error;
  });

  app.use((error, req, res, next) => {
    // 요청에 헤더가 포함되어 있는지 체크함
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        console.log(err);
      });
    }
    if (res.headerSent) {
      return next(error);
    }
    // if (error.code === "EBADCSRFTOKEN") {
    //   console.log(error);
    //   console.log(req.get("XSRF-TOKEN")); // <- displays the token perfectly
    // }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
  });

  return app;
}

module.exports = createServer;
