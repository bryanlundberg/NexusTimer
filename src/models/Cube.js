const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CubeSchema = new Schema({
	
	owner: { 
		type: Schema.Types.ObjectId, 
		ref: "User",
		required: true
	},
	
	name: {
		type: String,
		default: "-"
	},
	
	brand: {
		type: String,
		default: "-"
	},
	category: {
		type: String,
		default: "-"
	},
	
	createdAt: {
		type: Date,
		default: Date.now
	}
	
})


module.exports = mongoose.model("Cube", CubeSchema)