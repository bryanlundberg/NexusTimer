const express = require("express");
const submitRouter = express.Router();
const { body } = require("express-validator");

const submitController = require("../controllers/submitController");
const verifyUser = require("../middlewares/verifyUser");


submitRouter.post("/:idUser/newcube", verifyUser, submitController.newCube)
submitRouter.post("/:id/pll", verifyUser, submitController.updatePll);
submitRouter.post("/:id/oll", verifyUser, submitController.updateOll);
submitRouter.post("/:id/coll", verifyUser, submitController.updateColl);
submitRouter.get("/:id/delete", verifyUser, submitController.deleteTime);
submitRouter.post("/times", verifyUser, submitController.newTime_post);
submitRouter.post("/:id/settings", verifyUser, submitController.settings_post);

module.exports = submitRouter;