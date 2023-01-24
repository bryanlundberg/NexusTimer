const express = require('express');
const router = express.Router();

const homeController = require("../controllers/homeController")
const loginController = require("../controllers/loginController")
const registerController = require("../controllers/registerController")
const profileController = require("../controllers/profileController")

router.get("/", homeController.home_get);
router.get("/register", registerController.register_get);
router.post("/register", registerController.register_post);
router.get("/login", loginController.login_get);
router.post("/login", loginController.login_post);
router.get("/profile", profileController.profile_get)
router.get("/profile/:idUser", profileController.profileUser_get)
module.exports = router;
