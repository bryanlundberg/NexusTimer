const User = require("../models/User");
const Solve = require("../models/Solve");
const Cube = require("../models/Cube");
const {
  findBestTime,
  getBestAverage,
  calculateCubingTime,
  calculateAverage,
  calculateCurrentAo,
} = require("../extras/formulas");

exports.categoryTimerStats = async (req, res) => {
  try {
    const category = req.params.category;
    const userId = req.params.idUser;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const solvesByCategory = await Solve.find({
      owner: user._id,
      category: category,
    }).sort({ startDate: -1 });

    if (solvesByCategory.length === 0) {
      return res.json({
        avg5: 0.0,
        avg12: 0.0,
        avg50: 0.0,
        avg100: 0.0,
        pb: 0.0,
        counter: 0,
        desviation: 0,
        avg: 0,
      });
    }

    const tPb = findBestTime(solvesByCategory);
    const tMean = calculateAverage(solvesByCategory);
    const tAo5 = calculateCurrentAo(solvesByCategory, 5);
    const tAo12 = calculateCurrentAo(solvesByCategory, 12);
    const tAo50 = calculateCurrentAo(solvesByCategory, 50);
    const tCount = solvesByCategory.length;

    return res.json({
      tPb: tPb,
      tMean: tMean,
      tAo5: tAo5,
      tAo12: tAo12,
      tAo50: tAo50,
      tCount: tCount,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.stats = async (req, res) => {
  try {
    const { category, cubeId, userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    console.log(category, cubeId);

    const solvesByCategory = await Solve.find({
      owner: user._id,
      category: category,
    }).sort({ startDate: -1 });
    const solvesByCube = await Solve.find({
      owner: user._id,
      category: category,
      cube: cubeId,
    }).sort({ startDate: -1 });

    const cPb = findBestTime(solvesByCategory);
    const cMean = calculateAverage(solvesByCategory);
    const cAo5 = getBestAverage(solvesByCategory, 5);
    const cAo12 = getBestAverage(solvesByCategory, 12);
    const cAo50 = getBestAverage(solvesByCategory, 50);
    const cAo100 = getBestAverage(solvesByCategory, 100);
    const cAo1000 = getBestAverage(solvesByCategory, 1000);
    const cCount = solvesByCategory.length;
    const cCubingTime = calculateCubingTime(solvesByCategory);

    const uPb = findBestTime(solvesByCube);
    const uMean = calculateAverage(solvesByCube);
    const uAo5 = getBestAverage(solvesByCube, 5);
    const uAo12 = getBestAverage(solvesByCube, 12);
    const uAo50 = getBestAverage(solvesByCube, 50);
    const uAo100 = getBestAverage(solvesByCube, 100);
    const uAo1000 = getBestAverage(solvesByCube, 1000);
    const uCount = solvesByCube.length;
    const uCubingTime = calculateCubingTime(solvesByCube);

    return res.json({
      cPb: cPb,
      cMean: cMean,
      cAo5: cAo5,
      cAo12: cAo12,
      cAo50: cAo50,
      cAo100: cAo100,
      cAo1000: cAo1000,
      cDesviation: "Pending",
      cCount: cCount,
      cCubingTime: cCubingTime,

      uPb: uPb,
      uMean: uMean,
      uAo5: uAo5,
      uAo12: uAo12,
      uAo50: uAo50,
      uAo100: uAo100,
      uAo1000: uAo1000,
      uDesviation: "Pending",
      uCount: uCount,
      uCubingTime: uCubingTime,
    });
  } catch (error) {
    console.log(error);
  }
};
