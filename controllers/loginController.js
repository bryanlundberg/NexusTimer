exports.login_get = async (req, res) => {
  res.render("login", {
	title: "login page"
  })
}

exports.login_post = async (req, res) => {
	try {
		const { username, password } = req.body;
		const userUsername = await User.findOne({username: username})
		if (!userUsername) {
			const customError = new Error("Username not found")
			res.render("login", {
				title: "login page",
				customError
			})
			return
		}

		res.redirect("/profile/"+newAcount._id)

	} catch (error) {
		console.log(error.message)
	}
}