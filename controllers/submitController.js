const User = require("../models/User");
const Algorithm = require("../models/Algorithm");
const CubeTime = require("../models/CubeTime");
const Cube = require("../models/Cube");
const ollAlgorithms = require("../algs/ollAlgs");
const pllAlgorithms = require("../algs/pllAlgs");

const updateStatusAlgorithms = async (userId, method, algorithms) => {

    const userAlgs = await Algorithm.find({ algSet: `${method}`, owner: userId });
    if (!userAlgs) { throw new Error("OLL set not found") }
    
	for (let i = 1; i < algorithms.length; i++) {
	  const algo = userAlgs[i-1];
	  algo.algSet = `${method}`;
	  algo.status = req.body[`${method}${i}`];
	  await algo.save();
	}

}

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

exports.newCube = async (req, res) => {
	try {
		const id = req.params.idUser;
		const { name, brand, category } = req.body;
		
		const user = await User.findById(id);
		if (!user) {throw new Error("User not found")}
		
		console.log(user._id)
		
		const cube = await Cube.create({
			owner: user._id,
			name: name,
			brand: brand,
			category: category
		})
		console.log(id)
		console.log(cube)

		
		res.redirect("/profile/"+id+"/my-cubes")
	} catch (error) {
		console.log(error)
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
		console.log(user.theme)
		
		const saveUser = await user.save();
		
		res.redirect("/profile/"+user._id)
		
	} catch (error) {
		console.log(error)
		res.redirect("/profile"+user._id)
	}
}

exports.updateOll = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    const userAlgs = await Algorithm.find({ algSet: "OLL", owner: user._id });
    if (!userAlgs) {
      throw new Error("OLL set not found");
    }
    
	for (let i = 1; i < ollAlgorithms.length; i++) {
	  const algo = userAlgs[i-1];
	  algo.algSet = "OLL";
	  algo.status = req.body[`OLL${i}`];
	  await algo.save();
	}
	
    res.redirect(`/profile/${user._id}`);
  } catch (error) {
    console.log(error);
    res.redirect(`/profile/${user._id}`);
  }
};

exports.updatePll = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
	
	const updateStatusAlgorithms = async (userId, method, algorithms) => {

		const userAlgs = await Algorithm.find({ algSet: `${method}`, owner: userId });
		if (!userAlgs) { throw new Error("OLL set not found") }
		
		for (let i = 1; i < algorithms.length; i++) {
		  const algo = userAlgs[i-1];
		  algo.algSet = `${method}`;
		  algo.status = req.body[`${method}${i}`];
		  await algo.save();
		}

	}
	
	await updateStatusAlgorithms(user._id, "PLL", pllAlgorithms)
	
    res.redirect(`/profile/${user._id}`);
  } catch (error) {
    console.log(error);
    res.redirect(`/profile/${user._id}`);
  }
};

