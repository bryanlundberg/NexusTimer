const User = require("../models/User");
const CubeTime = require("../models/CubeTime");

exports.userTimes_get = async (req, res) => {
	console.log(req.user)
	try {
		const times = await CubeTime.find({ 
			author: req.user.id 
		});
		if (!times) throw new Error("No records");
		res.render("user_times", {
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

exports.logout_get = (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
}