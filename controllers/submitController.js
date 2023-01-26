const User = require("../models/User");
const UserRecord = require("../models/Record");

exports.newTime_post = async (req, res) => {
	const { time, category} = req.body;
	const newTime = new UserRecord({time, category})
	await newTime.save()
	res.redirect("/profile")
} 