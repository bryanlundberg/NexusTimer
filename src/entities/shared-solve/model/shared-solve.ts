import { Schema, models, model, type Types } from 'mongoose'
import { CUBE_CATEGORIES, type CubeCategory } from '@/shared/const/cube-categories'
import type { SolveReplay } from '@/entities/replay/model/types'

export interface SharedSolveDocument {
  _id: Types.ObjectId
  slug: string
  user: Types.ObjectId
  localSolveId: string
  puzzle: CubeCategory
  time: number
  plus2: boolean
  dnf: boolean
  scramble: string
  solvedAt: number
  replay?: SolveReplay
  createdAt: Date
  updatedAt: Date
}

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

const SharedSolveSchema = new Schema(
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
    replay: { type: ReplaySchema, required: false }
  },
  { timestamps: true }
)

SharedSolveSchema.index({ slug: 1 }, { unique: true })
SharedSolveSchema.index({ user: 1, localSolveId: 1 }, { unique: true })
SharedSolveSchema.index({ user: 1, _id: -1 })

export default models.SharedSolve || model('SharedSolve', SharedSolveSchema)
