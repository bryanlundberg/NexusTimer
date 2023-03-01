const express = require("express");
const submitRouter = express.Router();
const { body } = require("express-validator");

const submitController = require("../controllers/submitController");
const isAuthenticated = require("../middlewares/isAuthenticated");


submitRouter.post("/:userName/newcube", isAuthenticated, submitController.newCube)
submitRouter.post("/:userName/:method", isAuthenticated, submitController.updateMethod);
submitRouter.get("/:userName/delete", isAuthenticated, submitController.deleteTime);
submitRouter.post("/time", isAuthenticated, submitController.newTime_post);
submitRouter.post("/:userName/settings", isAuthenticated, submitController.settings_post);

module.exports = submitRouter;