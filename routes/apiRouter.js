const express = require("express");
const apiRouter = express.Router();
const { body } = require("express-validator");

const homeController = require("../controllers/homeController");
const loginController = require("../controllers/loginController");
const registerController = require("../controllers/registerController");
const profileController = require("../controllers/profileController");
const submitController = require("../controllers/submitController");
const verifyUser = require("../middlewares/verifyUser");
const updateAlgSets = require("../middlewares/updateAlgSets");
const timerController = require("../controllers/timerController");
const AlgSetController = require("../controllers/AlgSetController");

apiRouter.post("/submit/solve", submitController.newSolve);

module.exports = apiRouter;