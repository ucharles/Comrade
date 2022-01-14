require("dotenv").config();

const fs = require("fs");
const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const eventRoutes = require("./routes/events-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.wpei7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json());

app.use(cookieParser());

// 요청한 파일만 반환하는 고정 미들웨어.
// path.join('uploads', 'images') => 서버 안의 uploads/images 에 요청을 보냄.
app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  // 접근 가능한 도메인 제한
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  //res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/events", eventRoutes);
app.use("/api/users", usersRoutes);

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
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
