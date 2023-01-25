const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator"); 

exports.register_get = (req, res) => {
  res.render("register", {
	title: "register page"
  })
}

exports.register_post = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json(errors)
	}
	try {
		const { username, email, password } = req.body;
		const userUsername = await User.findOne({username: username})
		const userEmail = await User.findOne({ email: email})
		if (userUsername) {
			return res.status(401).json({ error: "Username already in use" })
		} else if (userEmail) {
			return res.status(401).json({ error: "Email already in use" })
		}	
		
 		const newAcount = new User({
				username, 
				email, 
				password,
			})
		const saveUser = await newAcount.save()
		res.redirect("/profile/"+newAcount._id)

	} catch (error) {
		console.log(error.message)
	}
}