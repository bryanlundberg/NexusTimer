const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.login = (req, res) => {
  res.render("login", {
    title: "login page",
    mensajes: req.flash().mensajes,
  });
};

exports.register = (req, res) => {
  res.render("register", {
    title: "register page",
    mensajes: req.flash().mensajes,
  });
};

exports.registerNewAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("mensajes", errors.array());
    return res.redirect("/register");
  }
  try {
    const { username, email, password } = req.body;
    const userUsername = await User.findOne({ username: username });
    const userEmail = await User.findOne({ email: email });
    if (userUsername) {
      throw new Error("Username already in use");
    }
    if (userEmail) {
      throw new Error("Email already in use");
    }

    const newAcount = new User({
      username,
      email,
      password,
    });
    const saveUser = await newAcount.save();
    res.redirect("/profile/timer");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    res.redirect("/register");
  }
};

exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
