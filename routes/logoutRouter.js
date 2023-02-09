const express = require("express");
const logoutRouter = express.Router();

const profileController = require("../controllers/profileController");

logoutRouter.get("/", profileController.logout_get);

module.exports = logoutRouter;