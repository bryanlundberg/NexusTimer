const express = require("express");
const apiRouter = express.Router();
const { body } = require("express-validator");

const submitController = require("../controllers/submitController");
const statisticsController = require("../controllers/statisticsController");
const userController = require("../controllers/UserController");

apiRouter.get("/:category/:cubeId/:userId", statisticsController.stats)
apiRouter.get("/:category/:idUser", statisticsController.categoryTimerStats)
apiRouter.post("/submit/solve", submitController.newSolve);
apiRouter.get("/:idUser", userController.filters)

module.exports = apiRouter;