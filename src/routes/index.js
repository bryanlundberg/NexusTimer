const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const homeController = require("../controllers/homeController");
const loginController = require("../controllers/loginController");
const registerController = require("../controllers/registerController");

router.get("/", homeController.home_get);
router.get("/register", registerController.register_get);
router.get("/login", loginController.login_get);


module.exports = router;