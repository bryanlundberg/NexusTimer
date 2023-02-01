const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpeedcubeSchema = new Schema({
	
	
	owner: { 
		type: Schema.Types.ObjectId, 
		ref: "User", 
		required: true 
	},
	
	solve_counter: {
		type: Number,
		default: 0
	},
	
	best_ao5: {
		type: String,
		default: "0.00"
	},
	
	best_time: {
		type: String,
		default: "0.00"
	},
	
	brand: {
		type: String,
		default: "-"
	},
	category: {
		type: String,
		default: "-"
	}
	
})

module.exports = mongoose.model("Speedcube", SpeedcubeSchema)