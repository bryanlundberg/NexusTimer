const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlgSetSchema = new Schema({
	
	name: { 
		type: String,
		default: "OLL",
		unique: true
		
	},
	
	thumbnail: {
		type: String,
		default: "/images/collection/pll.png"
	}

});

module.exports = mongoose.model("AlgSet", AlgSetSchema)