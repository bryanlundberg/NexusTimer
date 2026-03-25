import { Schema, models, model } from 'mongoose'

export interface FeedbackDocument {
  _id: string
  userId: Schema.Types.ObjectId
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

const FeedbackSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

FeedbackSchema.index({ userId: 1 })
FeedbackSchema.index({ createdAt: -1 })

export default models.Feedback || model('Feedback', FeedbackSchema)
