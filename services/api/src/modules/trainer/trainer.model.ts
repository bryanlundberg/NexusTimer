import { Schema, model } from 'mongoose'

const trainerSolveSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'user is required'] },
    methodSlug: { type: String, required: [true, 'methodSlug is required'] },
    caseId: { type: String, required: [true, 'caseId is required'] },
    timeMs: { type: Number, required: [true, 'timeMs is required'], min: 0 }
  },
  { timestamps: true }
)

trainerSolveSchema.index({ user: 1, methodSlug: 1, caseId: 1, _id: -1 })
trainerSolveSchema.index({ user: 1, methodSlug: 1, _id: -1 })

const trainerLearnedSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'user is required'] },
    methodSlug: { type: String, required: [true, 'methodSlug is required'] },
    caseId: { type: String, required: [true, 'caseId is required'] }
  },
  { timestamps: true }
)

trainerLearnedSchema.index({ user: 1, methodSlug: 1, caseId: 1 }, { unique: true })
trainerLearnedSchema.index({ user: 1, methodSlug: 1 })

const trainerStatsSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'user is required'] },
    methods: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true, minimize: false }
)

trainerStatsSchema.index({ user: 1 }, { unique: true })

export const TrainerSolveModel = model('TrainerSolve', trainerSolveSchema)
export const TrainerLearnedModel = model('TrainerLearned', trainerLearnedSchema)
export const TrainerStatsModel = model('TrainerStats', trainerStatsSchema)
