const express = require("express");
const profileRouter = express.Router();
const { body } = require("express-validator");

const profileController = require("../controllers/profileController");
const verifyUser = require("../middlewares/verifyUser");
const updateAlgSets = require("../middlewares/updateAlgSets");
const AlgSetController = require("../controllers/algSetController");

profileRouter.get("/:idUser/oll", AlgSetController.oll_get)
profileRouter.get("/:idUser/pll", AlgSetController.pll_get)
profileRouter.get("/:idUser/settings", profileController.editProfile_get)
profileRouter.get("/:idUser/alg-collection", profileController.algCollection_get)
profileRouter.get("/:idUser/achievements", profileController.achievements_get)
profileRouter.get("/:idUser/my-cubes", profileController.cubes_get)
profileRouter.get("/:idUser", verifyUser, updateAlgSets, profileController.profileUser_get);
profileRouter.get("/:idUser/historial", verifyUser, profileController.userTimes_get);

module.exports = profileRouter;