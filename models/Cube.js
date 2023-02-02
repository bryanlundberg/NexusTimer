const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CubeSchema = new Schema({
	
	owner: { 
		type: Schema.Types.ObjectId, 
		ref: "User", 
		required: true 
	},
	
	solve_counter: {
		type: Number,
		default: 0
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


module.exports = mongoose.model("Cube", CubeSchema)