const express = require("express");
const timerRouter = express.Router();
const { body } = require("express-validator");

const verifyUser = require("../middlewares/verifyUser");
const timerController = require("../controllers/timerController");


timerRouter.get("/", verifyUser, timerController.timer)

module.exports = timerRouter;