const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SolveSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  solveTime: {
    type: Number,
  },

  cube: {
    type: Schema.Types.ObjectId,
    ref: "Cube",
    required: true,
  },

  category: {
    type: String,
  },

  brand: {
    type: String,
  },

  endDate: {
    type: Number,
    required: true,
  },
	
	startDate: {
		type: Number,
		required: true,
	},

  scramble: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Solve", SolveSchema);
