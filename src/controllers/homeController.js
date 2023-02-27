const User = require("../models/User");

exports.home_get = (req, res) => {
	console.log(req.user)
	res.render("home", {
	title: "home page"
  })
}
