const User = require("../models/User");
const Solve = require("../models/Solve");

exports.categoryStats = async (req, res) => {
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
		  avg5: 0.000,
		  avg12: 0.000,
		  avg50: 0.000,
		  avg100: 0.000,
		  pb: 0.000,
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
      return (x / avgNumber / 1000).toFixed(3);
    };
	
	const pb = result.sort((a, b) => a.timeSolve - b.timeSolve);
	function avgMean(array) {
	  let x = 0;
      array.forEach((element) => {
        x += element.solveTime;
      });
      return (x / result.length / 1000).toFixed(3);
	};
	
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
	  pb: (pb[0].solveTime/1000).toFixed(3),
	  counter: result.length,
	  desviation: 1.5,
	  avg: avg,
    });
  } catch (err) {
    console.log(err);
  }
};
