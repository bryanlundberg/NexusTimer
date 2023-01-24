bcrypt = require('bcryptjs');

exports.login_get = async (req, res) => {
  res.render("login", {
	title: "login page"
  })
}

exports.login_post = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({username: username})
		console.log(user)
		if (!user) {
			return res.status(401).json({error: "Username not found"})
		} else {
			console.log(user)
		}

		res.redirect("/profile/"+user._id)

	} catch (error) {
		console.log(error.message)
	}
}