const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({

	name: { 
		type: String
	},
	
	algSet: [
		{
			type: Schema.Types.ObjectId, 
			ref: "AlgSet"
		}
	]

})

module.exports = mongoose.model("Collection", CollectionSchema)