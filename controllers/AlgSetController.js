const User = require("../models/User");
const AlgSet = require("../models/AlgSet");
const Algorithm = require("../models/Algorithm");

exports.oll_get = async (req, res) => {
  try {
	const user = await User.findById(req.params.idUser)
	const ollId = await AlgSet.find({ name: "OLL"})
	const ollAlgs = await Algorithm.findById(ollId._id)
	
	if (!user) {throw new Error("Something went wrong!")}
	if (!ollId) {throw new Error("Something went wrong!")}
	if (!ollAlgs) {throw new Error("Something went wrong!")}
	
	
	
	res.render("profile_alg-set", {
		title: "Your profile",
		user
	})
	
  } catch (error) {
	  console.log(error)
  }
}