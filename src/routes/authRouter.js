const express = require("express");
const authRouter = express.Router();
const { body } = require("express-validator");
const passport = require("passport");

const loginController = require("../controllers/loginController");
const registerController = require("../controllers/registerController");

authRouter.post(
  "/register",
  [
    body("username", "Invalid username").trim().notEmpty().escape(),
    body("email", "Invalid email").trim().notEmpty().normalizeEmail(),
    body("password", "Invalid password").trim().isLength({ min: 6 }).escape(),
  ],
  registerController.register_post
);

/* authRouter.post(
  "/login",
  [
    body("username", "Invalid username").trim().notEmpty().escape(),
    body("password", "Invalid password").trim().isLength({ min: 6 }).escape(),
  ],
  loginController.login_post
); */

authRouter.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

module.exports = authRouter;