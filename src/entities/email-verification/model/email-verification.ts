import { Schema, models, model, Types } from 'mongoose'

export interface EmailVerificationDocument {
  _id: string
  userId: Types.ObjectId
  code: string
  expiresAt: Date
  createdAt: Date
}

const EmailVerificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    code: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
)

// MongoDB auto-deletes documents once expiresAt is reached
EmailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
EmailVerificationSchema.index({ userId: 1 })

export default models.EmailVerification || model('EmailVerification', EmailVerificationSchema)
