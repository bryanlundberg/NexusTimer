import { Schema, models, model } from 'mongoose'

export interface PasswordResetTokenDocument {
  _id: string
  userId: string
  oobCode: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

const PasswordResetTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    oobCode: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
)

PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default models.PasswordResetToken || model('PasswordResetToken', PasswordResetTokenSchema)
