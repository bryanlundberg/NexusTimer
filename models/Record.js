const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecordSchema = new Schema({
	time: {type: String},
	category: {type: String }
	//link userID later
})

module.exports = mongoose.model("CubeRecords", RecordSchema)