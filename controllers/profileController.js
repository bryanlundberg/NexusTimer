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