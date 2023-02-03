const User = require("../models/User");
const AlgSet = require("../models/AlgSet");
const Algorithm = require("../models/Algorithm");
const ollAlgorithms = require("../algs/ollAlgs");
const pllAlgorithms = require("../algs/pllAlgs");


module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.idUser);
    if (!user) {
      throw new Error("User not found");
    }
	const sets = ["OLL", "PLL"];

	for (let i = 0; i < sets.length; i++) {
	  let set = await AlgSet.findOne({ name: sets[i] });
	  if (!set) {
		set = new AlgSet({
		  name: sets[i],
		});
		await set.save();
		console.log(`Algorithm set ${sets[i]} created`);
	  }
	}

	//POPULATE OLLSET & INSERT USER LEARN STATUS
    let ollSet = await AlgSet.findOne({ name: "OLL" });
    if (!ollSet) {throw new Error("something went wrong")}

    let algorithmsOll = await Algorithm.find({ algSet: ollSet._id });
    if (algorithmsOll.length !== ollAlgorithms.length) {
      const createAlgs = [];
      for (let i = 0; i < ollAlgorithms.length; i++) {
        createAlgs.push({
          algSet: ollSet._id,
          name: `OLL${i + 1}`,
          thumbnail: `/images/collection/oll/${i + 1}.png`,
          alg: ollAlgorithms[i].alg,
          learnStatus: [
            {
              user: user._id,
              status: "off",
            },
          ],
        });
      }
      await Algorithm.create(createAlgs);
    } else {
      let pendingStatus = [];
      algorithmsOll.forEach((oll) => {
        const status = oll.learnStatus.find(
          (state) => state.user.toString() === user._id.toString()
        );
        if (!status) {
          pendingStatus.push(oll._id);
        }
      });

      if (pendingStatus.length !== 0) {
        await Algorithm.updateMany(
          { _id: { $in: pendingStatus } },
          { $addToSet: { learnStatus: { user: user._id, status: "off" } } }
        );
      }
    }
	
	//POPULATE PLLSET & INSERT USER LEARN STATUS
    let pllSet = await AlgSet.findOne({ name: "PLL" });
    if (!pllSet) {throw new Error("something went wrong")}

    let algorithmsPll = await Algorithm.find({ algSet: pllSet._id });
    if (algorithmsPll.length !== pllAlgorithms.length) {
      const createAlgs = [];
      for (let i = 0; i < pllAlgorithms.length; i++) {
        createAlgs.push({
          algSet: pllSet._id,
          name: `PLL${i + 1}`,
          thumbnail: `/images/collection/pll/${i + 1}.png`,
          alg: pllAlgorithms[i].alg,
          learnStatus: [
            {
              user: user._id,
              status: "off",
            },
          ],
        });
      }
      await Algorithm.create(createAlgs);
    } else {
      let pendingStatus = [];
      algorithmsPll.forEach((oll) => {
        const status = oll.learnStatus.find(
          (state) => state.user.toString() === user._id.toString()
        );
        if (!status) {
          pendingStatus.push(oll._id);
        }
      });

      if (pendingStatus.length !== 0) {
        await Algorithm.updateMany(
          { _id: { $in: pendingStatus } },
          { $addToSet: { learnStatus: { user: user._id, status: "off" } } }
        );
      }
    }

	//POPULATE OTHERS

    return next();
  } catch (error) {
    console.log(error);
  }
};
