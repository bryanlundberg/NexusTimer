const User = require("../models/User");

exports.profile_get = async (req, res) => {
  res.render("profile", {
	title: "profile page"
  })
}
