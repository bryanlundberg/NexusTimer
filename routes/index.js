const express = require('express');
const router = express.Router();

const homeController = require("../controllers/homeController")
const loginController = require("../controllers/loginController")
const registerController = require("../controllers/registerController")

router.get('/', homeController.home_get);

module.exports = router;
