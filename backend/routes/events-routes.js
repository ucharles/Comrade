const express = require("express");
const { check } = require("express-validator");
const eventsControllers = require("../controllers/events-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

// 테스트용
router.get("/", eventsControllers.getEvents);
router.get(
  "/calendar/:calendarId/int-day/:date",
  eventsControllers.getIntersectionEventsByDay
);
router.get(
  "/calendar/:calendarId/int-month/:date",
  eventsControllers.getIntersectionEventsByMonth
);
router.get(
  "/calendar/:calendarId/one-user-month/:date",
  eventsControllers.getEventsByMonth
);

router.post("/", eventsControllers.createEvents);
router.post("/delete", eventsControllers.deleteEvents);

module.exports = router;
