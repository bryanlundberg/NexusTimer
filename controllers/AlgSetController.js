const User = require("../models/User");
const AlgSet = require("../models/AlgSet");

exports.oll_get = async (req, res) => {
  try {
	const user = await User.findById(req.params.idUser)
	if (user) {
		res.render("profile_alg-set", {
			title: "Your profile",
			user
		})
	}
  } catch (error) {
	  console.log(error)
  }
}