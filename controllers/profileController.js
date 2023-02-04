const User = require("../models/User");
const CubeTime = require("../models/CubeTime");
const Algorithm = require("../models/Algorithm");

exports.userTimes_get = async (req, res) => {
	console.log(req.user)
	try {
		const times = await CubeTime.find({ 
			author: req.user.id 
		});
		if (!times) throw new Error("No records");
		res.render("historial", {
			title: "Profile",
			times
		})
	} catch (error) {
		//req.flash("messsages", [{ msg: error.message }]);
		console.log(error)
		res.redirect("/login")
	}
}
exports.profileUser_get = async (req, res) => {
  try {
	const user = await User.findById(req.params.idUser)
	if (user) {
	  res.render("profile", {
		  title: user.username,
		  user
	  })
	}
  } catch (error) {
	  console.log(error)	
  }
}

exports.cubes_get = async (req, res) => {
  try {
	const user = await User.findById(req.params.idUser)
	if (user) {
		res.render("profile_cubes", {
			title: "Your cubes",
			user
		})
	}
  } catch (error) {
	  console.log(error)	
  }
	
}

exports.achievements_get = async (req, res) => {
  try {
	const user = await User.findById(req.params.idUser)
	if (user) {
		res.render("profile_achievements", {
			title: "Your achievements",
			user
		})
	}
  } catch (error) {
	  console.log(error)	
  }
	
}

exports.editProfile_get = async (req, res) => {
  try {
	const user = await User.findById(req.params.idUser)
	if (user) {
		res.render("profile_edit", {
			title: "Your profile",
			user
		})
	}
  } catch (error) {
	  console.log(error)	
  }
	
}

exports.help_get = async (req, res) => {
	
  try {
	const user = await User.findById(req.params.idUser)
	if (user) {
		res.render("profile_alg-set", {
			title: "Profile alg set help section",
			user
		})
	}
  } catch (error) {
	  console.log(error)	
  }

}

exports.algCollection_get = async (req, res) => {
	
  try {
	const user = await User.findById(req.params.idUser)
	if (!user) { throw new Error("Usernot found") }
		
	const setOLL = await Algorithm.find({owner: user._id, algSet: "OLL"})
	const setPLL = await Algorithm.find({owner: user._id, algSet: "PLL"})
	const setCMLL = await Algorithm.find({owner: user._id, algSet: "CMLL"})
	const setCOLL = await Algorithm.find({owner: user._id, algSet: "COLL"})
	
	const learnedOLL = setOLL.filter(e => e.status === "on").length;
	const learnedPLL = setPLL.filter(e => e.status === "on").length;
	const learnedCMLL = setCMLL.filter(e => e.status === "on").length;
	const learnedCOLL = setCOLL.filter(e => e.status === "on").length;
	
	res.render("profile_alg-collection", {
		title: "Collection",
		user,
		setOLL,
		setPLL,
		setCMLL,
		setCOLL,
		learnedOLL,
		learnedPLL,
		learnedCMLL,
		learnedCOLL
	})
	
  } catch (error) {
	  console.log(error)	
  }
	
}

exports.logout_get = (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
}