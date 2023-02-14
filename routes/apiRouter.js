const express = require("express");
const apiRouter = express.Router();
const { body } = require("express-validator");

const submitController = require("../controllers/submitController");
const statisticsController = require("../controllers/statisticsController");
const profileController = require("../controllers/profileController");

apiRouter.post("/submit/solve", submitController.newSolve);
apiRouter.get("/:idUser", profileController.filters)
apiRouter.get("/:category/:idUser", statisticsController.categoryTimerStats)
apiRouter.get("/stats/:category/:cube/:idUser", statisticsController.stats)

module.exports = apiRouter;