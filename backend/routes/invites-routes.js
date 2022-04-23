const express = require("express");

const checkAuth = require("../middleware/check-auth");
const invitesControllers = require("../controllers/invites-controllers");

const router = express.Router();

router.use(checkAuth);

router.get("/:inviteId", invitesControllers.getCalendarByInviteId);

router.post("/", invitesControllers.createInvite);

//router.delete("/:calendarId", invitesControllers.deleteCalendar);

module.exports = router;
