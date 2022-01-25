const express = require("express");
const { check } = require("express-validator");

const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");
const calendarsControllers = require("../controllers/calendar-controllers");

const router = express.Router();

router.use(checkAuth);

router.get("/", calendarsControllers.getCalendarsByUserId);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty().isLength({ min: 5, max: 15 }),
    check("description").isLength({ min: 5, max: 50 }),
  ],
  calendarsControllers.createCalendar
);

module.exports = router;
