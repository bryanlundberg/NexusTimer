import { LEADERBOARD_PUZZLES } from '@nexustimer/contracts'
import { Schema, model } from 'mongoose'

const replayMoveSchema = new Schema(
  {
    m: { type: String, required: true },
    t: { type: Number, required: true }
  },
  { _id: false }
)

const replaySchema = new Schema(
  {
    version: { type: Number, required: true },
    puzzle: { type: String, required: true },
    scramble: { type: String, required: true },
    durationMs: { type: Number, required: true },
    moves: { type: [replayMoveSchema], default: [] }
  },
  { _id: false }
)

const solveSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Please provide a user ID'] },
    time: { type: Number, required: [true, 'Please provide a solve time'] },
    scramble: { type: String, required: [true, 'Please provide a scramble'] },
    solution: { type: String, required: false },
    puzzle: { type: String, enum: LEADERBOARD_PUZZLES, required: [true, 'Please provide a cube type'] },
    smart: { type: Boolean, default: false },
    replay: { type: replaySchema, required: false }
  },
  { timestamps: true }
)

solveSchema.index({ puzzle: 1, smart: 1, time: 1, createdAt: 1 })
solveSchema.index({ time: 1, createdAt: 1 })

export const SolveModel = model('Solve', solveSchema)
