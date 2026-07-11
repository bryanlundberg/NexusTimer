import { model, models, Schema } from 'mongoose'
import { TRAINER_PENALTIES, TrainerPenalty } from '@/entities/trainer-solve/model/constants'

export type { TrainerPenalty }

export interface TrainerSolveDocument {
  _id: string
  user: string
  methodSlug: string
  caseId: string
  timeMs: number
  penalty: TrainerPenalty
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
    },
    penalty: {
      type: String,
      enum: TRAINER_PENALTIES,
      default: 'OK'
    }
  },
  { timestamps: true }
)

TrainerSolveSchema.index({ user: 1, methodSlug: 1, caseId: 1, _id: -1 })
TrainerSolveSchema.index({ user: 1, methodSlug: 1, _id: -1 })

export default models.TrainerSolve || model('TrainerSolve', TrainerSolveSchema)
