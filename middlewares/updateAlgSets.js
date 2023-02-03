const User = require("../models/User");
const AlgSet = require("../models/AlgSet");
const Algorithm = require("../models/Algorithm");


module.exports = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.idUser)
		if (!user) { throw new Error("User not found") }
		
		let ollSet;
		while (!ollSet) {
		  ollSet = await AlgSet.findOne({ name: "OLL" });
		  if (!ollSet) {
			const OLL = new AlgSet({
			  name : "OLL"
			  //thumbnail
			});
			await OLL.save();
			console.log("alg set oll created");
		  }
		}
		
		const algorithmsOll = await Algorithm.find({ algSet: ollSet._id});
		console.log(algorithmsOll)
		if (algorithmsOll.length !== 57) {
			
			const createAlgs = []
			for (let i = 1; i<=57; i++) {
				createAlgs.push({
					algSet: ollSet._id,
					name: `OLL${i}`,
					learnStatus: {
						user: user._id,
						status: "off"
					}
					
				})
			}
			await Algorithm.create(createAlgs);
			console.log("created algs")
			
		}
			
	return next();

	} catch (error) {
		console.log(error)
	}
	
}
