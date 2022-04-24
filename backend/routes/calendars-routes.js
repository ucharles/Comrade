const express = require("express");
const { check } = require("express-validator");

const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");
const calendarsControllers = require("../controllers/calendars-controllers");

const router = express.Router();

router.use(checkAuth);

router.get("/", calendarsControllers.getCalendarsByUserId);
router.get("/admin", calendarsControllers.getCalendarAdminByUserId);
router.get("/:calendarId", calendarsControllers.getCalendarByCalendarId);
router.post(
  "/",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty().isLength({ min: 5, max: 15 }),
    check("description").isLength({ min: 5, max: 50 }),
  ],
  calendarsControllers.createCalendar
);

router.patch(
  "/",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty().isLength({ min: 5, max: 15 }),
    check("description").isLength({ min: 5, max: 50 }),
  ],
  calendarsControllers.updateCalendarById
);
router.patch("/member", calendarsControllers.addMemberToCalendar);
router.patch("/admin", calendarsControllers.setMemberToAdministratorOrNot);
router.patch("/owner", calendarsControllers.setMemberToOwner);

router.delete("/:calendarId", calendarsControllers.deleteCalendar);
router.delete(
  "/:calendarId/itself",
  calendarsControllers.deleteItselfFromCalendar
);
router.delete(
  "/:calendarId/:userId",
  calendarsControllers.deleteUserFromCalendar
);

module.exports = router;
