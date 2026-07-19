import { model, models, Schema } from 'mongoose'

export const LEADERBOARD_PUZZLES = ['3x3x3', '2x2x2'] as const
export type LeaderboardPuzzle = (typeof LEADERBOARD_PUZZLES)[number]

const ReplayMoveSchema = new Schema(
  {
    m: { type: String, required: true },
    t: { type: Number, required: true }
  },
  { _id: false }
)

const ReplaySchema = new Schema(
  {
    version: { type: Number, required: true },
    puzzle: { type: String, required: true },
    scramble: { type: String, required: true },
    durationMs: { type: Number, required: true },
    moves: { type: [ReplayMoveSchema], default: [] }
  },
  { _id: false }
)

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
    },
    replay: {
      type: ReplaySchema,
      required: false
    }
  },
  { timestamps: true }
)

SolveSchema.index({ puzzle: 1, smart: 1, time: 1, createdAt: 1 })
SolveSchema.index({ time: 1, createdAt: 1 })

export default models.Solve || model('Solve', SolveSchema)
