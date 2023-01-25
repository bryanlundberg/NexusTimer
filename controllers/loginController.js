const User = require("../models/User")
const { validationResult } = require("express-validator"); 
bcrypt = require('bcryptjs');

exports.login_get = (req, res) => {
  res.render("login", {
	title: "login page",
	mensajes: req.flash().mensajes
  })
}

exports.login_post = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		req.flash("mensajes", errors.array());
		return res.redirect("/login");
	}
	try {
		const { username, password } = req.body;
		const user = await User.findOne({username: username})
		if (!user) { throw new Error("Username not found") }
		if (!(await user.comparePassword(password))) { throw new Error("Password incorrect") }
		
		req.login(user, function(err) {
			if (err) {
				throw new Error("Error creating session")
				return res.redirect("/login")
			}
			
			res.redirect("/profile/"+user._id)
		})
		

	} catch (error) {
		req.flash("mensajes", [{ msg: error.message }]);
		res.redirect("/login")
	}
}