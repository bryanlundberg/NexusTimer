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
	res.redirect("/profile/"+req.user.id+"/historial")
}

exports.deleteTime = async (req, res) => {
	try {
		const { id } = req.params;
		
		const deleteTimeId = await CubeTime.findById(id);
		if (!deleteTimeId.author.equals(req.user.id)) {
			throw new Error("That is not your time")
		}
		await deleteTimeId.remove();
		res.redirect("/profile/"+req.user.id+"/historial")
	} catch (error) {
		console.log(error)
		res.redirect("/profile/"+req.user.id+"/historial")
	}
}

exports.settings_post = async (req, res) => {
	try {
		const { name, bio, website, youtube, contactEmail, nationality, theme } = req.body;
		console.log(theme)
		const { id } = req.params;
		const user = await User.findById(id);
		
		if (!user) {
			throw new Error("User not found")
		}
		
		user.name = name;
		user.bio = bio;
		user.website = website;
		user.youtube = youtube;
		user.contactEmail = contactEmail;
		user.nationality = nationality;
		user.theme = theme;
		
		const saveUser = await user.save();
		
		res.redirect("/profile/"+user._id)
		
	} catch (error) {
		console.log(error)
		res.redirect("/profile"+user._id)
	}
}