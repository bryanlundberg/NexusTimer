const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
	type: String,
	unique: true,
	required: true
  },
  email: {
	type: String,
	//unique: true,
	required: true
  },
  password: {
	type: String,
	required: true
  }
  tokenConfirm: {
	  type: String,
	  default: null
  }
  
})


module.exports = mongoose.model("Users", UserSchema)


