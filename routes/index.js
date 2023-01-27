const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const homeController = require("../controllers/homeController");
const loginController = require("../controllers/loginController");
const registerController = require("../controllers/registerController");
const profileController = require("../controllers/profileController");
const submitController = require("../controllers/submitController");
const verifyUser = require("../middlewares/verifyUser");

router.get("/", verifyUser, homeController.home_get);
router.get("/register", registerController.register_get);

router.post(
  "/register",
  [
    body("username", "Invalid username").trim().notEmpty().escape(),
    body("email", "Invalid email").trim().notEmpty().normalizeEmail(),
    body("password", "Invalid password").trim().isLength({ min: 6 }).escape(),
  ],
  registerController.register_post
);

router.get("/login", loginController.login_get);

router.post(
  "/login",
  [
    body("username", "Invalid username").trim().notEmpty().escape(),
    body("password", "Invalid password").trim().isLength({ min: 6 }).escape(),
  ],
  loginController.login_post
);

router.get("/profile/:idUser", profileController.profileUser_get);
router.get("/profile", verifyUser, profileController.profile_get);

router.get("/submit/:id/delete", verifyUser, submitController.deleteTime);
router.post("/submit/times", verifyUser, submitController.newTime_post);

router.get("/logout", profileController.logout_get);
module.exports = router;
