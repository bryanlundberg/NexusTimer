import { CUBE_CATEGORIES } from '@nexustimer/contracts'
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

const sharedSolveSchema = new Schema(
  {
    slug: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    localSolveId: { type: String, required: true },
    puzzle: { type: String, enum: CUBE_CATEGORIES, required: true },
    time: { type: Number, required: true },
    plus2: { type: Boolean, default: false },
    dnf: { type: Boolean, default: false },
    scramble: { type: String, required: true },
    solvedAt: { type: Number, required: true },
    replay: { type: replaySchema, required: false }
  },
  { timestamps: true }
)

sharedSolveSchema.index({ slug: 1 }, { unique: true })
sharedSolveSchema.index({ user: 1, localSolveId: 1 }, { unique: true })
sharedSolveSchema.index({ user: 1, _id: -1 })

export const SharedSolveModel = model('SharedSolve', sharedSolveSchema)
