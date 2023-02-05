const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const AchievementSchema = new Schema({
  owner: {
	type: Schema.Types.ObjectId, 
	ref: "User", 
	required: true 
  },
  
  title: {
	type: String,
	required: true
  },
  
  description: {
	type: String,
	required: true
  },
  
  unlocked_date: {
	type: Date,
	default: "-"
  },
  
  imagen: {
	  type: String,
	  default: "/images/profile/gears.png"
  }
  
})

module.exports = mongoose.model("Achievement", AchievementSchema)
