const User = require("../models/User");
const Algorithm = require("../models/Algorithm");
const ollAlgorithms = require("../algs/ollAlgs");
const pllAlgorithms = require("../algs/pllAlgs");
const cmllAlgorithms = require("../algs/cmllAlgs");
const collAlgorithms = require("../algs/collAlgs");


module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.idUser);

    if (!user) {
      return next(new Error("User not found"));
    }

    const fillUserAlgs = async (userId, method, algorithms) => {
      let foundAlgs = await Algorithm.find({ algSet: method, owner: userId });
      if (foundAlgs.length !== algorithms.length) {
        await Algorithm.deleteMany({ algSet: method, user: userId });
        for (let i = 0; i < algorithms.length; i++) {
          const newAlgorithm = new Algorithm({
			owner: userId,
            algSet: `${method}`,
            img: `/images/collection/${method.toLowerCase()}.png`,
            name: `${method}${i + 1}`,
            thumbnail: `/images/collection/${method.toLowerCase()}/${i + 1}.png`,
            alg: algorithms[i].alg,
            status: "off",
            user: userId,
          });
          await newAlgorithm.save();
        }
      }
    };

    await fillUserAlgs(user._id, "OLL", ollAlgorithms);
	await fillUserAlgs(user._id, "PLL", pllAlgorithms);
	await fillUserAlgs(user._id, "CMLL", cmllAlgorithms);
	await fillUserAlgs(user._id, "COLL", collAlgorithms);

    return next();
  } catch (error) {
    return next(error);
  }
};