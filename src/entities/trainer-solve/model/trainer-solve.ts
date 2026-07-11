import { model, models, Schema } from 'mongoose'

export interface TrainerSolveDocument {
  _id: string
  user: string
  methodSlug: string
  caseId: string
  timeMs: number
  createdAt: Date
  updatedAt: Date
}

const TrainerSolveSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user is required']
    },
    methodSlug: {
      type: String,
      required: [true, 'methodSlug is required']
    },
    caseId: {
      type: String,
      required: [true, 'caseId is required']
    },
    timeMs: {
      type: Number,
      required: [true, 'timeMs is required'],
      min: 0
    }
  },
  { timestamps: true }
)

TrainerSolveSchema.index({ user: 1, methodSlug: 1, caseId: 1, _id: -1 })
TrainerSolveSchema.index({ user: 1, methodSlug: 1, _id: -1 })

export default models.TrainerSolve || model('TrainerSolve', TrainerSolveSchema)
