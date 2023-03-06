const User = require("../models/User");
const Algorithm = require("../models/Algorithm");

exports.userMethod = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.userName });
    if (!user) {
      throw new Error("User not found");
    }
		let owner = false;
		if (req.user && req.user._id.equals(user._id)) {
			owner = true;
		}
    const algSet = req.params.method.toUpperCase();
    let userAlgs = await Algorithm.find({ algSet: algSet, owner: user._id });
    if (!userAlgs) {
      throw new Error(`${algSet} set not found`);
    }

    res.render("profile_alg-set", {
      title: "Your profile",
      user,
      userAlgs,
      method: userAlgs[0].algSet,
			owner,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};
