const express = require("express");
const submitRouter = express.Router();
const upload = require("../middlewares/uploadImg")
const { body } = require("express-validator");

const submitController = require("../controllers/submitController");
const isAuthenticated = require("../middlewares/isAuthenticated");

submitRouter.post("/:userName/newcube", isAuthenticated, submitController.updateUserCubes);
submitRouter.get("/:solveId/delete", isAuthenticated, submitController.deleteSolve);
submitRouter.get("/:cubeId/delete", isAuthenticated, submitController.deleteCube);
submitRouter.post("/:userName/settings", isAuthenticated, upload.single("image"),submitController.updateSettings);
submitRouter.post("/:userName/:method", isAuthenticated, submitController.updateMethod);

module.exports = submitRouter;