const express = require("express");
const router = express.Router();
const passport = require("passport");
const { body } = require("express-validator");

const authController = require("../controllers/AuthController");

router.get("/", (req, res) => {
	console.log(req.user)
	res.render("home", {
	title: "Index"
  })
});

router.get("/register", authController.register);
router.get("/login", authController.login);

router.post(
  "/register",
  [
    body("username", "Invalid username").trim().notEmpty().escape(),
    body("email", "Invalid email").trim().notEmpty().normalizeEmail(),
    body("password", "Invalid password").trim().isLength({ min: 6 }).escape(),
  ],
  authController.registerNewAccount
);

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/timer");
  }
);

module.exports = router;