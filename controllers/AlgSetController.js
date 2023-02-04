const User = require("../models/User");
const Algorithm = require("../models/Algorithm");

exports.oll_get = async (req, res) => {
  try {
	const user = await User.findById(req.params.idUser);
	const set = await AlgSet.findOne({ name: "OLL" });

	if (!user) {
	  throw new Error("User not found");
	}
	if (!set) {
	  throw new Error("OLL set not found");
	}
	
	const algs = await Algorithm.find({ algSet: set._id });
	if (!algs) {
	  throw new Error("algs set not found");
	}
	const sdsa = await algs.filter(e => { e.user == user._id})
	
	console.log(`fOUND ${learnState.length}`)
	console.log(learnState[1])
	
	res.render("profile_alg-set", {
		title: "Your profile",
		user,
		learnState,
		set
	})
	
  } catch (error) {
	  console.log(error)
	  res.redirect("/")
  }
}

exports.pll_get = async (req, res) => {
  try {
	const user = await User.findById(req.params.idUser);
	const set = await AlgSet.findOne({ name: "PLL" });

	if (!user) {
	  throw new Error("User not found");
	}
	if (!set) {
	  throw new Error("PLL set not found");
	}

	const algs = await Algorithm.find({
	  algSet: set._id,
	  "learnStatus.user": user._id
	});
	
	if (!algs) {throw new Error("Something went wrong");}
	
	console.log(`fOUND ${algs.length}`)
	console.log(algs)
	
	res.render("profile_alg-set", {
		title: "Your profile",
		user,
		algs,
		set
	})
	
  } catch (error) {
	  console.log(error.message)
	  res.redirect("/")
  }
}