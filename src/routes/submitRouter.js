const express = require("express");
const submitRouter = express.Router();
const { body } = require("express-validator");

const submitController = require("../controllers/submitController");
const isAuthenticated = require("../middlewares/isAuthenticated");


submitRouter.post("/:idUser/newcube", isAuthenticated, submitController.newCube)
submitRouter.post("/:id/pll", isAuthenticated, submitController.updatePll);
submitRouter.post("/:id/oll", isAuthenticated, submitController.updateOll);
submitRouter.post("/:id/coll", isAuthenticated, submitController.updateColl);
submitRouter.get("/:id/delete", isAuthenticated, submitController.deleteTime);
submitRouter.post("/times", isAuthenticated, submitController.newTime_post);
submitRouter.post("/:id/settings", isAuthenticated, submitController.settings_post);

module.exports = submitRouter;