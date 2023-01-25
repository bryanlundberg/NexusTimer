const User = require("../models/User")
const { validationResult } = require("express-validator"); 
bcrypt = require('bcryptjs');

exports.login_get = async (req, res) => {
  res.render("login", {
	title: "login page"
  })
}

exports.login_post = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json(errors)
	}
	try {
		const { username, password } = req.body;
		const user = await User.findOne({username: username})
		if (!user) { return res.status(401).json({ error: "Username not found" })}
		if (!(await user.comparePassword(password))) {return res.status(401).json({ error: "Password not match" })}
		res.redirect("/profile/"+user._id)

	} catch (error) {
		console.log(error.message)
		return res.status(500).json({error: error.message});
	}
}