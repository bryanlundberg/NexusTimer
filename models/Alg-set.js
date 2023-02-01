const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlgSetSchema = new Schema({
	
	owner: { 
		type: Schema.Types.ObjectId, 
		ref: "User", 
		required: true 
	},
	
	set_name: {
		type: String,
		default: "oll"
	},
	
	algorithms: [
	  {
		type: Schema.Types.ObjectId, 
		ref: "Algorithm"
	  }
	]
	
})

module.exports = mongoose.model("AlgSet", AlgSetSchema)