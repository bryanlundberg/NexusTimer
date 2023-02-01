const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlgorithmSchema = new Schema({
	
	owner: { 
		type: Schema.Types.ObjectId, 
		ref: "User", 
		required: true 
	},
	
	learned: {
		type: boolean,
		default: false
	}

})

module.exports = mongoose.model("Algorithm", AlgorithmSchema)
	
	
	
	
	