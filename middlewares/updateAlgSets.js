const User = require("../models/User");
const AlgSet = require("../models/AlgSet");
const Algorithm = require("../models/Algorithm");
const ollAlgorithms = require("../algs/ollAlgs");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.idUser);
    if (!user) {
      throw new Error("User not found");
    }

    let ollSet = await AlgSet.findOne({ name: "OLL" });
    if (!ollSet) {
      ollSet = new AlgSet({
        name: "OLL",
      });
      await ollSet.save();
      console.log("alg set oll created");
    }

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
      console.log("created algs");
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
        console.log("actualizados");
      }
      console.log(pendingStatus);
    }

    return next();
  } catch (error) {
    console.log(error);
  }
};
