const express = require("express");
const apiRouter = express.Router();
const { body } = require("express-validator");

const submitController = require("../controllers/submitController");
const statisticsController = require("../controllers/statisticsController");
const userController = require("../controllers/UserController");

apiRouter.post("/submit/solve", submitController.newSolve);
apiRouter.get("/:idUser", userController.filters)
apiRouter.get("/:category/:idUser", statisticsController.categoryTimerStats)
apiRouter.get("/stats/:category/:cube/:idUser", statisticsController.stats)

module.exports = apiRouter;