const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlgSetSchema = new Schema({
	
	owner: {
		type: Schema.Types.ObjectId, 
		ref: "User"
	},
	
	name: { 
		type: String,
		default: "OLL"
	},
	
	thumbnail: {
		type: String,
		default: "/images/collection/pll.png"
	}

})

module.exports = mongoose.model("AlgSet", AlgSetSchema)