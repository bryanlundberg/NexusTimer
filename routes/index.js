const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const homeController = require("../controllers/homeController");
const loginController = require("../controllers/loginController");
const registerController = require("../controllers/registerController");
const profileController = require("../controllers/profileController");
const submitController = require("../controllers/submitController");
const verifyUser = require("../middlewares/verifyUser");
const updateAlgSets = require("../middlewares/updateAlgSets");
const timerController = require("../controllers/timerController");
const AlgSetController = require("../controllers/AlgSetController");

router.get("/", homeController.home_get);
router.get("/register", registerController.register_get);

router.post(
  "/register",
  [
    body("username", "Invalid username").trim().notEmpty().escape(),
    body("email", "Invalid email").trim().notEmpty().normalizeEmail(),
    body("password", "Invalid password").trim().isLength({ min: 6 }).escape(),
  ],
  registerController.register_post
);

router.get("/login", loginController.login_get);

router.post(
  "/login",
  [
    body("username", "Invalid username").trim().notEmpty().escape(),
    body("password", "Invalid password").trim().isLength({ min: 6 }).escape(),
  ],
  loginController.login_post
);

router.get("/profile/:idUser/oll", AlgSetController.oll_get)
router.get("/profile/:idUser/pll", AlgSetController.pll_get)

router.get("/profile/:idUser/help", profileController.help_get)
router.get("/profile/:idUser/settings", profileController.editProfile_get)
router.get("/profile/:idUser/alg-collection", profileController.algCollection_get)
router.get("/profile/:idUser/achievements", profileController.achievements_get)
router.get("/profile/:idUser/my-cubes", profileController.cubes_get)
router.get("/timer", verifyUser, timerController.load_page)

router.get("/profile/:idUser", verifyUser, updateAlgSets, profileController.profileUser_get);
router.get("/profile/:idUser/historial", verifyUser, profileController.userTimes_get);


router.post("/submit/:id/oll", verifyUser, submitController.updateOll);
router.get("/submit/:id/delete", verifyUser, submitController.deleteTime);
router.post("/submit/times", verifyUser, submitController.newTime_post);
router.post("/submit/:id/settings", verifyUser, submitController.settings_post);

router.get("/logout", profileController.logout_get);
module.exports = router;
