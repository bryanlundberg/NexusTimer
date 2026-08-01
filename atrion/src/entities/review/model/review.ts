import mongoose, { type Model, type Types } from 'mongoose'

const { Schema, model, models } = mongoose

export interface ReviewDoc {
  _id: string
  userId: Types.ObjectId
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<ReviewDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String
  },
  { collection: 'feedbacks', strict: false, timestamps: true }
)

export const Review: Model<ReviewDoc> =
  (models.Feedback as Model<ReviewDoc>) ?? model<ReviewDoc>('Feedback', ReviewSchema)
