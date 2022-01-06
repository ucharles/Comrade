const express = require("express");
const { check } = require("express-validator");
const eventsControllers = require("../controllers/events-controllers");

const router = express.Router();

router.get("/", eventsControllers.getEvents);
router.get("/:date", eventsControllers.getEventsByDate);
router.post("/", eventsControllers.createEvents);

module.exports = router;
