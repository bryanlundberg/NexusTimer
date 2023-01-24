const User = require("../models/User");

exports.profile_get = async (req, res) => {
  res.render("profile", {
	title: "profile page"
  })
}
exports.profileUser_get = async (req, res) => {
	try {
	  const user = await User.findById(req.params.idUser)
	  if (user) {
		console.log(user)
		res.json(user)
	  }
	  	
	} catch (error) {
		console.log(error)
	}

}