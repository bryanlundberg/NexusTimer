const User = require("../models/User");
const UserRecord = require("../models/Record");
exports.profile_get = async (req, res) => {
	try {
		const times = await UserRecord.find();
		if (!times) throw new Error("No records");
		res.render("profile", {
			title: "Profile",
			times
		})
	} catch (error) {
		//req.flash("messsages", [{ msg: error.message }]);
		console.log(error)
	}
/*   res.render("profile", {
	title: "profile page"
  }) */
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