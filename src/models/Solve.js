const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SolveSchema = new Schema({
	
	owner: { 
		type: Schema.Types.ObjectId, 
		ref: "User", 
		required: true 
	},
	
	solveTime: { 
		type: Number
	},
	
	cube: {
		type: Schema.Types.ObjectId, 
		ref: "Cube", 
		required: true 
	},
	
	category: { 
		type: String
	},
	
	brand: { 
		type: String
	},
	
	date: {
		type: Date,
		default: Date.now()
	},
	
	scramble: {
		type: String,
		default: `F U R U'`
	}
	
})

module.exports = mongoose.model("Solve", SolveSchema)