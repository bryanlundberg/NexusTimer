const User = require("../models/User");
const Solve = require("../models/Solve");
const Cube = require("../models/Cube");

exports.categoryTimerStats = async (req, res) => {
  try {
    const category = req.params.category;
    const userId = req.params.idUser;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const result = await Solve.find({
      owner: user._id,
      category: `${category}`,
    });

    if (result.length === 0) {
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

    function getAvg(solutions, avgNumber) {
      const lastSolves = solutions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, avgNumber);
      let x = 0;
      lastSolves.forEach((element) => {
        x += element.solveTime;
      });
      return (x / avgNumber / 1000).toFixed(2);
    }

    const pb = result.sort((a, b) => a.timeSolve - b.timeSolve);
    function avgMean(array) {
      let x = 0;
      array.forEach((element) => {
        x += element.solveTime;
      });
      return (x / array.length / 1000).toFixed(2);
    }

    const avg = avgMean(result);
    const result5 = getAvg(result, 5);
    const result12 = getAvg(result, 12);
    const result50 = getAvg(result, 50);
    const result100 = getAvg(result, 100);

    res.json({
      avg5: result5,
      avg12: result12,
      avg50: result50,
      avg100: result100,
      pb: (pb[0].solveTime / 1000).toFixed(2),
      counter: result.length,
      desviation: 1.5,
      avg: avg,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.overallProfileStats = async (req, res) => {
  /*   try {
    console.log("hola");
    const userId = req.params.idUser;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    console.log(err);
  } */
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

    function findBestTime(solveTimes) {
      if (solveTimes.length === 0) {
        return 0;
      }
      let bestTime = solveTimes[0].solveTime;
      solveTimes.forEach((time) => {
        if (time.solveTime < bestTime) {
          bestTime = time.solveTime;
        }
      });
      return bestTime;
    }

    function getBestAverage(array, ao) {
      if (array.length === 0 || array.length < ao) {
        return 0;
      }
      let lowestAvg = Infinity;
      const maxIndex = array.length - ao;
      for (let i = maxIndex; i >= 0; i--) {
        const group = array.slice(i, i + ao);
        const groupAvg = group.reduce((sum, x) => sum + x.solveTime, 0) / ao;
        if (groupAvg < lowestAvg) {
          lowestAvg = groupAvg;
        }
      }
      return lowestAvg;
    }

    function calculateCubingTime(array) {
      if (array.length === 0) {
        return 0;
      }
      let cubingTime = 0;
      array.forEach(element => {
				cubingTime += element.solveTime;
			})
      return cubingTime;
    }

    function calculateAverage(array) {
      if (array.length === 0) {
        return 0;
      }
      const sum = array.reduce(
        (accumulator, currentValue) => accumulator + currentValue.solveTime,
        0
      );
      const length = array.length;
      const average = sum / length;
      return average;
    }

    const cPb = findBestTime(solvesByCategory);
    const cMean = calculateAverage(solvesByCategory);
    const cAo5 = getBestAverage(solvesByCategory, 5);
    const cAo12 = getBestAverage(solvesByCategory, 12);
    const cAo50 = getBestAverage(solvesByCategory, 50);
    const cAo100 = getBestAverage(solvesByCategory, 100);
    const cAo1000 = getBestAverage(solvesByCategory, 1000);
    const cCount = solvesByCategory.length;
    const cCubingTime = calculateCubingTime(solvesByCategory);

    const uPb = findBestTime(solvesByCategory);
    const uMean = calculateAverage(solvesByCategory);
    const uAo5 = getBestAverage(solvesByCategory, 5);
    const uAo12 = getBestAverage(solvesByCategory, 12);
    const uAo50 = getBestAverage(solvesByCategory, 50);
    const uAo100 = getBestAverage(solvesByCategory, 100);
    const uAo1000 = getBestAverage(solvesByCategory, 1000);
    const uCount = solvesByCategory.length;
    const uCubingTime = calculateCubingTime(solvesByCategory);

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
