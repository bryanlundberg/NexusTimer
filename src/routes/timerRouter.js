const express = require("express");
const timerRouter = express.Router();
const { body } = require("express-validator");

const isAuthenticated = require("../middlewares/isAuthenticated");
const timerController = require("../controllers/timerController");


timerRouter.get("/", isAuthenticated, timerController.timer)

module.exports = timerRouter;