const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlgSetSchema = new Schema({
	
	collection: {
		type: Schema.Types.ObjectId,
		ref: "Collection"
	}
	name: {
		type: String
	},
	
	thumbnail: {
		type: String,
		default: "/images/collection/pll.png"
	},
	
	algorithms:  [
		{
			type: Schema.Types.ObjectId, 
			ref: "Algorithm"
		}
	],
	
})

module.exports = mongoose.model("AlgSet", AlgSetSchema)