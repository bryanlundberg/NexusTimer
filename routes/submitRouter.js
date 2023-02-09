const express = require("express");
const submitRouter = express.Router();
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

submitRouter.post("/:idUser/newcube", verifyUser, submitController.newCube)
submitRouter.post("/:id/pll", verifyUser, submitController.updatePll);
submitRouter.post("/:id/oll", verifyUser, submitController.updateOll);
submitRouter.get("/:id/delete", verifyUser, submitController.deleteTime);
submitRouter.post("/times", verifyUser, submitController.newTime_post);
submitRouter.post("/:id/settings", verifyUser, submitController.settings_post);

module.exports = submitRouter;