const express = require("express");
const logoutRouter = express.Router();

const authController = require("../controllers/AuthController");

logoutRouter.get("/", authController.logout);

module.exports = logoutRouter;