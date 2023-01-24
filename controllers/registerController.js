const User = require("../models/User");

exports.register_get = (req, res) => {
  res.render("register", {
	title: "register page"
  })
}

exports.register_post = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const user = await User.findOne({username: username})
		if (!user) {
			const newAcount = new User({
				username, 
				email, 
				password
			})
		const saveUser = await newAcount.save()
		res.redirect("/profile")
		} else {
			const customError = new Error("Username already taken")
			console.log(customError)
			res.render("register", {
				title: "register page",
				customError
			})
		}
		
		
		
	} catch (error) {
		console.log(error.message)
		new Error("Uusaruio ya existe")
	}
}