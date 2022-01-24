const express = require("express");
const { check } = require("express-validator");
// const csrf = require("csurf");

const usersControllers = require("../controllers/users-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

// Router() ... HTTP 메소드에 의해 필터링된, 미들웨어를 등록할 수 있는 특별한 객체를 제공.
const router = express.Router();
// const csrfProtection = csrf({ cookie: true });

// 라우터 순서 주의!
router.get("/", usersControllers.getUsers);

router.post(
  "/login",
  // csrfProtection,
  [
    check("email").normalizeEmail().isEmail(),
    check("password").trim().isLength({ min: 6 }),
  ],
  usersControllers.login
);

// 변수마다 유효성검사 메시지를 따로 보고 싶을땐 어떡하나??
router.post(
  "/signup",
  // csrfProtection,
  fileUpload.single("image"),
  [
    check("username").trim().not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").trim().isLength({ min: 6 }),
    check("confirmPassword").trim().isLength({ min: 6 }),
    check("region").trim().not().isEmpty(),
  ], // express validator
  usersControllers.signup
);

router.use(checkAuth);

router.get("/:id", usersControllers.getUser);
router.patch(
  "/:id",
  // csrfProtection,
  fileUpload.single("image"),
  [
    check("username").trim().not().isEmpty(),
    check("password").optional({ nullable: true }).trim().isLength({ min: 6 }),
    check("confirmPassword")
      .optional({ nullable: true })
      .trim()
      .isLength({ min: 6 }),
    check("region").trim().not().isEmpty(),
  ], // express validator
  usersControllers.editUser
);
router.delete("/:id", usersControllers.deleteUser);

module.exports = router;
// router를 export 할 수 있다!
// export한 router를 app.js에 등록해서 관리.
