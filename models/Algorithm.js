const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlgorithmSchema = new Schema({
	
	owner: {
		type: Schema.Types.ObjectId, 
		ref: "AlgSet"
	},

	name: {
		type: String,
		default: "ollx"
	},
			
	thumbnail: {
		type: String,
		default: "/images/collection/pll.png"
	},
			
	learnStatus: { 
		type: String, 
		default: "off"
	},

	alg: {
		type: String,
		default: "(R U2 R') (U' R U R') (U' R U' R')"
	}

}

module.exports = mongoose.model("Algorithm", AlgorithmSchema)