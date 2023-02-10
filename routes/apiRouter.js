const express = require("express");
const apiRouter = express.Router();
const { body } = require("express-validator");

const submitController = require("../controllers/submitController");
const statisticsController = require("../controllers/statisticsController");

apiRouter.post("/submit/solve", submitController.newSolve);
apiRouter.get("/:category/:idUser", statisticsController.categoryStats)

module.exports = apiRouter;