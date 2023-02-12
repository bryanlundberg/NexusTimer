const express = require("express");
const apiRouter = express.Router();
const { body } = require("express-validator");

const submitController = require("../controllers/submitController");
const statisticsController = require("../controllers/statisticsController");

apiRouter.post("/submit/solve", submitController.newSolve);
apiRouter.get("/overall/:idUser", statisticsController.overallProfileStats)
apiRouter.get("/:category/:idUser", statisticsController.categoryTimerStats)

module.exports = apiRouter;