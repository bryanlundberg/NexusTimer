const express = require("express");
const userRouter = express.Router();
const { body } = require("express-validator");

const userController = require("../controllers/UserController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const updateAlgSets = require("../middlewares/updateAlgSets");
const algSetController = require("../controllers/AlgSetController");

userRouter.get("/:userName/:method", algSetController.userMethod)
userRouter.get("/:userName/settings", isAuthenticated, userController.settings)
userRouter.get("/:userName/alg-collection", userController.algCollection)
userRouter.get("/:userName/my-cubes", userController.myCubes)
userRouter.get("/:userName", isAuthenticated, updateAlgSets, userController.userProfileTab);
userRouter.get("/:userName/historial", isAuthenticated, userController.historial);

module.exports = userRouter;