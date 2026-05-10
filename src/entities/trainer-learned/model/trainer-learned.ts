import { model, models, Schema } from 'mongoose'

export type { TrainerLearnedDocument } from '@/entities/trainer-learned/model/types'

const TrainerLearnedSchema = new Schema(
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
    }
  },
  { timestamps: true }
)

TrainerLearnedSchema.index({ user: 1, methodSlug: 1, caseId: 1 }, { unique: true })
TrainerLearnedSchema.index({ user: 1, methodSlug: 1 })

export default models.TrainerLearned || model('TrainerLearned', TrainerLearnedSchema)
