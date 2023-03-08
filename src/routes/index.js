const express = require("express");
const router = express.Router();
const passport = require("passport");
const { body } = require("express-validator");

const authController = require("../controllers/AuthController");
const userController = require("../controllers/UserController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const algSetController = require("../controllers/AlgSetController");
const timerController = require("../controllers/timerController");

router.get("/", (req, res) => {
  console.log(req.user);
  res.render("home", {
    title: "Index",
  });
});

router.get("/register", authController.register);
router.post(
  "/register",
  [
    body("username", "Invalid username").trim().notEmpty().escape(),
    body("email", "Invalid email").trim().notEmpty().normalizeEmail(),
    body("password", "Invalid password").trim().isLength({ min: 6 }).escape(),
  ],
  authController.registerNewAccount
);

router.get("/login", authController.login);
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect(`/${req.user.username}`);
  }
);

router.get("/timer", isAuthenticated, timerController.timer);
router.get("/:userName", userController.userProfileTab);
router.get("/:userName/settings", isAuthenticated, userController.settings);
router.get("/:userName/alg-collection", userController.algCollection);
router.get("/:userName/my-cubes", userController.myCubes);
router.get("/:userName/historial", userController.historial);
router.get("/:userName/:method", algSetController.userMethod);

module.exports = router;
