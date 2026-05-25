import { model, models, Schema } from 'mongoose'

export const LEADERBOARD_PUZZLES = ['3x3x3', '2x2x2'] as const
export type LeaderboardPuzzle = (typeof LEADERBOARD_PUZZLES)[number]

const SolveSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user ID']
    },
    time: {
      type: Number,
      required: [true, 'Please provide a solve time']
    },
    scramble: {
      type: String,
      required: [true, 'Please provide a scramble']
    },
    solution: {
      type: String,
      required: false
    },
    puzzle: {
      type: String,
      enum: LEADERBOARD_PUZZLES,
      required: [true, 'Please provide a cube type']
    },
    smart: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export default models.Solve || model('Solve', SolveSchema)
