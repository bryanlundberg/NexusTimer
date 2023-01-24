const User = require("../models/User");

exports.profile_get = async (req, res) => {
	try {
		const user = await new User ({username: "anna", email: "ssasaasaas@gmail.com", password: "fdbsafbd"})
		await user.save()
		console.log(user)
		res.redirect("/")
	}	catch (error) {
			res.json({error: `${error}`})
	}
}
