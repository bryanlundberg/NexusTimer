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
	
	startDate: {
		type: Number,
		required: true,
	},

  scramble: {
    type: String,
    required: true,
  },
});

SolveSchema.virtual("formatedTime").get(function () {
	const convertMsToTime = (milliseconds) => {
		let seconds = Math.floor((milliseconds / 1000) % 60);
		let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
		let timeInSeconds = (milliseconds / 1000).toFixed(3);
		if (minutes === 0) {
			return timeInSeconds;
		}
		let timeInMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
		let timeInSecondsFormatted = seconds < 10 ? `0${seconds}` : `${seconds}`;
		let time = `${timeInMinutes}:${timeInSecondsFormatted}`;
		return time;
	}
	
	const time = convertMsToTime(this.solveTime);
	return time;
	
});

module.exports = mongoose.model("Solve", SolveSchema);
