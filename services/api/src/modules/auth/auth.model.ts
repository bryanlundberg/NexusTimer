import { Schema, model } from 'mongoose'

const pendingRegistrationSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
)

pendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const passwordResetTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    oobCode: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
)

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const PendingRegistrationModel = model('PendingRegistration', pendingRegistrationSchema)
export const PasswordResetTokenModel = model('PasswordResetToken', passwordResetTokenSchema)
