import { Schema, model } from 'mongoose'

const feedbackSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' }
  },
  { timestamps: true }
)

feedbackSchema.index({ userId: 1 })
feedbackSchema.index({ createdAt: -1 })

export const FeedbackModel = model('Feedback', feedbackSchema)
