import { Schema, models, model } from 'mongoose'

export interface PendingRegistrationDocument {
  _id: string
  email: string
  name: string
  passwordHash: string
  code: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

const PendingRegistrationSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
)

PendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default models.PendingRegistration || model('PendingRegistration', PendingRegistrationSchema)
