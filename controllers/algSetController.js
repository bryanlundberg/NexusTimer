const User = require("../models/User");
const Algorithm = require("../models/Algorithm");

exports.oll_get = async (req, res) => {
  try {
	const user = await User.findById(req.params.idUser);
	if (!user) {throw new Error("User not found");}
	
	let userAlgs = await Algorithm.find({ algSet: "OLL", owner: user._id });
	if (!userAlgs) {throw new Error("OLL set not found");}
	
	res.render("profile_alg-set", {
		title: "Your profile",
		user,
		userAlgs,
		method: userAlgs[0].algSet
	})
	
  } catch (error) {
	  console.log(error)
	  res.redirect("/")
  }
}

exports.pll_get = async (req, res) => {
  try {
	const user = await User.findById(req.params.idUser);
	if (!user) {throw new Error("User not found");}
	
	let userAlgs = await Algorithm.find({ algSet: "PLL", owner: user._id });
	if (!userAlgs) {throw new Error("PLL set not found");}
	
	res.render("profile_alg-set", {
		title: "Your profile",
		user,
		userAlgs,
		method: userAlgs[0].algSet
	})
	
  } catch (error) {
	  console.log(error)
	  res.redirect("/")
  }
}

exports.coll_get = async (req, res) => {
  try {
	const user = await User.findById(req.params.idUser);
	if (!user) {throw new Error("User not found");}
	
	let userAlgs = await Algorithm.find({ algSet: "COLL", owner: user._id });
	if (!userAlgs) {throw new Error("PLL set not found");}
	
	res.render("profile_alg-set", {
		title: "Your profile",
		user,
		userAlgs,
		method: userAlgs[0].algSet
	})
	
  } catch (error) {
	  console.log(error)
	  res.redirect("/")
  }
}


exports.cmll_get = async (req, res) => {
  try {
	const user = await User.findById(req.params.idUser);
	if (!user) {throw new Error("User not found");}
	
	let userAlgs = await Algorithm.find({ algSet: "CMLL", owner: user._id });
	if (!userAlgs) {throw new Error("PLL set not found");}
	
	res.render("profile_alg-set", {
		title: "Your profile",
		user,
		userAlgs,
		method: userAlgs[0].algSet
	})
	
  } catch (error) {
	  console.log(error)
	  res.redirect("/")
  }
}