const User = require("../models/User");

exports.home_get = async (req, res) => {
  try {
	const users = await User.find();
	res.json(users)
  }	catch (error) {
	console.log(error)
  }
	
}
