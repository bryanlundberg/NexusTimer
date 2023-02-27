const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator"); 

exports.register_get = (req, res) => {
  res.render("register", {
	title: "register page",
	mensajes: req.flash().mensajes
  })
}

exports.register_post = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) { 
		req.flash("mensajes", errors.array());
		return res.redirect("/register");
	}
	try {
		const { username, email, password } = req.body;
		const userUsername = await User.findOne({username: username})
		const userEmail = await User.findOne({ email: email})
		if (userUsername) { throw new Error("Username already in use")} 
		if (userEmail) { throw new Error("Email already in use")}	
		
 		const newAcount = new User({
				username, 
				email, 
				password,
			})
		const saveUser = await newAcount.save()
		res.redirect("/profile/"+newAcount._id)

	} catch (error) {
		req.flash("mensajes", [{ msg: error.message }]);
		res.redirect("/register");
	}
}