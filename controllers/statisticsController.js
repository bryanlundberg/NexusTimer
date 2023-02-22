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
  try {
    console.log("hola");
    const userId = req.params.idUser;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }




  } catch (err) {
    console.log(err);
  }
};

exports.stats = async (req, res) => {
  try {
    const { category, cube, idUser } = req.params;
    const user = await User.findById(idUser);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    console.log(category, cube);

    function solvesTime(arraySolves) {
      const result = arraySolves.reduce((acc, element) => {
        if (typeof element.solveTime !== "number") {
          console.log("element.solveTime is not a number");
          return acc;
        }
        return acc + element.solveTime;
      }, 0);
      return result;
    }

    function mean(arraySolves) {
      let x = 0;
      arraySolves.forEach((element) => {
        x += element.solveTime;
      });
      return (x / arraySolves.length / 1000).toFixed(2);
    }

    function getAvg(solutions, avgNumber) {
      if (solutions.length < avgNumber) {
        return "-";
      }
      const lastSolves = solutions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, avgNumber);
      let x = 0;
      lastSolves.forEach((element) => {
        x += element.solveTime;
      });
      return (x / avgNumber / 1000).toFixed(2);
    }

    if (category === "overall" && cube === "overall") {
      const totalSolves = await Solve.find({ owner: user._id });
      const solvingTime = solvesTime(totalSolves);

      return res.json({
        solvingTime,
        pb: "-",
        avg: "-",
        result5: "-",
        result12: "-",
        result50: "-",
        result100: "-",
        result1000: "-",
        desviation: "-",
        solvesCount: totalSolves.length,
      });
    }

    const solves = await Solve.find({ owner: user._id, category: category });
    if (!solves) {
      return res.json({
        solvingTime,
        pb: "-",
        avg: "-",
        result5: "-",
        result12: "-",
        result50: "-",
        result100: "-",
        result1000: "-",
        desviation: "-",
        solvesCount: "-",
      });
    }

    if (cube !== "overall") {
      const solvesByCube = await Solve.find({
        owner: user._id,
        category: category,
        cube: cube,
      });

      const solvingTime = solvesTime(solvesByCube);
      const pb = solvesByCube.sort((a, b) => a.solveTime - b.solveTime);
      const avg = mean(solvesByCube);
      const result5 = getAvg(solvesByCube, 5);
      const result12 = getAvg(solvesByCube, 12);
      const result50 = getAvg(solvesByCube, 50);
      const result100 = getAvg(solvesByCube, 100);
      const result1000 = getAvg(solvesByCube, 1000);
      const desviation = "1";
      const solvesCount = solvesByCube.length;

      return res.json({
        solvingTime,
        pb: (pb[0] / 1000).toFixed(2),
        avg,
        result5,
        result12,
        result50,
        result100,
        result1000,
        desviation,
        solvesCount,
      });
    }

    const solvesCategory = await Solve.find({
      owner: user._id,
      category: category,
    });

    const solvingTime = solvesTime(solvesCategory);
    const pb = solvesCategory.sort((a, b) => a.timeSolve - b.timeSolve);
    const avg = mean(solvesCategory);
    const result5 = getAvg(solvesCategory, 5);
    const result12 = getAvg(solvesCategory, 12);
    const result50 = getAvg(solvesCategory, 50);
    const result100 = getAvg(solvesCategory, 100);
    const result1000 = getAvg(solvesCategory, 1000);
    const desviation = "1";
    const solvesCount = solvesCategory.length;

    return res.json({
      solvingTime,
      pb: (pb[0].solveTime / 1000).toFixed(2),
      avg,
      result5,
      result12,
      result50,
      result100,
      result1000,
      desviation,
      solvesCount,
    });

    console.log("llego a stats");
  } catch (error) {
    console.log(error);
  }
};
