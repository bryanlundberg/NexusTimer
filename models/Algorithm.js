const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlgorithmSchema = new Schema({
	
	algSet: {
		type: Schema.Types.ObjectId, 
		ref: "AlgSet", 
		required: true
	},

	name: {
		type: String,
		default: "ollx",
		unique: true
	},
			
	thumbnail: {
		type: String,
		default: "/images/collection/pll.png"
	},
	
	alg: {
		type: String,
		default: "(R U2 R') (U' R U R') (U' R U' R')"
	},
	
	learnStatus: [{
		user: { 
			type: Schema.Types.ObjectId, 
			ref: "User",
			unique: true,
			index: true
		},
		
		status: {
			type: String, 
			default: "off"
		}

	}]

})

module.exports = mongoose.model("Algorithm", AlgorithmSchema)