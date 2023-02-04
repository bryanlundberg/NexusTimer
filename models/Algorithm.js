const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlgorithmSchema = new Schema({
	
	owner: {
		type: Schema.Types.ObjectId, 
		ref: "User", 
	},
	
	algSet: {
		type: String, 
		required: true
	},
	
	img: {
		type: String,
		default: "/images/collection/pll.png"
	},

	name: {
		type: String,
		default: "ollx",
	},
			
	thumbnail: {
		type: String,
		default: "/images/collection/pll.png"
	},
	
	alg: {
		type: String,
		default: "(R U2 R') (U' R U R') (U' R U' R')"
	},
	
	status: {
		type: String,
		default: "off"
	}

})

module.exports = mongoose.model("Algorithm", AlgorithmSchema)