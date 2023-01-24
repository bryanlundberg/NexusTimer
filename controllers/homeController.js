const User = require("../models/User");

exports.home_get = async (req, res) => {
  res.render("home", {
	title: "home page"
  })
}
