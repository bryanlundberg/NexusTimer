const express = require("express");
const submitRouter = express.Router();
const { body } = require("express-validator");

const submitController = require("../controllers/submitController");
const isAuthenticated = require("../middlewares/isAuthenticated");

submitRouter.post("/:userName/newcube", isAuthenticated, submitController.updateUserCubes)
submitRouter.get("/:cubeId/delete", isAuthenticated, submitController.deleteCube);
submitRouter.post("/:userName/settings", isAuthenticated, submitController.updateSettings);
submitRouter.post("/:userName/:method", isAuthenticated, submitController.updateMethod);

module.exports = submitRouter;