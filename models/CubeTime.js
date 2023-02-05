const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CubeTimeSchema = new Schema({
	time: { 
		type: String
	},
	category: {
		type: String 
	},
	author: { 
		type: Schema.Types.ObjectId, 
		ref: "User", 
		required: true 
	}
})

module.exports = mongoose.model("CubeTime", CubeTimeSchema)