const express = require("express");
const { check } = require("express-validator");
const eventsControllers = require("../controllers/events-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// router.use(checkAuth);

router.get("/", eventsControllers.getEvents);
router.get(
  "/calendar/:calendarId/:date/:timezone",
  eventsControllers.getIntersectionEventsByDay
);
router.get("/user/:userId/:date/:timezone", eventsControllers.getEventsByDate);

router.post("/", eventsControllers.createEvents);

module.exports = router;
