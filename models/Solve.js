const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SolveSchema = new Schema({
	
	owner: { 
		type: Schema.Types.ObjectId, 
		ref: "User", 
		required: true 
	},
	
	time: { 
		type: String,
		default: "-"
	},
	
	category: {
		type: String,
		default: "-"
	},
	
	cube: {
		type: Schema.Types.ObjectId, 
		ref: "Speedcube", 
		required: true 
	}
	
})

module.exports = mongoose.model("Solve", SolveSchema)