const User = require("../models/User");
const CubeTime = require("../models/CubeTime");

exports.newTime_post = async (req, res) => {
	console.log(req.user)
	const { time, category } = req.body;
	const newTime = new CubeTime({
		time, 
		category, 
		author: req.user.id
	})
	await newTime.save()
	res.redirect("/profile")
} 