const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlgorithmSchema = new Schema({

	learnedByUser: [
		{ 
			type: Schema.Types.ObjectId, 
			ref: "User"
		},
		
		{ 
			learnStatus: String, 
			default: "off"
		}
	],

	algSet: {
		type: Schema.Types.ObjectId, 
		ref: "AlgSet", 
		required: true 
	},
	
	name: {
		type: String,
		default: "ollx"
	},
	
	alg: {
		type: String,
		default: "(R U2 R') (U' R U R') (U' R U' R')"
	},
	
	img: {
		type: String,
		default: "/images/collection/pll.png"
	},

})

module.exports = mongoose.model("Algorithm", AlgorithmSchema)