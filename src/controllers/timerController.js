const User = require("../models/User");
const Algorithm = require("../models/Algorithm");
const Cube = require("../models/Cube");

exports.timer = async (req, res) => {
	try {
		const id = req.user.id
		console.log(id)
		const user = await User.findById(id)
		if (!user) { throw new Error("user not found")}
		const cubes = await Cube.find({ owner: user._id })
		const categories = cubes.filter(e => e.category !== "Choose category");
		
	res.render("timer", {
		title: "Solve station",
		cubes,
		categories,
		user
	})
		
	} catch (error) {
		console.log(error)
		res.redirect("/login")
	}

}