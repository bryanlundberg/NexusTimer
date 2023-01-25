const User = require("../models/User");
const bcrypt = require('bcryptjs');

exports.register_get = (req, res) => {
  res.render("register", {
	title: "register page"
  })
}

exports.register_post = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const userUsername = await User.findOne({username: username})
		const userEmail = await User.findOne({ email: email})
		if (userUsername) {
			const customError = new Error("Username already taken")
			res.render("register", {
				title: "register page",
				customError
			})
			return
		} else if (userEmail) {
			const customError = new Error("Email already taken")
			res.render("register", {
				title: "register page",
				customError
			})
			return
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